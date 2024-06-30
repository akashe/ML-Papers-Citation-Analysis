import pydot
import sqlite3

# Parse the DOT file
graphs = pydot.graph_from_dot_file('bfs_tree.dot')
graph = graphs[0]

# Connect to SQLite database
conn = sqlite3.connect('citation_trees.db')
c = conn.cursor()

# Create the main Nodes table
c.execute('''
CREATE TABLE IF NOT EXISTS Nodes (
    id TEXT PRIMARY KEY,
    label TEXT,
    shape TEXT,
    style TEXT,
    fillcolor TEXT
)
''')

# Extract and store node information
for node in graph.get_nodes():
    node_id = node.get_name().strip('"')
    attributes = node.get_attributes()
    label = attributes.get('label', '').replace('\n', ' ')
    shape = attributes.get('shape', '')
    style = attributes.get('style', '')
    fillcolor = attributes.get('fillcolor', '')
    c.execute('INSERT OR IGNORE INTO Nodes (id, label, shape, style, fillcolor) VALUES (?, ?, ?, ?, ?)',
              (node_id, label, shape, style, fillcolor))

# Extract root nodes
root_nodes = [node.get_name().strip('"') for node in graph.get_nodes() if node.get_attributes().get('shape') == 'doubleoctagon']

# Create a table for each root node
for root in root_nodes:
    table_name = f'Tree_{root}'
    c.execute(f'''
    CREATE TABLE IF NOT EXISTS {table_name} (
        id INTEGER PRIMARY KEY,
        paper_id TEXT NOT NULL,
        cites TEXT,
        FOREIGN KEY(paper_id) REFERENCES Nodes(id),
        FOREIGN KEY(cites) REFERENCES Nodes(id)
    )
    ''')

    # Insert edges into the respective root node tables
    for edge in graph.get_edges():
        source = edge.get_source().strip('"')
        destination = edge.get_destination().strip('"')
        c.execute(f'INSERT INTO {table_name} (paper_id, cites) VALUES (?, ?)', (source, destination))

conn.commit()
conn.close()
