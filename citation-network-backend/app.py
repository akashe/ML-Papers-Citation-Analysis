import pdb

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import time
import random

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/templates", StaticFiles(directory="templates"), name="templates")

DATABASE = 'data/citations_data.db'


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
    return {"message": "Tree generation started"}


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
    c.execute("SELECT arxiv_id, citationCount, year, semantic_id, url, abstract, title, published_date, tldr FROM Paper_info WHERE url = ?", (paper_url,))
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
        "title": paper_info[6],
        "published_date": paper_info[7],
        "tldr": paper_info[8]
    }


@app.post("/get_children/")
async def get_children(request: ChildrenRequest):
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()

    # Get all children directly from the edges table
    c.execute('''
        SELECT n.* 
        FROM PaperEdges e 
        JOIN Nodes n ON e.target_id = n.id 
        WHERE e.source_id = ?
        LIMIT 9999
    ''', (request.paper_id,))
    
    children_info = []
    for paper_info in c.fetchall():
        children_info.append({
            'id': paper_info[0],
            'label': paper_info[1].replace(r"\n", ""),
            'citationCount': paper_info[3],
            'url': paper_info[4],
            'pageRank': paper_info[5]
        })

    # Apply sorting based on selection criteria
    if request.selection_criteria == 'citationCount':
        children_info.sort(key=lambda x: x['citationCount'], reverse=True)
    elif request.selection_criteria == 'pageRank':
        children_info.sort(key=lambda x: x['pageRank'], reverse=True)
    elif request.selection_criteria == 'random':
        random.shuffle(children_info)

    # Apply limit if specified
    if request.num_papers > 0:
        children_info = children_info[:request.num_papers]

    conn.close()
    return children_info


@app.post("/find_paths/")
async def find_path(request: PathRequest):
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    
    def bfs_path(start_id, end_id):
        queue = [(start_id, [start_id])]
        visited = {start_id}
        
        while queue:
            (vertex, path) = queue.pop(0)
            # Get all neighbors from PaperEdges table
            c.execute('SELECT target_id FROM PaperEdges WHERE source_id = ?', (vertex,))
            for neighbor, in c.fetchall():
                if neighbor == end_id:
                    return path + [neighbor]
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append((neighbor, path + [neighbor]))
        return None

    path = bfs_path(request.start_id, request.end_id)
    
    if path:
        # Get paper details for each node in path
        path_details = []
        for node_id in path:
            c.execute('SELECT id, label, year, citationCount, pageRank FROM Nodes WHERE id = ?', (node_id,))
            details = c.fetchone()
            path_details.append({
                'id': details[0],
                'label': details[1],
                'year': details[2],
                'citationCount': details[3],
                'pageRank': details[4]
            })
        conn.close()
        return {'path': path_details}
    
    conn.close()
    raise HTTPException(status_code=404, detail="No path found")
