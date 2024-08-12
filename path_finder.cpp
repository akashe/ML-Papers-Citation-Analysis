#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <vector>

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

bool dfs(int start, int end, const std::unordered_map<int, Node>& nodes,
         std::vector<int>& currentPath, std::vector<std::vector<int>>& allPaths,
         std::unordered_set<int>& visited, int depth, int maxDepth) {
    if (depth > maxDepth) return false;

    visited.insert(start);
    currentPath.push_back(start);

    if (start == end) {
        allPaths.push_back(currentPath);
        currentPath.pop_back();
        visited.erase(start);
        return true;
    }

    bool found = false;
    for (int neighbor : nodes.at(start).outEdges) {
        if (visited.find(neighbor) == visited.end()) {
            found = dfs(neighbor, end, nodes, currentPath, allPaths, visited, depth + 1, maxDepth) || found;
        }
    }

    currentPath.pop_back();
    visited.erase(start);
    return found;
}

bool iddfs(int start, int end, const std::unordered_map<int, Node>& nodes,
           std::vector<std::vector<int>>& allPaths, int maxDepth) {
    std::unordered_set<int> visited;
    std::vector<int> currentPath;

    for (int depth = 1; depth <= maxDepth; ++depth) {
        if (dfs(start, end, nodes, currentPath, allPaths, visited, 0, depth)) {
            return true;
        }
    }
    return false;
}

int main(int argc, char* argv[]) {
    if (argc != 5) {
        std::cerr << "Usage: " << argv[0] << " <start_node_id> <end_node_id> <max_depth> <dot file name>" << std::endl;
        return 1;
    }

    int start = std::stoi(argv[1]);
    int end = std::stoi(argv[2]);
    int maxDepth = std::stoi(argv[3]);
    std::string dot_filename = argv[4];

    std::unordered_map<int, Node> nodes;
    parseDotFile(dot_filename, nodes);

    // Ensure the path starts from the older paper
    if (nodes[start].year > nodes[end].year) {
        std::swap(start, end);
    }

    std::vector<std::vector<int>> allPaths;

    if (iddfs(start, end, nodes, allPaths, maxDepth)) {
        for (const auto& path : allPaths) {
            for (size_t i = 0; i < path.size(); ++i) {
                std::cout << path[i];
                if (i < path.size() - 1) {
                    std::cout << " ";
                }
            }
            std::cout << std::endl;
        }
    } else {
        std::cout << "No path found between the nodes." << std::endl;
        return 1;
    }

    return 0;
}
