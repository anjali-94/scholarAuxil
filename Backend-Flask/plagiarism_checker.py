import requests
import json

Google_API_KEY = "AIzaSyCS8i_oScMSqcic8c0NCPvFSXxwY63BBQM"

CX = "765697d86a24641a0"

def check_plagiarism(text):
    sentences = text.split('.')
    plagiarism_percentage = 0
    total_sentences = len(sentences)
    plagiarized_sentences = 0

    for sentence in sentences:
        if sentence.strip():  
            result = search_google(sentence.strip())
            if result:  
                plagiarized_sentences += 1

    if total_sentences > 0:
        plagiarism_percentage = (plagiarized_sentences / total_sentences) * 100
    return plagiarism_percentage

def search_google(query):
    search_url = f"https://www.googleapis.com/customsearch/v1?q={query}&key={Google_API_KEY}&cx={CX}"

    try:
        response = requests.get(search_url)
        if response.status_code == 200:
            data = response.json()
        
            if 'items' in data and len(data['items']) > 0:
                for item in data['items']:
                   
                    if 'snippet' in item and query.lower() in item['snippet'].lower():
                        print(f"Plagiarism detected for: {query}")
                        return True
                print(f"No exact match found for: {query}")
        else:
            print(f"Failed to fetch data from Google Custom Search. Status code: {response.status_code}")
        return False
    except Exception as e:
        print(f"Error in Google search: {e}")
        return False




# import requests
# import json
# import time

# # Google_API_KEY = "AIzaSyCS8i_oScMSqcic8c0NCPvFSXxwY63BBQM"
# Google_API_KEY = "AIzaSyAiEj1szFPkPiCv1thjrG9K11EhRGgjwno"
# CX = "765697d86a24641a0"

# def check_plagiarism(text):
#     sentences = [s.strip() for s in text.split('.') if s.strip()]
#     total_sentences = len(sentences)
#     plagiarized_sentences = 0

#     for sentence in sentences:
#         if search_google(sentence):
#             plagiarized_sentences += 1
#         time.sleep(1)  # Sleep to reduce risk of hitting API quota

#     plagiarism_percentage = (plagiarized_sentences / total_sentences) * 100 if total_sentences else 0
#     return plagiarism_percentage

# def search_google(query, max_retries=5):
#     search_url = f"https://www.googleapis.com/customsearch/v1?q={query}&key={Google_API_KEY}&cx={CX}"

#     for attempt in range(max_retries):
#         try:
#             response = requests.get(search_url)
#             status = response.status_code

#             if status == 200:
#                 data = response.json()
#                 if 'items' in data and any(query.lower() in item.get('snippet', '').lower() for item in data['items']):
#                     print(f"✅ Plagiarism detected: {query}")
#                     return True
#                 print(f"❌ No match for: {query}")
#                 return False

#             elif status == 429:
#                 wait = 2 ** attempt
#                 print(f"⚠️ Rate limit hit. Waiting {wait}s before retrying... (attempt {attempt + 1})")
#                 time.sleep(wait)
#             else:
#                 print(f"❌ Failed request (status {status}) for query: {query}")
#                 return False

#         except Exception as e:
#             print(f"❌ Exception occurred: {e}")
#             time.sleep(2)

#     print(f"❌ All retries failed for query: {query}")
#     return False





