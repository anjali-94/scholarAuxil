# app.py with improved debugging
from flask import Flask, jsonify, request, render_template, redirect, url_for
from flask_cors import CORS
import os
import PyPDF2
import json
from werkzeug.utils import secure_filename
import processingData as pdf_processor
import get_citations
import traceback

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
CORS(app)  # Enable CORS for all routes to connect to frontend content sharing

# Create uploads directory if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def home():
    return jsonify({"message": "ScholarAuxil API is running!"})

@app.route('/upload/pdf', methods=['POST'])
def upload_file():
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
            citations = get_citations.get_citations(extracted_text)
            
            # Save citations for debugging
            debug_citations_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{filename}_citations.json")
            with open(debug_citations_path, 'w', encoding='utf-8') as f:
                json.dump(citations, f, indent=2)
            
            # Add debugging info to response
            return jsonify({
                "message": "File successfully processed",
                "filename": filename,
                "citations": citations,
                "extracted_text_length": len(extracted_text),
                "candidates_found": len(citations) if isinstance(citations, list) else 0
            })
    except Exception as e:
        error_details = traceback.format_exc()
        print(f"Error processing file: {error_details}")
        return jsonify({
            "error": str(e), 
            "details": error_details
        }), 500
    
    return jsonify({"error": "File type not allowed"}), 400

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

if __name__ == '__main__':
    app.run(debug=True)