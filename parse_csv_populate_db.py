import re
import sqlite3
import pandas as pd


def create_database(lines, db_file):
    # Connect to SQLite database
    conn = sqlite3.connect(db_file)
    c = conn.cursor()

    # Create the Nodes table
    c.execute('''
    CREATE TABLE IF NOT EXISTS Paper_info (
        arxiv_id TEXT,
        citationCount INTEGER,
        year INTEGER,
        semantic_id TEXT,
        url TEXT PRIMARY KEY,
        title TEXT,
        published_date TEXT,
        abstract TEXT,
        tldr TEXT
    )
    ''')

    # Insert nodes into the Nodes table
    for line in lines:
        c.execute('INSERT OR IGNORE INTO Paper_info (arxiv_id, citationCount, year, semantic_id, url, title, published_date, abstract, tldr) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', line)

    conn.commit()
    conn.close()


# Example usage
lines = pd.read_csv("data/arxiv_papers_with_semantic_scholar_ids.csv")
lines = lines[['id', 'citationCount', 'year', 'paperId', 'url', 'title', 'published_date', 'abstract', 'tldr']].values.tolist()
create_database(lines, 'citations_data.db')
