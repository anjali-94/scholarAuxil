from flask import Flask, request, jsonify
import requests
import fitz  # PyMuPDF
import docx
import easyocr
from werkzeug.utils import secure_filename
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"]) 

API_KEY = "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"

ALLOWED_EXTENSIONS = {'pdf', 'docx', 'png', 'jpg', 'jpeg'}

# Upload folder
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Utility function
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Text extraction functions
def extract_text_from_pdf(filepath):
    text = ""
    doc = fitz.open(filepath)
    for page in doc:
        text += page.get_text()
    return text

def extract_text_from_docx(filepath):
    doc = docx.Document(filepath)
    return "\n".join([para.text for para in doc.paragraphs])

def extract_text_from_image(filepath):
    reader = easyocr.Reader(['en'])  # Language code, e.g., 'en' for English
    result = reader.readtext(filepath)
    return "\n".join([text[1] for text in result])

@app.route('/')
def home():
    return "Backend is running!"

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        # Accept form data
        user_question = request.form.get('question')
        uploaded_file = request.files.get('file')
        uploaded_image = request.files.get('image')

        final_prompt = user_question or ""

        if uploaded_file:
            file_ext = uploaded_file.filename.rsplit('.', 1)[1].lower()
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(uploaded_file.filename))
            uploaded_file.save(filepath)

            # Extract text based on file type
            if file_ext == 'pdf':
                final_prompt += "\n" + extract_text_from_pdf(filepath)
            elif file_ext == 'docx':
                final_prompt += "\n" + extract_text_from_docx(filepath)
            elif file_ext in {'png', 'jpg', 'jpeg'}:
                final_prompt += "\n" + extract_text_from_image(filepath)

            os.remove(filepath)

        if uploaded_image:
            img_path = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(uploaded_image.filename))
            uploaded_image.save(img_path)
            final_prompt += "\n" + extract_text_from_image(img_path)
            os.remove(img_path)

        if not final_prompt.strip():
            return jsonify({'error': 'No input provided.'}), 400

        # Now call the OpenRouter API
        payload = {
            "model": "microsoft/mai-ds-r1:free",
            "messages": [
                {"role": "user", "content": final_prompt}
            ]
        }

        headers = {
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json",
        }

        response = requests.post('https://openrouter.ai/api/v1/chat/completions', headers=headers, json=payload)

        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({'error': 'Failed to fetch response from OpenRouter', 'details': response.text}), response.status_code

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No file selected for uploading'}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        file_ext = filename.rsplit('.', 1)[1].lower()
        extracted_text = ""

        try:
            # Extract text based on file type
            if file_ext == 'pdf':
                extracted_text = extract_text_from_pdf(filepath)
            elif file_ext == 'docx':
                extracted_text = extract_text_from_docx(filepath)
            elif file_ext in {'png', 'jpg', 'jpeg'}:
                extracted_text = extract_text_from_image(filepath)
            else:
                return jsonify({'error': 'Unsupported file type'}), 400

            # Optional: Delete file after processing
            os.remove(filepath)

            return jsonify({'extractedText': extracted_text})

        except Exception as e:
            return jsonify({'error': f'Failed to process file: {str(e)}'}), 500
    else:
        return jsonify({'error': 'File type not allowed'}), 400

if __name__ == "__main__":
    app.run(debug=True)
