import pdb

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import time
import random

from run_cpp_code_from_python import run_bfs_cpp_generation, create_png_from_dot, get_path_between_two_nodes
from save_tree_in_db import save_tree_info_in_db

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/templates", StaticFiles(directory="templates"), name="templates")

DATABASE = 'citations_data.db'


class PaperSearchRequest(BaseModel):
    query: str


class TreeRequest(BaseModel):
    paper_id: int
    depth: int

class PaperRequest(BaseModel):
    paper_id: int

class ChildrenRequest(BaseModel):
    paper_id: int
    root_id: int
    depth: int
    num_papers: int
    selection_criteria: str

class PathRequest(BaseModel):
    start_id: int
    end_id: int

@app.get("/")
async def read_root():
    return FileResponse('templates/index.html')

@app.get("/path")
async def get_path_finder():
    return FileResponse('templates/path_finder.html')


@app.post("/search_papers/")
async def search_papers(request: PaperSearchRequest):
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    c.execute("""
            SELECT id, label, year, citationCount, pageRank 
            FROM Nodes 
            WHERE label LIKE ? 
            ORDER BY pageRank DESC
            """, (f"%{request.query}%",))
    papers = c.fetchall()
    conn.close()
    return [{"id": paper[0], "label": paper[1].replace(r"\n", "")} for paper in papers]


@app.post("/generate_tree/")
async def generate_tree(request: TreeRequest, background_tasks: BackgroundTasks):
    table_name = f"Tree_{request.paper_id}_{request.depth}"
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()

    # Check if the table already exists
    c.execute(f"SELECT name FROM sqlite_master WHERE type='table' AND name='{table_name}';")
    if c.fetchone():
        conn.close()
        return {"message": "Tree already exists"}

    conn.close()
    # Run the BFS tree generation in the background
    background_tasks.add_task(run_bfs_generation, request.paper_id, request.depth)
    return {"message": "Tree generation started"}


def run_bfs_generation(paper_id: int, depth: int, create_png: bool = False):
    print("Starting background task")

    print(paper_id,depth)
    # Run c++ code to get the BFS Tree dot file
    run_bfs_cpp_generation(str(paper_id), str(depth))

    # Save the dot file in db for retrieval
    save_tree_info_in_db(f"data/bfs_trees/bfs_tree_{paper_id}_{depth}.dot")

    if create_png:
        create_png_from_dot(str(paper_id), str(depth))

@app.post("/get_root_info/")
async def get_root_info(request: TreeRequest):
    # TODO: get root info should not be called until rest of the graph is generated in UI
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    table_name = f"Tree_{request.paper_id}_{request.depth}"
    c.execute(f"SELECT * FROM Nodes WHERE id = ?", (request.paper_id,))
    paper_info = c.fetchone()
    conn.close()
    if not paper_info:
        raise HTTPException(status_code=404, detail="Paper not found")
    return {
        'id': paper_info[0],
        'label': paper_info[1].replace(r"\n", ""),
        'year': paper_info[2],
        'citationCount': paper_info[3],
        'url': paper_info[4],
        'pageRank': paper_info[4]
    }


@app.post("/get_paper_info/")
async def get_paper_info(request: PaperRequest):
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()

    # Fetch the URL of the paper from the Nodes table
    c.execute("SELECT label, year, citationCount, url FROM Nodes WHERE id = ?", (request.paper_id,))
    print(request.paper_id)
    paper_results = c.fetchone()
    if not paper_results:
        conn.close()
        raise HTTPException(status_code=404, detail="Paper not found in Nodes table")
    label = paper_results[0]
    year = paper_results[1]
    citationCount = paper_results[2]
    paper_url = paper_results[3]

    # Fetch paper details from the Paper_info table using the URL
    c.execute("SELECT arxiv_id, citationCount, year, semantic_id, url, title, published_date, tldr FROM Paper_info WHERE url = ?", (paper_url,))
    paper_info = c.fetchone()
    print(paper_info)
    conn.close()
    if not paper_info:
        return {
            "arxiv_id": "No information available",
            "citationCount": citationCount,
            "year": year,
            "semantic_id": "No information available",
            "url": paper_url,
            "title": label,
            "published_date": "N/A",
            "tldr": "No information available"
        }
    return {
        "arxiv_id": paper_info[0],
        "citationCount": paper_info[1],
        "year": paper_info[2],
        "semantic_id": paper_info[3],
        "url": paper_info[4],
        "title": paper_info[5],
        "published_date": paper_info[6],
        "tldr": paper_info[7]
    }


@app.post("/get_children/")
async def get_children(request: ChildrenRequest):
    table_name = f"Tree_{request.root_id}_{request.depth}"
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()

    # Polling mechanism to wait until the table is created
    max_attempts = 25
    attempts = 0
    while attempts < max_attempts:
        c.execute(f"SELECT name FROM sqlite_master WHERE type='table' AND name='{table_name}';")
        if c.fetchone():
            break
        attempts += 1
        print("sleeping to wait for table creation")
        time.sleep(1)  # Wait for 1 second before checking again

    if attempts == max_attempts:
        conn.close()
        raise HTTPException(status_code=404, detail="Tree table not found after waiting")

    c.execute(f'SELECT cites FROM {table_name} WHERE paper_id = ?', (request.paper_id,))
    children = c.fetchall()

    children_info = []
    for child in children:
        child_id = child[0]
        c.execute('SELECT * FROM Nodes WHERE id = ?', (child_id,))
        paper_info = c.fetchone()
        children_info.append({
            'id': paper_info[0],
            'label': paper_info[1].replace(r"\n", ""),
            'citationCount': paper_info[3],
            'url': paper_info[4],
            'pageRank': paper_info[5]
        })

    if request.selection_criteria == 'citationCount':
        children_info.sort(key=lambda x: x['citationCount'], reverse=True)
    elif request.selection_criteria == 'pageRank':
        children_info.sort(key=lambda x: x['pageRank'], reverse=True)
    elif request.selection_criteria == 'random':
        random.shuffle(children_info)

    if request.num_papers > 0:
        children_info = children_info[:request.num_papers]
    else:
        raise NotImplementedError

    conn.close()
    return children_info


@app.post("/find_paths/")
async def find_path(request: PathRequest):
    start_node = str(request.start_id)
    end_node = str(request.end_id)

    result = get_path_between_two_nodes(start_node, end_node)

    return result
