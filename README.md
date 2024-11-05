# Citation Analysis or Bibliometrics of Research papers 

In this repo we process AI/ML papers from past 10 years. The core idea is to visually see the:
1. most important ideas in the field of machine learning.
2. see the stepping stones of State of the art of current research.
3. See trends and directions in the scholarly circles.

When we are able to see the citation graph in a BFS manner, it allows to quickly see how an idea evolved over time. 

Demo images:  


1. This is the citation graph from the 'Attention is all you need' paper. The graph shows the top 5 papers which cite from this paper with the highest pagerank.  
![Graph](build_graph/pngs/graph.png)
2. You can get a quick glance about the paper by just hovering over it. ![Paper card](build_graph/pngs/paper_card.png) 
3. As you find more and more interesting paper, add them to your reading list to revisit them later.  ![Reading list](build_graph/pngs/reading_list.png)  
4. Go as deep as you want! Every time you click on a paper, the top works derived from that paper will pop up. Use this to find how an idea evolved over time or find gaps in the literature. ![Multi level](build_graph/pngs/multi_level.png)   



The code is structured into 3 main folders

- #### Citation Network Backend:
   
   Run FASTAPI backend app:
   ```
   cd citation-network-backend
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt 
   
   uvicorn app:app --host 0.0.0.0 --port 8000 --reload
   ```
   

- #### Citation Network UI: 
   React Fronend code for the application. Allows user context mangagment, with reading list option to users where they can add papers they found interesting.
   
   Before you begin, ensure you have Node.js and npm installed on your system. You can check if you have them installed by running:
   
   ```bash
   node --version
   npm --version
   ```

   If you don't have Node.js and npm installed:

   ##### macOS
   ```bash
   brew install node
   ```

   ##### Linux (Ubuntu/Debian)
   ```bash
   sudo apt update
   sudo apt install nodejs npm
   ```

   ##### Environment Setup
   1. Create a `.env` file in the `citation-network-ui` directory
   2. Copy the contents from `.env.example` and fill in your Firebase configuration values:
   ```
   REACT_APP_FIREBASE_API_KEY=your_api_key_here
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id_here
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
   REACT_APP_FIREBASE_APP_ID=your_app_id_here
   REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id_here
   ```

   ##### Setup Instructions

   ```bash
   cd citation-network-ui
   npm install
   npm start -- --host 0.0.0.0
   ```

- #### Build graph:
   This folder contains all the steps necessary to create a citation graph. Major steps include:
  1. Get ML papers and their details from the last 10 years from Arxiv.
  2. Get their citation data from semantic scholar.
  3. Combine both information to create graph dot file. The dot file will have papers as nodes and the citations encoded as edges from 'Cited Paper' to 'Citing Paper'.
  4. Perform PageRank on this graph. PageRank is an important metric to find papers with low citation count but being referred by highly influential papers.
  5. Process the final graph and store it in DB for FASTAPI backend.
