# Citation Analysis or Bibliometrics of Research papers in the filed of ML, AI and Deep Learning

## Citation Network Backend:



Run FASTAPI backend app:
```
cd citation-network-backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt 

uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```


## Citation Network UI: 
React Fronend code for the application. Allows user context mangagment, with reading list option to users where they can add papers they found interesting.

Before you begin, ensure you have Node.js and npm installed on your system. You can check if you have them installed by running:

```bash
node --version
npm --version
```


If you don't have Node.js and npm installed:

##### Windows
1. Download the installer from [Node.js official website](https://nodejs.org/)
2. Run the installer (npm will be installed automatically with Node.js)

##### macOS
Using Homebrew:
```bash
brew install node
```

##### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install nodejs npm
```

### Setup Instructions

1. Change the folder:
   ```bash
   cd citation-network-ui
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start -- --host 0.0.0.0
   ```
   This will open [http://localhost:3000](http://localhost:3000) in your browser.


## Build graph:
This folder contains all the steps necessary to create a citation graph. Steps:
1. Get ML papers and their details from the last 10 years from Arxiv.
2. Get their citation data from semantic scholar.
3. Combine both information to create graph dot file. The dot file will have papers as nodes and the citations encoded as edges from 'Cited Paper' to 'Citing Paper'.
4. Perform PageRank on this graph. PageRank is an important metric to find papers with low citation count but being referred by highly influential papers.
5. Process the final graph and store it in DB for FASTAPI backend.
