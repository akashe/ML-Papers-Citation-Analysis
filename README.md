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

