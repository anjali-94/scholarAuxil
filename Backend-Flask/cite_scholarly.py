# citation_service.py

import scholarly
import re
from typing import Dict, List, Any, Optional
from scholarly import ProxyGenerator



def clean_text(text: str) -> str:
    """Clean extracted text to improve query accuracy"""
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    # Remove common PDF artifacts
    text = re.sub(r'^\d+$', '', text, flags=re.MULTILINE)
    return text

def extract_title(text: str) -> str:
    """Extract potential title from text (usually in the first few lines)"""
    lines = text.split('\n')
    # Try to get the first substantial line (likely title)
    for line in lines[:10]:  # Look in first 10 lines
        clean_line = line.strip()
        if len(clean_line) > 15 and len(clean_line) < 200:  # Reasonable title length
            return clean_line
    # Fallback to first 100 chars
    return text[:100]

def extract_authors(text: str) -> List[str]:
    """Try to extract author names from the text"""
    # Simple heuristic: look for lines with potential author names
    # This is basic - scholarly usually works better with just the title
    lines = text.split('\n')
    author_pattern = r'^[A-Z][a-z]+ [A-Z][a-z]+(?:,|$| and | et al)'
    for line in lines[1:20]:  # Skip title, check next 20 lines
        if re.search(author_pattern, line):
            # Split by commas or 'and'
            authors = re.split(r',| and ', line)
            return [a.strip() for a in authors if a.strip()]
    return []

def get_citations_from_text(text: str, citation_styles: List[str] = ['apa', 'mla', 'chicago']) -> Dict[str, Any]:
    """
    Generate citations in different styles from paper text
    
    Args:
        text: The extracted text from PDF
        citation_styles: List of citation styles to generate
        
    Returns:
        Dictionary with citation information
    """
    text = clean_text(text)
    title = extract_title(text)
    authors = extract_authors(text)
    
    try:
        # Create scholarly search query
        search_query = scholarly.search_publications(title)
        
        # Get the first (most relevant) result
        paper = next(search_query, None)
        
        if not paper:
            return {
                "success": False,
                "message": "No matching publication found",
                "query": title
            }
        
        # Retrieve complete data for the paper
        paper_complete = scholarly.fill(paper)
        
        # Format citations in different styles
        citations = {}
        
        # Basic citation information
        citation_info = {
            "title": paper_complete.get('bib', {}).get('title', ''),
            "authors": paper_complete.get('bib', {}).get('author', []),
            "year": paper_complete.get('bib', {}).get('pub_year', ''),
            "venue": paper_complete.get('bib', {}).get('venue', ''),
            "url": paper_complete.get('pub_url', ''),
            "citations_count": paper_complete.get('num_citations', 0)
        }
        
        # Generate citations in requested styles
        for style in citation_styles:
            citations[style] = format_citation(citation_info, style)
        
        return {
            "success": True,
            "paper_info": citation_info,
            "citations": citations
        }
        
    except Exception as e:
        return {
            "success": False,
            "message": str(e),
            "query": title
        }

def format_citation(info: Dict[str, Any], style: str) -> str:
    """Format citation in the requested style"""
    # Basic implementation - in a production app, consider using a proper citation library
    
    if style == 'apa':
        # APA style: Author, A. A., & Author, B. B. (Year). Title. Venue.
        authors_str = ""
        for i, author in enumerate(info['authors']):
            if i == 0:
                authors_str += f"{author}"
            elif i == len(info['authors']) - 1:
                authors_str += f", & {author}"
            else:
                authors_str += f", {author}"
        
        return f"{authors_str} ({info['year']}). {info['title']}. {info['venue']}."
    
    elif style == 'mla':
        # MLA style: Author, et al. "Title." Venue, Year.
        if info['authors']:
            if len(info['authors']) == 1:
                authors_str = info['authors'][0]
            else:
                authors_str = f"{info['authors'][0]}, et al"
        else:
            authors_str = "Unknown"
            
        return f"{authors_str}. \"{info['title']}.\" {info['venue']}, {info['year']}."
    
    elif style == 'chicago':
        # Chicago style: Author, First Name. Year. "Title." Venue.
        if info['authors']:
            authors_str = info['authors'][0]
        else:
            authors_str = "Unknown"
            
        return f"{authors_str}. {info['year']}. \"{info['title']}.\" {info['venue']}."
    
    else:
        return f"{', '.join(info['authors'])} ({info['year']}). {info['title']}. {info['venue']}."