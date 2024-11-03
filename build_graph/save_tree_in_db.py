import sqlite3
import re

edge_pattern = re.compile(r'"(\d+)" -> "(\d+)";')


def save_tree_info_in_db(filename):

    root = filename.split("/")[-1].split(".")[0].split('_')[-2]
    tree_depth = filename.split("/")[-1].split(".")[0].split('_')[-1]
    print(tree_depth)

    # Connect to SQLite database
    conn = sqlite3.connect('citations_data.db')
    c = conn.cursor()

    table_name = f'Tree_{root}_{tree_depth}'
    c.execute(f'''
    CREATE TABLE IF NOT EXISTS {table_name} (
        id INTEGER PRIMARY KEY,
        paper_id TEXT NOT NULL,
        cites TEXT,
        FOREIGN KEY(paper_id) REFERENCES Nodes(id),
        FOREIGN KEY(cites) REFERENCES Nodes(id)
    )
    ''')

    with open(filename, 'r') as file:
        for line in file:
            edge_match = edge_pattern.search(line)

            if edge_match:
                source = edge_match.group(1)
                destination = edge_match.group(2)
                c.execute(f'INSERT INTO {table_name} (paper_id, cites) VALUES (?, ?)', (source, destination))

    conn.commit()
    conn.close()


if __name__=="__main__":
    save_tree_info_in_db("data/bfs_trees/bfs_tree_28623_3.dot")
