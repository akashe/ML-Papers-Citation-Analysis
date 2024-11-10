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

bool findPath(int start, int end, const std::unordered_map<int, Node>& nodes, std::vector<int>& path) {
    std::unordered_map<int, int> parents;
    std::queue<int> q;
    q.push(start);
    parents[start] = -1;

    while (!q.empty()) {
        int current = q.front();
        q.pop();

        if (current == end) {
            int step = end;
            while (step != -1) {
                path.insert(path.begin(), step);
                step = parents[step];
            }
            return true;
        }

        for (int neighbor : nodes.at(current).outEdges) {
            if (parents.find(neighbor) == parents.end()) {
                parents[neighbor] = current;
                q.push(neighbor);
            }
        }
    }

    return false;
}

int main(int argc, char* argv[]) {
    if (argc != 4) {
        std::cerr << "Usage: " << argv[0] << " <start_node_id> <end_node_id> <dot file name>" << std::endl;
        return 1;
    }

    int start = std::stoi(argv[1]);
    int end = std::stoi(argv[2]);
    std::string dot_filename = argv[3];

    std::unordered_map<int, Node> nodes;
    parseDotFile(dot_filename, nodes);

    std::vector<int> path;
    if (findPath(start, end, nodes, path)) {
        for (int node : path) {
            std::cout << node << " ";
        }
        std::cout << std::endl;
    } else {
        std::cout << "No path found between the nodes." << std::endl;
        return 1;
    }

    return 0;
}
