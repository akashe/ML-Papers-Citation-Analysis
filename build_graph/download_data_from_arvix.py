import requests
from bs4 import BeautifulSoup
import pandas as pd
import datetime as dt
import argparse
import os
import time

STANDARD_SEARCH_QUERY = "cat:cs.CV+OR+cat:cs.AI+OR+cat:cs.LG+OR+cat:cs.CL+OR+cat:cs.NE+OR+cat:stat.ML+OR+cat:cs.IR"

class ArxivScraper:
    base_url = "https://export.arxiv.org/find"

    def __init__(self, data_path="data/"):
        self.extracted_data = []

        if not os.path.exists(data_path):
            os.makedirs(data_path)
        self.data_path = data_path

    def get_results(self, start_date: str, end_date: str, search_query: str = STANDARD_SEARCH_QUERY, max_pages: int = 100) -> pd.DataFrame:
        start = 0
        while start < max_pages:
            print(f"Fetching page {start}...")

            params = {
                "query": f"all:{search_query}+AND+submittedDate:[{start_date}0000+TO+{end_date}2359]",
                "start": start * 50,
                "max_results": 50
            }

            try:
                url = self.base_url + "/?" + requests.compat.urlencode(params)
                response = requests.get(url)
                response.raise_for_status()

                soup = BeautifulSoup(response.text, 'html.parser')
                entries = soup.find_all('entry')
                print(f"Fetched {len(entries)} entries")

                if not entries:
                    break

                for entry in entries:
                    self.extracted_data.append({
                        "id": entry.id.text,
                        "title": entry.title.text,
                        "published_date": entry.published.text[:10],
                        "arxiv_link": entry.link['href'],
                        "abstract": entry.summary.text.replace("\n", "").replace("\r", "")
                    })

                if len(entries) < 50:
                    break  # Exit if we have less entries than max_results, indicating the last page

                start += 1
                time.sleep(3)  # Respect rate limits
            except requests.exceptions.RequestException as e:
                print(f"An error occurred: {e}")
                time.sleep(10)  # Wait before retrying

        headers = ['id', 'title', 'published_date', 'arxiv_link', 'abstract']
        return pd.DataFrame(self.extracted_data, columns=headers)

    def store_data(self, start_date: str, end_date: str, save_file_name: str = "arxiv_data.pkl", max_pages: int = 100) -> None:
        self.extracted_data = self.get_results(start_date, end_date, max_pages=max_pages)
        assert len(self.extracted_data) > 0, "Got no results with the search query"

        save_location = os.path.join(self.data_path, save_file_name)
        self.extracted_data.to_pickle(save_location)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("-sd", "--start_date", type=str, required=True, help="Start date in YYYYMMDD format")
    parser.add_argument("-ed", "--end_date", type=str, required=True, help="End date in YYYYMMDD format")
    parser.add_argument("-p", "--max_pages", type=int, help="Maximum pages to scrape", nargs="?", default=1000)
    parser.add_argument("-s", "--save_file_name", type=str, help="File name to save the results", nargs="?", default="arxiv_data.pkl")
    args = parser.parse_args()

    start_date = args.start_date
    end_date = args.end_date
    max_pages = args.max_pages

    arxiv_scraper = ArxivScraper()
    arxiv_scraper.store_data(start_date=start_date, end_date=end_date, save_file_name=args.save_file_name, max_pages=max_pages)
