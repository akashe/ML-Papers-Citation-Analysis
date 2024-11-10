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

void bfsTreeToCSV(int start, const std::unordered_map<int, Node>& nodes, std::ostream& out) {
    std::unordered_set<int> visited;
    std::queue<std::pair<int, int>> q; // pair of node and level
    q.push({start, 0});
    visited.insert(start);

    // Output CSV headers
    out << "Source,Target,Label,Year,Citations,PageRank" << std::endl;

    std::cout << "BFS Tree Structure:" << std::endl;

    while (!q.empty()) {
        int current = q.front().first;
        int level = q.front().second;
        q.pop();

        for (int i = 0; i < level; ++i) std::cout << "  ";
        const Node& node = nodes.at(current);
        std::cout << current << " (" << node.label << ", Year: " << node.year
                  << ", Citations: " << node.citationCount << ", PageRank: " << node.pageRank << ")" << std::endl;

        for (int neighbor : node.outEdges) {
            if (visited.find(neighbor) == visited.end()) {
                q.push({neighbor, level + 1});
                visited.insert(neighbor);
                out << "\"" << current << " (" << node.label << ", Year: " << node.year
                    << ", Citations: " << node.citationCount << ", PageRank: " << node.pageRank << ")\""
                    << ",\"" << neighbor << " (" << nodes.at(neighbor).label << ", Year: " << nodes.at(neighbor).year
                    << ", Citations: " << nodes.at(neighbor).citationCount << ", PageRank: " << nodes.at(neighbor).pageRank << ")\""
                    << "," << node.label << "," << node.year << "," << node.citationCount << "," << node.pageRank << std::endl;
            }
        }
    }
}

int main() {
    std::unordered_map<int, Node> nodes;
    parseDotFile("data/output.dot", nodes);

    int start;
    std::cout << "Enter the starting node id: ";
    std::cin >> start;

    std::ofstream outfile("data/bfs_tree.csv");
    bfsTreeToCSV(start, nodes, outfile);
    outfile.close();

    std::cout << "BFS tree CSV file has been generated: bfs_tree.csv" << std::endl;

    return 0;
}
