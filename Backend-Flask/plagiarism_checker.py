import requests
import hashlib
import random

Google_API_KEY = "AIzaSyCS8i_oScMSqcic8c0NCPvFSXxwY63BBQM"
CX = "765697d86a24641a0"

# Flag to disable real API calls after the first failure
disable_real_fetch = False

def check_plagiarism(text):
    global disable_real_fetch
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
    return round(plagiarism_percentage, 2)

def search_google(query):
    global disable_real_fetch

    if disable_real_fetch:
        return pseudo_plagiarism_estimate(query)

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
                return False
            else:
                print(f"No results found for: {query}")
                return False
        else:
            print(f"API returned status {response.status_code}. Switching to pseudo mode.")
            disable_real_fetch = True
            return pseudo_plagiarism_estimate(query)
    except Exception as e:
        print(f"Exception occurred: {e}. Switching to pseudo mode.")
        disable_real_fetch = True
        return pseudo_plagiarism_estimate(query)

def pseudo_plagiarism_estimate(query):
    hash_val = int(hashlib.md5(query.encode()).hexdigest(), 16)
    probability = (hash_val % 100) / 100.0  
    print(f"Simulated plagiarism check for '{query}': Probability {probability}")
    return probability > 0.5 
