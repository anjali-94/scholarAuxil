# citation_api.py
import requests
import re
from typing import Dict, List, Any, Optional
import json
import time
from dataclasses import dataclass
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry

# Base URLs for API services
CROSSREF_API_URL = "https://api.crossref.org/works"
SEMANTIC_SCHOLAR_API_URL = "https://api.semanticscholar.org/graph/v1"

# Configure session with retry logic for API stability
def create_session():
    session = requests.Session()
    retry = Retry(
        total=5,
        backoff_factor=0.3,
        status_forcelist=[429, 500, 502, 503, 504],
    )
    adapter = HTTPAdapter(max_retries=retry)
    session.mount("http://", adapter)
    session.mount("https://", adapter)
    return session

# Improved citation_api.py extract_citation_candidates function

def extract_citation_candidates(text: str) -> List[Dict[str, Any]]:
    """
    Extract potential citation strings from text using various patterns
    
    Args:
        text: The text to extract citations from
        
    Returns:
        List of dictionaries with extracted citation information
    """
    candidates = []
    
    # Pattern for author-year citations like (Smith et al., 2019)
    # More permissive pattern to catch more variants
    author_year_patterns = [
        # Standard (Author et al., 2020)
        r'(?:\(|\[)([A-Za-z\-\']+(?:\s+(?:&|and|et al\.)?)?(?:,\s+[A-Za-z\-\']+)*)(?:,\s+|\s+)(\d{4})(?:\)|\])',
        
        # Citations with just year (2020)
        r'(?:\(|\[)(\d{4})(?:\)|\])',
        
        # Citations with multiple authors (Smith and Jones, 2020)
        r'(?:\(|\[)([A-Za-z\-\']+(?:\s+and\s+|\s+&\s+)[A-Za-z\-\']+)(?:,\s+|\s+)(\d{4})(?:\)|\])',
        
        # Numbered citations [1] or (1)
        r'(?:\[|\()(\d+)(?:\]|\))',
        
        # Author mentions in text "according to Smith et al. (2020)"
        r'([A-Za-z\-\']+(?:\s+et\s+al\.)?)\s+\(?(\d{4})\)?'
    ]
    
    # Try all citation patterns
    for pattern in author_year_patterns:
        matches = re.finditer(pattern, text)
        
        for match in matches:
            # The pattern with just year will only have one group
            if len(match.groups()) == 1 and match.group(1).isdigit():
                author_part = ""
                year = match.group(1)
            else:
                # Handle numbered citations separately
                if match.group(1).isdigit() and len(match.group(1)) <= 3:
                    author_part = ""
                    year = ""
                    ref_num = match.group(1)
                else:
                    author_part = match.group(1) if len(match.groups()) >= 1 else ""
                    year = match.group(2) if len(match.groups()) >= 2 else ""
            
            # Get surrounding context (larger window)
            start = max(0, match.start() - 150)
            end = min(len(text), match.end() + 150)
            context = text[start:end]
            
            # Try to find title in context
            title = ""
            title_patterns = [
                r'[""]([^""]+)[""]',  # Quoted titles
                r'["\'](.*?)[\'\"]',  # Any quoted text
                r'(?:[Tt]itled|[Ee]ntitled)\s+(.*?)(?:\.|,|\s+(?:was|is|which))'  # "titled X" or "entitled X"
            ]
            
            for t_pattern in title_patterns:
                title_match = re.search(t_pattern, context)
                if title_match:
                    title = title_match.group(1)
                    break
            
            # For numbered citations, look for the reference list
            if author_part == "" and year == "" and 'ref_num' in locals():
                # Try to find reference in a reference list format
                ref_pattern = rf'{ref_num}\.\s+(.*?)(?:\d+\.\s+|\Z)'
                ref_match = re.search(ref_pattern, text)
                if ref_match:
                    ref_text = ref_match.group(1)
                    # Extract author and year from reference text
                    auth_yr_match = re.search(r'([A-Za-z\-\']+(?:\s+et\s+al\.)?),?\s+\(?(\d{4})\)?', ref_text)
                    if auth_yr_match:
                        author_part = auth_yr_match.group(1)
                        year = auth_yr_match.group(2)
                        context += f" [Reference: {ref_text}]"
            
            # Only add if we have either author or year
            if author_part or year:
                candidates.append({
                    "author": author_part,
                    "year": year,
                    "title": title,
                    "context": context
                })
    
    # Extract from reference list directly
    ref_section_patterns = [
        r'(?:References|Bibliography|Works Cited)(?:\s|\n)(.*?)(?:\n\s*(?:Appendix|Acknowledgements|$))',
        r'\n(?:References|Bibliography|Works Cited)(?:\s|\n)(.*?)(?:\Z)'
    ]
    
    for pattern in ref_section_patterns:
        ref_match = re.search(pattern, text, re.DOTALL)
        if ref_match:
            ref_section = ref_match.group(1)
            # Split into individual references
            ref_items = re.split(r'\n\n|\n(?=\d+\.|\[\d+\]|[A-Z])', ref_section)
            
            for ref_item in ref_items:
                # Try to extract author and year
                auth_yr_match = re.search(r'([A-Za-z\-\']+(?:,?\s+(?:et\s+al\.)?)?),?\s+\(?(\d{4})\)?', ref_item)
                
                if auth_yr_match:
                    author_part = auth_yr_match.group(1)
                    year = auth_yr_match.group(2)
                    
                    # Look for a title
                    title = ""
                    title_match = re.search(r'["\']([^"\']+)["\']', ref_item)
                    if title_match:
                        title = title_match.group(1)
                    else:
                        # Try to get title from after author/year
                        title_match = re.search(rf'{re.escape(year)}\)?\.\s+(.*?)(?:\.|\n)', ref_item)
                        if title_match:
                            title = title_match.group(1)
                    
                    candidates.append({
                        "author": author_part,
                        "year": year,
                        "title": title,
                        "context": ref_item.strip()
                    })
    
    # Remove duplicates (based on author and year)
    unique_candidates = []
    seen = set()
    
    for candidate in candidates:
        key = f"{candidate['author']}_{candidate['year']}"
        if key and key not in seen:
            seen.add(key)
            unique_candidates.append(candidate)
    
    return unique_candidates

def get_citations_from_text(text: str) -> List[Dict[str, Any]]:
    """
    Process text and return formatted citations
    
    Args:
        text: Text extracted from PDF
        
    Returns:
        List of citation dictionaries with formatted citations
    """
    # Extract citation candidates
    candidates = extract_citation_candidates(text)
    
    # Get full citation information for each candidate
    citations = []
    for candidate in candidates:
        try:
            citation = get_citation_by_metadata(
                title=candidate.get("title", ""),
                author=candidate.get("author", ""),
                year=candidate.get("year", "")
            )
            
            # Add original context
            citation["context"] = candidate.get("context", "")
            citations.append(citation)
            
            # Rate limiting to avoid API throttling
            time.sleep(0.5)
            
        except Exception as e:
            print(f"Error getting citation: {e}")
            continue
    
    return citations

def get_citation_by_metadata(title: str, author: str, year: str) -> Dict[str, Any]:
    """
    Query the CrossRef API to find citation information based on paper metadata
    
    Args:
        title: Paper title (or part of it)
        author: Author name (or part of it)
        year: Publication year
    
    Returns:
        Dictionary with citation information and formatted citations
    """
    query_params = {}
    
    # Add search parameters if provided
    if title:
        query_params['query.title'] = title
    if author:
        query_params['query.author'] = author
    if year:
        query_params['filter'] = f'from-pub-date:{year},until-pub-date:{year}'
    
    # Add sorting to get most relevant results first
    query_params['sort'] = 'score'
    query_params['order'] = 'desc'
    
    # Best practice: identify your application in the request
    headers = {
        "User-Agent": "ScholarAuxil/1.0 (your@email.com)"
    }
    
    # Make the API request
    session = create_session()
    response = session.get(CROSSREF_API_URL, params=query_params, headers=headers)
    
    if response.status_code != 200:
        # Fallback to semantic scholar if crossref fails
        return get_citation_from_semantic_scholar(title, author, year)
    
    data = response.json()
    
    # Check if we have results
    if 'message' not in data or 'items' not in data['message'] or len(data['message']['items']) == 0:
        # Fallback to semantic scholar if no results
        return get_citation_from_semantic_scholar(title, author, year)
    
    # Get the first (most relevant) result
    paper_data = data['message']['items'][0]
    
    # Extract citation information
    citation = extract_citation_info(paper_data)
    
    # Format citations in different styles
    citation["apa"] = format_apa_citation(citation)
    citation["mla"] = format_mla_citation(citation)
    citation["chicago"] = format_chicago_citation(citation)
    citation["bibtex"] = format_bibtex_citation(citation)
    
    return citation

def get_citation_from_semantic_scholar(title: str, author: str, year: str) -> Dict[str, Any]:
    """
    Fallback to Semantic Scholar API if CrossRef doesn't return results
    
    Args:
        title: Paper title (or part of it)
        author: Author name (or part of it)
        year: Publication year
        
    Returns:
        Dictionary with citation information
    """
    # Construct search query
    query_parts = []
    if title:
        query_parts.append(title)
    if author:
        query_parts.append(author)
    if year:
        query_parts.append(year)
    
    query = " ".join(query_parts)
    
    # Search for papers
    params = {
        "query": query,
        "limit": 1,
        "fields": "title,authors,year,journal,venue,volume,issue,pages,doi,url"
    }
    
    headers = {
        "User-Agent": "ScholarAuxil/1.0 (your@email.com)"
    }
    
    session = create_session()
    response = session.get(f"{SEMANTIC_SCHOLAR_API_URL}/paper/search", params=params, headers=headers)
    
    if response.status_code != 200:
        raise Exception(f"Semantic Scholar API error: {response.status_code} - {response.text}")
    
    data = response.json()
    
    if 'data' not in data or not data['data']:
        raise Exception("No matching publications found")
    
    paper_data = data['data'][0]
    
    # Extract and format citation
    citation = {
        "doi": paper_data.get("doi", ""),
        "title": paper_data.get("title", ""),
        "authors": [f"{author.get('name', '')}" for author in paper_data.get("authors", [])],
        "journal": paper_data.get("venue", paper_data.get("journal", {}).get("name", "")),
        "publisher": "",
        "year": str(paper_data.get("year", "")),
        "volume": paper_data.get("volume", ""),
        "issue": paper_data.get("issue", ""),
        "pages": paper_data.get("pages", ""),
        "url": paper_data.get("url", ""),
        "type": "article",
        "raw_data": paper_data
    }
    
    # Format citations in different styles
    citation["apa"] = format_apa_citation(citation)
    citation["mla"] = format_mla_citation(citation)
    citation["chicago"] = format_chicago_citation(citation)
    citation["bibtex"] = format_bibtex_citation(citation)
    
    return citation

def extract_citation_info(paper_data: Dict[str, Any]) -> Dict[str, Any]:
    """Extract relevant citation information from CrossRef API response"""
    # Extract authors
    authors = []
    if 'author' in paper_data:
        for author in paper_data['author']:
            if 'given' in author and 'family' in author:
                authors.append(f"{author['family']}, {author['given']}")
            elif 'name' in author:
                authors.append(author['name'])
    
    # Extract other metadata
    title = paper_data.get('title', [""])[0] if paper_data.get('title') else ""
    journal = paper_data.get('container-title', [""])[0] if paper_data.get('container-title') else ""
    publisher = paper_data.get('publisher', "")
    
    # Extract year
    year = ""
    if 'published' in paper_data and 'date-parts' in paper_data['published']:
        if paper_data['published']['date-parts'] and paper_data['published']['date-parts'][0]:
            year = paper_data['published']['date-parts'][0][0]
    
    volume = paper_data.get('volume', "")
    issue = paper_data.get('issue', "")
    pages = paper_data.get('page', "")
    
    # Extract DOI if available
    doi = paper_data.get('DOI', "")
    url = f"https://doi.org/{doi}" if doi else ""
    
    return {
        "doi": doi,
        "title": title,
        "authors": authors,
        "journal": journal,
        "publisher": publisher,
        "year": year,
        "volume": volume,
        "issue": issue,
        "pages": pages,
        "url": url,
        "type": paper_data.get('type', ""),
        "raw_data": paper_data  # Include raw API data for debugging/additional processing
    }

def format_apa_citation(citation: Dict[str, Any]) -> str:
    """Format citation in APA style"""
    authors_text = ""
    if citation["authors"]:
        if len(citation["authors"]) == 1:
            authors_text = citation["authors"][0]
        elif len(citation["authors"]) == 2:
            authors_text = f"{citation['authors'][0]} & {citation['authors'][1]}"
        else:
            authors_text = ", ".join(citation["authors"][:-1]) + f", & {citation['authors'][-1]}"
    
    year_text = f"({citation['year']})" if citation["year"] else ""
    
    journal_info = ""
    if citation["journal"]:
        journal_info = f"{citation['journal']}"
        if citation["volume"]:
            journal_info += f", {citation['volume']}"
            if citation["issue"]:
                journal_info += f"({citation['issue']})"
        if citation["pages"]:
            journal_info += f", {citation['pages']}"
    
    doi_text = f"https://doi.org/{citation['doi']}" if citation['doi'] else ""
    
    return f"{authors_text} {year_text}. {citation['title']}. {journal_info}. {doi_text}".strip()

def format_mla_citation(citation: Dict[str, Any]) -> str:
    """Format citation in MLA style"""
    authors_text = ""
    if citation["authors"]:
        if len(citation["authors"]) == 1:
            authors_text = citation["authors"][0]
        elif len(citation["authors"]) == 2:
            authors_text = f"{citation['authors'][0]} and {citation['authors'][1]}"
        else:
            authors_text = citation["authors"][0] + " et al."
    
    journal_info = ""
    if citation["journal"]:
        journal_info = f"{citation['journal']}"
        if citation["volume"]:
            journal_info += f", vol. {citation['volume']}"
        if citation["issue"]:
            journal_info += f", no. {citation['issue']}"
        if citation["year"]:
            journal_info += f", {citation['year']}"
        if citation["pages"]:
            journal_info += f", pp. {citation['pages']}"
    
    doi_text = f"DOI: {citation['doi']}" if citation['doi'] else ""
    
    return f"{authors_text}. \"{citation['title']}.\" {journal_info}. {doi_text}".strip()

def format_chicago_citation(citation: Dict[str, Any]) -> str:
    """Format citation in Chicago style"""
    authors_text = ""
    if citation["authors"]:
        if len(citation["authors"]) == 1:
            authors_text = citation["authors"][0]
        else:
            authors_text = ", ".join(citation["authors"][:-1]) + f", and {citation['authors'][-1]}"
    
    journal_info = ""
    if citation["journal"]:
        journal_info = f"{citation['journal']}"
        if citation["volume"]:
            journal_info += f" {citation['volume']}"
        if citation["issue"]:
            journal_info += f", no. {citation['issue']}"
        if citation["year"]:
            journal_info += f" ({citation['year']})"
        if citation["pages"]:
            journal_info += f": {citation['pages']}"
    
    doi_text = f"https://doi.org/{citation['doi']}" if citation['doi'] else ""
    
    return f"{authors_text}. \"{citation['title']}.\" {journal_info}. {doi_text}".strip()

def format_bibtex_citation(citation: Dict[str, Any]) -> str:
    """Format citation in BibTeX format"""
    # Create a BibTeX key from first author's last name and year
    key = ""
    if citation["authors"] and citation["year"]:
        first_author = citation["authors"][0].split(',')[0]  # Get last name of first author
        key = f"{first_author.lower()}{citation['year']}"
    else:
        import hashlib
        key = f"ref{hashlib.md5(citation['title'].encode()).hexdigest()[:6]}"
    
    # Format authors for BibTeX
    authors_bibtex = " and ".join(citation["authors"]) if citation["authors"] else ""
    
    # Determine entry type
    entry_type = "article"
    if citation["type"] == "book":
        entry_type = "book"
    elif citation["type"] == "proceedings-article":
        entry_type = "inproceedings"
    
    bibtex = f"""@{entry_type}{{{key},
  author = {{{authors_bibtex}}},
  title = {{{citation['title']}}},"""
    
    if citation["journal"]:
        bibtex += f"\n  journal = {{{citation['journal']}}},\n"
    if citation["year"]:
        bibtex += f"  year = {{{citation['year']}}},\n"
    if citation["volume"]:
        bibtex += f"  volume = {{{citation['volume']}}},\n"
    if citation["issue"]:
        bibtex += f"  number = {{{citation['issue']}}},\n"
    if citation["pages"]:
        bibtex += f"  pages = {{{citation['pages']}}},\n"
    if citation["doi"]:
        bibtex += f"  doi = {{{citation['doi']}}},\n"
    if citation["publisher"]:
        bibtex += f"  publisher = {{{citation['publisher']}}},\n"
    
    # Remove the last comma and newline
    bibtex = bibtex.rstrip(",\n")
    bibtex += "\n}"
    
    return bibtex

# API function for direct integration
def get_citations(text):
    try:
        return get_citations_from_text(text)
    except Exception as e:
        print(f"API error: {e}")
        return {"error": str(e)}