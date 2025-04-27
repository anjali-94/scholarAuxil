# Improved preprocess_data.py functions

import os
import re
import PyPDF2
from typing import Dict, List, Any

def extract_text_from_pdf(pdf_path):
    """Extract text from PDF with improved handling"""
    text = ""
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            
            # Store text by page for better processing
            pages_text = []
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                page_text = page.extract_text()
                pages_text.append(page_text)
                text += page_text + "\n\n"  # Add extra newlines between pages
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return ""
    
    return text

def preprocess_text(text):
    """Preprocess text with citation preservation focus"""
    # Replace multiple spaces with single space but preserve newlines
    text = re.sub(r' +', ' ', text)
    
    # Preserve references section and citations carefully
    lines = text.split('\n')
    filtered_lines = []
    
    # Flag to identify when we're in a references section
    in_references = False
    
    for line in lines:
        line = line.strip()
        
        # Skip very short lines unless they might be citations
        if len(line) < 10 and not re.search(r'\(\d{4}\)|\[\d+\]', line):
            continue
            
        # Skip lone digits (likely page numbers)
        if line.isdigit():
            continue
            
        # Identify reference sections
        if re.match(r'^(references|bibliography|works cited)$', line.lower()):
            in_references = True
            filtered_lines.append(line)
            continue
            
        # Keep all lines in reference sections
        if in_references:
            filtered_lines.append(line)
            continue
            
        # Keep lines with citations
        if re.search(r'\([A-Za-z]+\s*(?:et al\.)?(?:,|\s)\s*\d{4}\)|\[\d+\]|\(\d{4}\)', line):
            filtered_lines.append(line)
            continue
            
        # Keep regular text lines that aren't too short
        if len(line) > 20:
            filtered_lines.append(line)
            
    return "\n".join(filtered_lines)

def extract_text_with_citations(pdf_path):
    """Extract and preprocess text with focus on citation preservation"""
    raw_text = extract_text_from_pdf(pdf_path)
    processed_text = preprocess_text(raw_text)
    
    # Also try to extract the references section specifically
    references_section = extract_references_section(raw_text)
    
    # Combine processed text with references section
    if references_section and references_section not in processed_text:
        processed_text += "\n\n" + references_section
        
    return processed_text

def extract_references_section(text):
    """Extract references/bibliography section from text"""
    # Common patterns for reference section headers
    ref_patterns = [
        r'(?:References|Bibliography|Works Cited|Literature Cited)(?:\s|\n)(.*?)(?:\n\s*(?:Appendix|Acknowledgements|$))',
        r'\n(?:References|Bibliography|Works Cited|Literature Cited)(?:\s|\n)(.*?)(?:\Z)'
    ]
    
    for pattern in ref_patterns:
        match = re.search(pattern, text, re.DOTALL | re.IGNORECASE)
        if match:
            return "References\n" + match.group(1).strip()
    
    return ""