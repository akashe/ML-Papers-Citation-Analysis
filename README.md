# Citation Analysis or Bibliometrics of Research papers in the filed of ML, AI and Deep Learning

The core idea is to visually see the:
1. most important ideas in the field of machine learning.
2. see the stepping stones of State of the art of current research.
3. See trends and directions in the scholarly circles.

semantic scholar ids
take file names and other things from terminal

arxiv papers not downloaded from arxiv
arviv paper ids not present on semantic scholar
max 10K citations for each paper

mkdir data
mkdir data/bfs_trees
mkdir data/pngs

python get_arxiv_metadata_from_kaggle.py
python get_semantic_paper_ids_for_arxiv_papers.py
python get_citation_details.py

# Rerun once more, 200k new entries in data/semantic_scholar_paper_details_for_c_code.csv file

c++ setup:
Install boost and rapidjson:
brew install boost
brew install rapidjson


Set paths:
BOOST_VERSION=$(ls /opt/homebrew/Cellar/boost)
RAPIDJSON_VERSION=$(ls /opt/homebrew/Cellar/rapidjson)
BOOST_INCLUDE_PATH=/opt/homebrew/Cellar/boost/$BOOST_VERSION/include
BOOST_LIB_PATH=/opt/homebrew/Cellar/boost/$BOOST_VERSION/lib
RAPIDJSON_INCLUDE_PATH=/opt/homebrew/Cellar/rapidjson/$RAPIDJSON_VERSION/include

Run command:
g++ -std=c++11 -I$BOOST_INCLUDE_PATH -I$RAPIDJSON_INCLUDE_PATH -L$BOOST_LIB_PATH -lboost_graph -lboost_system -o citation_network main.cpp

Execute:
./citation_network

Fix formatting of the citation_network.dot file generated:
python update_dot_file.py

Calculate pagerank of the graph generated:
g++ -std=c++11 -I /Users/akashkumar/Downloads/eigen-3.4.0 -o pagerank pagerankmatrix.cpp

We are biasing the initial ranks of the nodes to be proportional to citationCount of papers.
We are keeping damping factor to be 0.99 because we want to find papers which may have low citation count but were 
referred by highly cited papers also making those papers important idea
1 severe limitation, a total of 9999 nodes at max
Total of 74 papers have more than 10k citations.

Execute:
./pagerank

Clean the dot file generated to account for special characters etc:
python clean_graph_with_pagerank.py

Convert graph to nodes and edges csv to import in different visualization tools:
python convert_dot_to_csv.py

Populate db with the node information:
python parse_dot_file_populate_db.py

g++ -std=c++11 -I /Users/akashkumar/Downloads/eigen-3.4.0 -o find_path path_finder.cpp 
g++ -std=c++11 -I /Users/akashkumar/Downloads/eigen-3.4.0 -o graph_bfs dervied_work_bfs_visualization.cpp

Populate db with the paper information like abstracts publish date information:
# Issue with 6k papers
python parse_csv_populate_db.py

Run FASTAPI backend app:
# nodes which don't have info about arxiv_id or semantic_id
# root node being shown when tree is being generated
uvicorn app:app --host 0.0.0.0 --port 8000 --reload

Optimizations:
1. memoization in tables of db for path between 2 nodes
2. using children from a node present in db to construct tree rather than processing dot file each time and creating a new dot file each time. maybe use existing dot files also for the same nodes.

Things I did:
1. explore citation analysis tools like litemap, connectedpapers, citegraph, inciteful.xyz. They are good for literature survey and find related ideas but couldn't give birds eyes view of the field
2. Websites like dimension.ai and papelist.app allowed me to view papers with highest citations but again I couldn't find insights.
3. Look for citations dataset. Web of Scince, Scopus.  I was focussed only on ML papers. Semantic scholar gives has given API access to get informatin about papers and citations data.
4. Get the data.
5. Visualization tools:  
   a. Citespace: didn't have support for CSVs, needed the files in particular format which wasn't easy to figure out.  
   b. VOSVIEWER: focussed much more on text clustering  
c. Tableau: Didn't support complex visualizations  
d. Neo4j: supported graph visualization but very slow with nodes more than 10000.  
e. Cyctospace: Good options for layouts.    
f. Graphia: Visually appealing, allows for many transforms and graph metrics and methods.  
g. Gephi: best of both Cyctospace and Graphia. Layouts, and graph metrics.  
6. The size of data from semantic scholar was mind boggling. 4 million papers in the field of Computer science with more than 150 citations! and 12 million papers that have cited from these papers
7. Visualization was doable for the data but very slow.
8. Focussing on Arxiv only. Getting papers from past 8 years.

