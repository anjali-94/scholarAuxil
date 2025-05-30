from flask import Flask, jsonify, request, render_template, redirect, url_for, send_from_directory
from flask_cors import CORS
import os
import PyPDF2
import fitz
import docx
import easyocr
import json
from werkzeug.utils import secure_filename
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
import traceback
import requests
from plagiarism_checker import check_plagiarism 
from utils.file_extractor import extract_text_from_pdf, extract_text_from_docx, extract_text_from_image, allowed_file
from dotenv import load_dotenv
load_dotenv()
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
ALLOWED_EXTENSIONS = {'pdf', 'txt', 'doc', 'docx'}  

app = Flask(__name__)
CORS(app)
# CORS(app,origins=["http://localhost:5173"]) 

API_KEY = os.getenv("OPENROUTER_API_KEY")
app.config['SECRET_KEY'] = os.environ['FLASK_SECRET_KEY']

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(BASE_DIR, 'instance', 'research_repo.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

db = SQLAlchemy(app)

BIBIFY_API_BASE = 'https://api.bibify.org'
@app.route('/')
def home():
    return jsonify({"message": "ScholarAuxil API is running!"})


# --- Database Models ---
class Repository(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    papers = db.relationship('Paper', backref='repository', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'created_at': self.created_at.isoformat(),
            'papers': [paper.to_dict() for paper in self.papers] if self.papers else []
        }

class Paper(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    original_filename = db.Column(db.String(300), nullable=False)
    filepath = db.Column(db.String(300), nullable=False, unique=True)  # Stored filename (secure)
    notes = db.Column(db.Text, nullable=True)
    last_opened = db.Column(db.DateTime, nullable=True)
    last_page_seen = db.Column(db.Integer, nullable=True, default=0)
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)
    repository_id = db.Column(db.Integer, db.ForeignKey('repository.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'original_filename': self.original_filename,
            'filepath': self.filepath,
            'notes': self.notes,
            'last_opened': self.last_opened.isoformat() if self.last_opened else None,
            'last_page_seen': self.last_page_seen,
            'uploaded_at': self.uploaded_at.isoformat(),
            'repository_id': self.repository_id
        }

with app.app_context():
    db.create_all()  # Create tables if they don't exist
    instance_path = os.path.join(BASE_DIR, 'instance')
    if not os.path.exists(instance_path):
        os.makedirs(instance_path)
        print(f"Created directory: {instance_path}")
    
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
        print(f"Created directory: {UPLOAD_FOLDER}")
    print("Database tables checked/created. Necessary folders checked/created.")

# --- Helper Functions ---
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

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
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(file.filename))
        file.save(file_path)

        if file_ext == 'pdf':
            file_content = extract_text_from_pdf(file_path)
        elif file_ext == 'docx':
            file_content = extract_text_from_docx(file_path)
        elif file_ext in {'png', 'jpg', 'jpeg'}:
            file_content = extract_text_from_image(file_path)
        else:
            file_content = file.read().decode('utf-8', errors='ignore')

        os.remove(file_path)

        # Perform plagiarism check
        result = check_plagiarism(file_content)
        plagiarism_percentage = result["plagiarism_percentage"]
        results = result["results"]

        # Format response with colored text (for HTML rendering)
        formatted_results = []
        for res in results:
            sentence = res["sentence"]
            color = res["color"]
            source = res["source"]
            formatted_sentence = f'<span style="color:{color}">{sentence}</span>'
            if source:
                formatted_sentence += f' <a href="{source}" target="_blank">(Source)</a>'
            formatted_results.append(formatted_sentence)

        return jsonify({
            "plagiarism_percentage": plagiarism_percentage,
            "results": formatted_results,
            "message": "Plagiarism check complete."
        })

    except Exception as e:
        logger.error(f"Error in plagiarism check: {str(e)}")
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/repositories', methods=['GET'])
def get_repositories():
    """Returns all repositories as JSON."""
    repositories = Repository.query.order_by(Repository.created_at.desc()).all()
    return jsonify([repo.to_dict() for repo in repositories])

@app.route('/api/repository/new', methods=['GET','POST'])
def create_repository():
    """Handles creation of a new repository via API."""
    data = request.get_json()
    print("Received JSON data:", data)
    if not data or 'name' not in data:
        return jsonify({'error': 'Repository name is required'}), 400
    
    repo_name = data['name'].strip()
    if not repo_name:
        return jsonify({'error': 'Repository name cannot be empty'}), 400
    
    if Repository.query.filter_by(name=repo_name).first():
        return jsonify({'error': 'Repository with this name already exists'}), 409
    
    new_repo = Repository(name=repo_name)
    db.session.add(new_repo)
    db.session.commit()
    return jsonify(new_repo.to_dict()), 201

@app.route('/api/repository/<int:repo_id>', methods=['GET'])
def get_repository(repo_id):
    """Returns a specific repository with its papers as JSON."""
    repo = Repository.query.get_or_404(repo_id)
    return jsonify(repo.to_dict())

@app.route('/api/repository/<int:repo_id>/delete', methods=['POST','DELETE'])
def api_delete_repository(repo_id):
    """Deletes a repository and all its papers via API."""
    repo = Repository.query.get_or_404(repo_id)
    db.session.delete(repo)
    db.session.commit()
    return jsonify({'message': f'Repository "{repo.name}" and all its papers deleted successfully'}), 200

@app.route('/api/paper/upload/<int:repo_id>', methods=['POST','GET'])
def api_upload_paper(repo_id):
    """Handles uploading a new paper to a specific repository via API."""
    repo = Repository.query.get_or_404(repo_id)
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    title = request.form.get('title', '').strip()
    if not title:
        title = os.path.splitext(file.filename)[0]

    if not allowed_file(file.filename):
        return jsonify({'error': 'File type not allowed'}), 400

    try:
        original_filename = secure_filename(file.filename)
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S%f")
        filename = f"{timestamp}_{original_filename}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], str(repo_id))
        os.makedirs(filepath, exist_ok=True)
        file.save(os.path.join(filepath, filename))

        new_paper = Paper(
            title=title,
            original_filename=original_filename,
            filepath=os.path.join(str(repo_id), filename),
            repository_id=repo.id
        )
        db.session.add(new_paper)
        db.session.commit()
        return jsonify(new_paper.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/paper/<int:paper_id>', methods=['PUT', 'POST', 'GET'])
def api_paper_detail(paper_id):
    """Handles paper details via API."""
    paper = Paper.query.get_or_404(paper_id)
    
    if request.method == 'GET':
        # Update last_opened timestamp when the paper is accessed
        paper.last_opened = datetime.utcnow()
        db.session.commit()
        return jsonify(paper.to_dict())
    
    elif request.method == 'PUT':
        data = request.get_json()
        if 'notes' in data:
            paper.notes = data['notes']
        if 'last_page_seen' in data:
            try:
                paper.last_page_seen = int(data['last_page_seen']) if data['last_page_seen'] is not None else None
            except ValueError:
                return jsonify({'error': 'Invalid page number'}), 400
        
        db.session.commit()
        return jsonify(paper.to_dict())

@app.route('/api/paper/<int:paper_id>/delete', methods=['DELETE', 'POST'])
def api_delete_paper(paper_id):
    """Deletes a specific paper via API."""
    paper = Paper.query.get_or_404(paper_id)
    repo_id = paper.repository_id
    
    try:
        full_filepath = os.path.join(app.config['UPLOAD_FOLDER'], paper.filepath)
        if os.path.exists(full_filepath):
            os.remove(full_filepath)
        
        db.session.delete(paper)
        db.session.commit()
        return jsonify({'message': f'Paper "{paper.title}" deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/uploads/<path:filepath>', methods=['GET', 'POST', 'PUT'])
def api_serve_paper(filepath):
    """Serves the uploaded paper files via API."""
    repo_subfolder = os.path.dirname(filepath)  
    filename = os.path.basename(filepath) 
    directory = os.path.join(app.config['UPLOAD_FOLDER'], repo_subfolder)
    return send_from_directory(directory, filename, as_attachment=False)


@app.route('/api/books')
def search_books():
    """Proxy for book search"""
    query = request.args.get('q', '')
    if not query:
        return jsonify({'error': 'Query parameter "q" is required'}), 400
    
    try:
        response = requests.get(
            f'{BIBIFY_API_BASE}/api/books',
            params={'q': query},
            timeout=30
        )
        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({'error': f'API request failed: {str(e)}'}), 500

@app.route('/api/website')
def get_website_info():
    """Proxy for website metadata"""
    url = request.args.get('url', '')
    if not url:
        return jsonify({'error': 'URL parameter is required'}), 400
    
    try:
        response = requests.get(
            f'{BIBIFY_API_BASE}/api/website',
            params={'url': url},
            timeout=30
        )
        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({'error': f'API request failed: {str(e)}'}), 500

@app.route('/api/cite', methods=['GET', 'POST'])
def generate_citation():
    """Proxy for citation generation"""
    try:
        params = dict(request.args)
        logger.debug(f"Sending request to Bibify API with params: {params}")
        response = requests.get(
            f'{BIBIFY_API_BASE}/api/cite',
            params=params,
            timeout=30
        )
        logger.debug(f"Bibify API response status: {response.status_code}")
        logger.debug(f"Bibify API response content: {response.text}")
        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        logger.error(f"Citation generation failed: {str(e)}", exc_info=True)
        return jsonify({'error': f'Citation generation failed: {str(e)}'}), 500
    except ValueError as e:
        logger.error(f"Failed to parse Bibify API response: {str(e)}", exc_info=True)
        return jsonify({'error': f'Invalid response from citation API: {str(e)}'}), 500
    except Exception as e:
        logger.error(f"Unexpected error in citation generation: {str(e)}", exc_info=True)
        return jsonify({'error': f'Unexpected error: {str(e)}'}), 500
    except requests.exceptions.RequestException as e:
        return jsonify({'error': f'Citation generation failed: {str(e)}'}), 500

@app.route('/api/styles')
def get_citation_styles():
    """Proxy for citation styles"""
    limit = request.args.get('limit', '20')
    
    try:
        response = requests.get(
            f'{BIBIFY_API_BASE}/api/styles',
            params={'limit': limit},
            timeout=30
        )
        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({'error': f'Failed to load styles: {str(e)}'}), 500

@app.route('/api/styles/search')
def search_citation_styles():
    """Proxy for citation style search"""
    query = request.args.get('q', '')
    if not query:
        return jsonify({'error': 'Query parameter "q" is required'}), 400
    
    try:
        response = requests.get(
            f'{BIBIFY_API_BASE}/api/styles/search',
            params={'q': query},
            timeout=30
        )
        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({'error': f'Style search failed: {str(e)}'}), 500

@app.route('/api/fields/<media_type>')
def get_citation_fields(media_type):
    """Proxy for citation fields by media type"""
    try:
        response = requests.get(
            f'{BIBIFY_API_BASE}/api/fields/{media_type}',
            timeout=30
        )
        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({'error': f'Failed to get fields: {str(e)}'}), 500

# Health check endpoint
@app.route('/health')
def health_check():
    return jsonify({'status': 'healthy', 'service': 'bibify-proxy'})
    

if __name__ == '__main__':
    app.run(debug=True)

























