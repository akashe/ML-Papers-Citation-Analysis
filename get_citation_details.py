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
fields = "url,title,year,authors,citationCount,abstract"
citations_fields = "paperId,title,contexts,year"
#citations_fields = "paperId,title,contexts,year,isInfluential,influentialCitationCount"

NUM_THREADS = 5
WAIT_PER_THREAD = 1
WAIT_FOR_FAILED_REQUEST = 2

semaphore = Semaphore(NUM_THREADS)


def save_citations_to_jsonl(citations, filename="data/citations.jsonl"):
    with open(filename, 'a') as f:
        for citation in citations:
            if len(citation) != 0:
                f.write(json.dumps(citation) + '\n')


def load_processed_paper_ids(filename="data/citations.jsonl"):
    if not os.path.exists(filename):
        return set()

    processed_paper_ids = set()
    with open(filename, 'r') as f:
        for line in f:
            citation = json.loads(line)
            processed_paper_ids.add(citation['citedPaperId'])

    return processed_paper_ids


def load_existing_citations(filename):
    # existing_citations = []
    existing_citations = set()
    if os.path.exists(filename):
        with open(filename, 'r') as f:
            for line in f:
                citation = json.loads(line)
                cited_paper_id = citation['citedPaperId']
                existing_citations.add(cited_paper_id)
                # if cited_paper_id not in existing_citations:
                #     existing_citations[cited_paper_id] = []
                # existing_citations[cited_paper_id].append(citation)
    return existing_citations

# Function to fetch citations for a given paper
def fetch_citations(paper_id, fields, max_retries=5):
    citations = []
    offset = 0
    limit = 1000
    while True:
        url = f"{SEMANTIC_SCHOLAR_API_URL}/paper/{paper_id}/citations?offset={offset}&limit={limit}&fields={fields}"

        success = False
        for attempt in range(max_retries):
            semaphore.acquire()  # Acquire semaphore before making the request
            try:
                response = requests.get(url, headers={'x-api-key': SEMANTIC_SCHOLAR_API_KEY}).json()

                if 'message' in response or 'error' in response:
                    raise Exception

                citations.extend(response['data'])
                next_offset = response.get('next', None)
                success = True
                break
            except Exception as e:
                # print(f"Error fetching citations for paper {paper_id} (attempt {attempt + 1}): {e}")
                # print(response)
                time.sleep(WAIT_FOR_FAILED_REQUEST + random.random())
            finally:
                semaphore.release()

        time.sleep(WAIT_PER_THREAD + random.random())

        if success:
            if not next_offset:
                break
            offset = next_offset
            if offset == 9000:
                # Max allowed citations from semantic scholar is 9999, so have to adjust limit for the final request
                limit = 999
        else:
            if (offset == 9000 and limit == 999) or len(citations) == 9999:
                print(f'Paper id for more than 10k citations {paper_id}')
                return citations
            print(f"Failed to fetch citations for paper {paper_id} after {max_retries} attempts. total queries till now"
                  f" {len(citations)/1000}")
            return -1

    return citations


def main():

    arxiv_paper_details = pd.read_csv("data/arxiv_papers_with_semantic_scholar_ids.csv")
    arxiv_papers_with_citations = arxiv_paper_details[arxiv_paper_details['citationCount'] > 0]
    semantic_paper_ids = arxiv_papers_with_citations['paperId'].tolist()
    print(f'Total papers in data {len(semantic_paper_ids)}')

    random.shuffle(semantic_paper_ids)

    # Load already processed paper IDs with citations
    processed_paper_ids = load_processed_paper_ids()
    print(f'Papers processed till now {len(processed_paper_ids)}')

    # load paper ids of papers with no citations
    papers_with_no_citations = []
    if os.path.exists('data/semantic_ids_with_no_citations.json'):
        with open("data/semantic_ids_with_no_citations.json", "r") as f:
            papers_with_no_citations = json.load(f)

    print(f'Papers with no citations {len(papers_with_no_citations)}')

    processed_paper_ids = list(processed_paper_ids)
    processed_paper_ids.extend(papers_with_no_citations)

    # existing_citations = load_existing_citations("/Users/akashkumar/PycharmProjects/VisualizeIdeaFlow/citations.jsonl")
    # processed_paper_ids.extend(list(existing_citations))

    failed_paper_ids = []
    citations_data = []

    # all_papers = [paper_id for paper_id in semantic_paper_ids if paper_id not in processed_paper_ids]
    # for paper in tqdm(all_papers, desc="Fetching citations"):
    #     paper_id = paper
    #     citations = fetch_citations(paper_id, citations_fields)
    #     for citation in citations:
    #         citation['citedPaperId'] = paper_id  # Add the cited paper ID for context
    #         citations_data.append(citation)
    #
    # # Save all citations to a CSV file
    # citations_df = pd.DataFrame(citations_data)
    # citations_df.to_csv("all_citations.csv", index=False)

    # Fetch citations for each paper using multithreading
    with ThreadPoolExecutor(max_workers=NUM_THREADS) as executor:
        future_to_paper = {executor.submit(fetch_citations, paper, citations_fields): paper for paper in
                           semantic_paper_ids if paper not in processed_paper_ids}
        for future in tqdm(as_completed(future_to_paper), total=len(future_to_paper), desc="Fetching citations"):
            paper = future_to_paper[future]
            try:
                citations = future.result()
                for citation in citations:
                    citation['citedPaperId'] = paper  # Add the cited paper ID for context
                    citations_data.append(citation)
                save_citations_to_jsonl(citations)
                if len(citations) == 0:
                    papers_with_no_citations.append(paper)
                    # shortcut, remove this later
                    with open("data/semantic_ids_with_no_citations.json", "w") as f:
                        json.dump(papers_with_no_citations, f)
                    print(f'No citations for {paper}')
            except Exception as e:
                print(f"Error processing paper {paper}: {e}")
                failed_paper_ids.append(paper)

    # Save all citations to a CSV file
    citations_df = pd.DataFrame(citations_data)
    citations_df.to_csv("data/semantic_citations.csv", index=False)

    with open("data/semantic_ids_with_failed_citations.json", "w") as f:
        json.dump(failed_paper_ids, f)

    with open("data/semantic_ids_with_no_citations.json", "w") as f:
        json.dump(papers_with_no_citations, f)


if __name__ == "__main__":
    main()
