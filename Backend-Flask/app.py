from flask import Flask, jsonify, request, render_template, redirect, url_for
from flask_cors import CORS
import os
import PyPDF2
import fitz
import docx
import easyocr
import json
from werkzeug.utils import secure_filename
import processingData as pdf_processor
import get_citations
import traceback
import requests
from plagiarism_checker import check_plagiarism 
from utils.file_extractor import extract_text_from_pdf, extract_text_from_docx, extract_text_from_image, allowed_file
from dotenv import load_dotenv
load_dotenv()

UPLOAD_FOLDER = 'uploads'

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
CORS(app,origins=["http://localhost:5173"]) 

API_KEY = os.getenv("OPENROUTER_API_KEY")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def home():
    return jsonify({"message": "ScholarAuxil API is running!"})

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
    
@app.route('/upload/pdf', methods=['POST'])
def upload_citation_file():
    # Check if the post request has the file part
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    
    # If user does not select file, browser also
    # submit an empty part without filename
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    try:
        if file and allowed_file(file.filename):
            # Save uploaded file
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            
            # Extract and process text with improved citation processing
            extracted_text = pdf_processor.extract_text_with_citations(file_path)
            
            # Save extracted text for debugging
            debug_text_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{filename}_extracted.txt")
            with open(debug_text_path, 'w', encoding='utf-8') as f:
                f.write(extracted_text)
            
            # Get citations from API
            all_citations_response = get_citations.get_citations(extracted_text)
            
            filtered_citations = []

        for citation_obj in all_citations_response:
            filtered_citation = {
                "apa": citation_obj.get("apa", ""),
                "chicago": citation_obj.get("chicago", "")
            }
            filtered_citations.append(filtered_citation)

        return jsonify({
            "citations": filtered_citations
        }), 200
            # # Save citations for debugging
            # debug_citations_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{filename}_citations.json")
            # with open(debug_citations_path, 'w', encoding='utf-8') as f:
            #     json.dump(citations, f, indent=2)
            
            # # Add debugging info to response
            # return jsonify({
            #     "message": "File successfully processed",
            #     "filename": filename,
            #     "citations": citations,
            #     "extracted_text_length": len(extracted_text),
            #     "candidates_found": len(citations) if isinstance(citations, list) else 0
            # })
    except Exception as e:
        error_details = traceback.format_exc()
        print(f"Error processing file: {error_details}")
        return jsonify({
            "error": str(e), 
            "details": error_details
        }), 500
    
    return jsonify({"error": "File type not allowed"}), 400

# chatbot file upload 
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


@app.route('/api/extract-citations', methods=['POST'])
def extract_citations_api():
    """API endpoint for extracting citations from text"""
    try:
        data = request.json
        
        if not data or 'text' not in data:
            return jsonify({"error": "No text provided"}), 400
        
        text = data['text']
        
        # Save input text for debugging
        debug_id = hash(text) % 10000
        debug_text_path = os.path.join(app.config['UPLOAD_FOLDER'], f"api_input_{debug_id}.txt")
        with open(debug_text_path, 'w', encoding='utf-8') as f:
            f.write(text)
        
        # Get citations
        citations = get_citations.get_citations(text)
        
        # Save citations for debugging
        debug_citations_path = os.path.join(app.config['UPLOAD_FOLDER'], f"api_citations_{debug_id}.json")
        with open(debug_citations_path, 'w', encoding='utf-8') as f:
            json.dump(citations, f, indent=2)
        
        return jsonify({
            "citations": citations,
            "debug_id": debug_id
        })
    except Exception as e:
        error_details = traceback.format_exc()
        print(f"API error: {error_details}")
        return jsonify({
            "error": str(e),
            "details": error_details
        }), 500
    
@app.route('/plagiarism/check', methods=['POST'])
def plagiarism_check():
    try:
        # Verify API key for security
        if request.headers.get("x-api-key") != "5cb483dc-18ee-4861-8036-b746ea79d8e5":
            return jsonify({"error": "Unauthorized"}), 401

        # Check if file is uploaded
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        # Read the file content based on the file type
        file_ext = file.filename.rsplit('.', 1)[1].lower()

        if file_ext == 'pdf':
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(file.filename))
            file.save(file_path)
            file_content = extract_text_from_pdf(file_path)
            os.remove(file_path)

        elif file_ext == 'docx':
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(file.filename))
            file.save(file_path)
            file_content = extract_text_from_docx(file_path)
            os.remove(file_path)

        elif file_ext in {'png', 'jpg', 'jpeg'}:
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(file.filename))
            file.save(file_path)
            file_content = extract_text_from_image(file_path)
            os.remove(file_path)

        else:
            file_content = file.read().decode('utf-8', errors='ignore')

        plagiarism_percentage = check_plagiarism(file_content)

        return jsonify({"plagiarism_percentage": plagiarism_percentage, "result": "Plagiarism check complete."})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)



































