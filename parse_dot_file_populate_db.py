import re
import sqlite3


def parse_dot_file(dot_file):
    node_pattern = re.compile(r'(\d+)\[label="(.+?)", year="(\d+)", citationCount="(\d+)", url="(.*?)", pageRank="([\deE\.\-]+)"\];')
    edge_pattern = re.compile(r'(\d+) -> (\d+);')

    nodes = []
    edges = []

    with open(dot_file, 'r') as file:
        for line in file:
            node_match = node_pattern.search(line)
            edge_match = edge_pattern.search(line)

            if node_match:
                node_id = node_match.group(1)
                label = node_match.group(2).replace('\n', ' ')
                year = node_match.group(3)
                citation_count = node_match.group(4)
                url = node_match.group(5)
                page_rank = node_match.group(6)
                nodes.append((node_id, label, year, citation_count, url, page_rank))

            if edge_match:
                source = edge_match.group(1)
                destination = edge_match.group(2)
                edges.append((source, destination))

    return nodes, edges


def create_database(nodes, edges, db_file):
    # Connect to SQLite database
    conn = sqlite3.connect(db_file)
    c = conn.cursor()

    # Create the Nodes table
    c.execute('''
    CREATE TABLE IF NOT EXISTS Nodes (
        id TEXT PRIMARY KEY,
        label TEXT,
        year INTEGER,
        citationCount INTEGER,
        url TEXT,
        pageRank REAL
    )
    ''')

    # Insert nodes into the Nodes table
    for node in nodes:
        c.execute('INSERT OR IGNORE INTO Nodes (id, label, year, citationCount, url, pageRank) VALUES (?, ?, ?, ?, ?, ?)', node)

    conn.commit()
    conn.close()


# Example usage
nodes, edges = parse_dot_file('data/output.dot')
create_database(nodes, edges, 'citations_data.db')
