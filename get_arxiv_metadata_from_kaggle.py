import json
import pandas as pd
from datetime import datetime, timedelta
import argparse
import os

# Relevant categories for machine learning-related papers
RELEVANT_CATEGORIES = {"cs.CV", "cs.AI", "cs.LG", "cs.CL", "cs.NE", "stat.ML", "cs.IR"}


def load_json(filepath):
    data = []
    with open(filepath, 'r') as file:
        for line in file:
            try:
                data.append(json.loads(line))
            except json.JSONDecodeError:
                print("Error decoding JSON line, skipping.")
    return data


def filter_data(data, relevant_categories, years):
    cutoff_date = datetime.now() - timedelta(days=years * 365)
    filtered_data = []

    for entry in data:
        # Convert the update_date to a datetime object
        entry_date = datetime.strptime(entry['update_date'], "%Y-%m-%d")
        if entry_date >= cutoff_date:
            # Check if any of the categories are relevant
            if any(category in relevant_categories for category in entry['categories'].split()):
                filtered_data.append({
                    "id": entry["id"],
                    "title": entry["title"],
                    "published_date": entry["update_date"],  # use update_date as published_date
                    "abstract": entry["abstract"].replace("\n", "").replace("\r", "")
                })

    return filtered_data


def save_data(filtered_data, save_path):
    df = pd.DataFrame(filtered_data)
    df.to_pickle(save_path)
    print(f"Filtered data saved to {save_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("-f", "--file", type=str, required=True, help="Path to the Arxiv JSON metadata file")
    parser.add_argument("-s", "--save_file_name", type=str, help="File name to save the filtered results",
                        default="arxiv_data.pkl")
    parser.add_argument("-y", "--years", type=int, help="Number of past years to include", default=10)
    args = parser.parse_args()

    file_path = args.file
    save_file_name = args.save_file_name
    years = args.years

    data = load_json(file_path)
    filtered_data = filter_data(data, RELEVANT_CATEGORIES, years)
    save_data(filtered_data, save_file_name)
