from flask import Flask, render_template, request, jsonify
import sqlite3

app = Flask(__name__)

@app.route('/')
def index():
    # Get list of root nodes to display
    conn = sqlite3.connect('citation_trees.db')
    c = conn.cursor()
    c.execute("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'Tree_%';")
    tables = c.fetchall()
    conn.close()
    root_nodes = [table[0].replace('Tree_', '') for table in tables]
    return render_template('index.html', root_nodes=root_nodes)

@app.route('/get_children', methods=['POST'])
def get_children():
    data = request.json
    print(data)
    paper_id = data['paper_id']
    root_node = data['root_node']
    table_name = f'Tree_{root_node}'
    conn = sqlite3.connect('citation_trees.db')
    c = conn.cursor()
    c.execute(f'SELECT cites FROM {table_name} WHERE paper_id = ?', (paper_id,))
    children = c.fetchall()
    children_info = []
    for child in children:
        child_id = child[0]
        c.execute('SELECT * FROM Nodes WHERE id = ?', (child_id,))
        paper_info = c.fetchone()
        children_info.append({
            'id': paper_info[0],
            'label': paper_info[1].replace(r"\n","")
        })
    conn.close()
    return jsonify(children_info)

@app.route('/get_root_info', methods=['POST'])
def get_root_info():
    root_node = request.json['root_node']
    conn = sqlite3.connect('citation_trees.db')
    c = conn.cursor()
    c.execute('SELECT * FROM Nodes WHERE id = ?', (root_node,))
    paper_info = c.fetchone()
    conn.close()
    return jsonify({
        'id': paper_info[0],
        'label': paper_info[1].replace(r"\n",""),
        'shape': paper_info[2],
        'style': paper_info[3],
        'fillcolor': paper_info[4]
    })

if __name__ == '__main__':
    app.run(debug=True)
