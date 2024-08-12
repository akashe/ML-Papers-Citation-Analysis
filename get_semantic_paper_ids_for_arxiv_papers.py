import os
import random

import requests
import pandas as pd
from tqdm import tqdm
import time
import json
from concurrent.futures import ThreadPoolExecutor, as_completed
from threading import Semaphore

# Define your Semantic Scholar API key
SEMANTIC_SCHOLAR_API_KEY = "XQRDiSXgS59uq91YOLadF2You3c4XFvv3MmXKU4o"
SEMANTIC_SCHOLAR_API_URL = "https://api.semanticscholar.org/graph/v1"

# Define the fields to be retrieved
fields = "url,year,citationCount,tldr"


def save_citations_to_jsonl(citations, filename="citations.jsonl"):
    with open(filename, 'a') as f:
        for citation in citations:
            if len(citation) != 0:
                f.write(json.dumps(citation) + '\n')


def load_processed_paper_ids(filename="citations.jsonl"):
    if not os.path.exists(filename):
        return set()

    processed_paper_ids = set()
    with open(filename, 'r') as f:
        for line in f:
            citation = json.loads(line)
            processed_paper_ids.add(citation['citedPaperId'])

    return processed_paper_ids


# Function to fetch papers for a given year with pagination
def fetch_paper_ids(request_ids, max_retries=3):
    failed_response = "failed"
    url = f"{SEMANTIC_SCHOLAR_API_URL}/paper/batch/"
    params = {'fields': fields}
    json_ = {"ids": request_ids}

    for attempt in range(max_retries):
        try:
            response = requests.post(url,
                                     params=params,
                                     json=json_,
                                     headers={'x-api-key': SEMANTIC_SCHOLAR_API_KEY}).json()

            if not ('message' in response or 'error' in response):
                return response
        except Exception as e:
            print(f"Error fetching papers (attempt {attempt + 1}): {response}")
            time.sleep(40)  # Wait before retrying

    time.sleep(60)  # Wait 60 seconds between requests

    return failed_response


def main():
    # Read arxiv paper ids
    df = pd.read_pickle("data/arxiv_data.pkl")

    df_keys = df['id'].tolist()
    arxiv_ids = df_keys
    print(f'Total arxiv paper to process {len(arxiv_ids)}')

    failed_paper_ids = []
    paper_results = []
    iterator = 500
    for i in range(0, len(arxiv_ids), iterator):
        ids = arxiv_ids[i:i + iterator]
        ids = [f'ARXIV:{id_}' for id_ in ids]
        semantic_scholar_results = fetch_paper_ids(ids, max_retries=3)
        assert 'failed' != semantic_scholar_results

        for df_details, result in zip(df_keys[i:i + iterator], semantic_scholar_results):
            try:
                result = {i: result['tldr']['text'] if i=='tldr' else result[i] for i in result.keys()}
                paper_results.append({'id': df_details, **result})
            except Exception as e:
                failed_paper_ids.append(df_details)

    headers = ['id', 'citationCount', 'year', 'paperId', 'url', 'tldr']
    results_df = pd.DataFrame(paper_results, columns=headers)

    merged_df = pd.merge(results_df, df, on='id', how='inner')
    merged_df.to_csv("data/arxiv_papers_with_semantic_scholar_ids.csv")
    print(f'Total entries {len(merged_df)}')

    df_for_c_code = merged_df[['paperId', 'url', 'title', 'year', 'citationCount']]
    # df_for_c_code['title'] = df_for_c_code['title'].str.replace('\n', '')
    df_for_c_code.to_csv("data/semantic_scholar_paper_details_for_c_code.csv", index=False)

    with open("data/arxiv_papers_with_no_sematic_scholar_ids.json", "w") as f:
        json.dump(failed_paper_ids, f)


if __name__ == "__main__":
    main()
