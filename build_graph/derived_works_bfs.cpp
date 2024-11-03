#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <vector>
#include <queue>

struct Node {
    std::string label;
    int year;
    int citationCount;
    double pageRank;
    std::vector<int> outEdges;
};

void parseDotFile(const std::string& filename, std::unordered_map<int, Node>& nodes) {
    std::ifstream infile(filename);
    std::string line;
    int lineNumber = 0;

    try {
        while (std::getline(infile, line)) {
            ++lineNumber;
            if (line.find("->") != std::string::npos) {
                std::stringstream ss(line);
                int from, to;
                char ignore;
                ss >> from >> ignore >> ignore >> to;

                nodes[from].outEdges.push_back(to);
            } else if (line.find("[label=") != std::string::npos) {
                std::stringstream ss;
                ss << line;
                while (line.find("];") == std::string::npos) {
                    if (!std::getline(infile, line)) {
                        throw std::runtime_error("Incomplete node definition at end of file.");
                    }
                    ss << line;
                    ++lineNumber;
                }

                std::string fullLine = ss.str();
                std::stringstream fullSS(fullLine);
                int id;
                fullSS >> id;
                Node node;
                size_t labelStart = fullLine.find("label=\"") + 7;
                size_t labelEnd = fullLine.find("\",", labelStart);
                node.label = fullLine.substr(labelStart, labelEnd - labelStart);

                size_t yearStart = fullLine.find("year=\"") + 6;
                size_t yearEnd = fullLine.find("\",", yearStart);
                node.year = std::stoi(fullLine.substr(yearStart, yearEnd - yearStart));

                size_t citationCountStart = fullLine.find("citationCount=\"") + 15;
                size_t citationCountEnd = fullLine.find("\"]", citationCountStart);
                node.citationCount = std::stoi(fullLine.substr(citationCountStart, citationCountEnd - citationCountStart));

                node.pageRank = 1.0;
                nodes[id] = node;
            }
        }
    } catch (const std::exception& e) {
        std::cerr << "Error parsing line " << lineNumber << ": " << line << std::endl;
        std::cerr << "Exception: " << e.what() << std::endl;
        exit(EXIT_FAILURE);
    }
}

void bfsTree(int start, const std::unordered_map<int, Node>& nodes) {
    std::unordered_set<int> visited;
    std::queue<std::pair<int, int>> q; // pair of node and level
    q.push({start, 0});
    visited.insert(start);

    while (!q.empty()) {
        int current = q.front().first;
        int level = q.front().second;
        q.pop();

        for (int i = 0; i < level; ++i) std::cout << "  ";
        std::cout << current << " (" << nodes.at(current).label << ")" << std::endl;

        for (int neighbor : nodes.at(current).outEdges) {
            if (visited.find(neighbor) == visited.end()) {
                q.push({neighbor, level + 1});
                visited.insert(neighbor);
            }
        }
    }
}

int main() {
    std::unordered_map<int, Node> nodes;
    parseDotFile("data/graph_with_non_zero_pagerank.dot", nodes);

    int start;
    std::cout << "Enter the starting node id: ";
    std::cin >> start;

    std::cout << "BFS Tree from node " << start << ":\n";
    bfsTree(start, nodes);

    return 0;
}
