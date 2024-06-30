#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <vector>
#include <queue>
#include <set>

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

std::string wrapLabel(const std::string& label, size_t maxWidth) {
    std::stringstream wrappedLabel;
    std::string word;
    std::stringstream lineStream(label);
    size_t lineLength = 0;

    while (lineStream >> word) {
        if (lineLength + word.length() + 1 > maxWidth) {
            wrappedLabel << "\\n";
            lineLength = 0;
        }
        wrappedLabel << word << " ";
        lineLength += word.length() + 1;
    }

    return wrappedLabel.str();
}

void bfsTree(int start, const std::unordered_map<int, Node>& nodes, int maxLevels, std::ostream& out) {
    std::unordered_set<int> visited;
    std::queue<std::pair<int, int>> q; // pair of node and level
    q.push({start, 0});
    visited.insert(start);

    std::unordered_map<int, std::vector<int>> levels; // store nodes by levels
    std::set<int> years; // store unique years

    out << "digraph BFS_Tree {" << std::endl;
    out << "  ranksep=1.5;" << std::endl;

    out << "  // Root node" << std::endl;
    std::cout << "BFS Tree Structure:" << std::endl;

    bool isRoot = true;
    while (!q.empty()) {
        int current = q.front().first;
        int level = q.front().second;
        q.pop();

        if (maxLevels != -1 && level >= maxLevels) break;

        levels[nodes.at(current).year].push_back(current);
        years.insert(nodes.at(current).year);

        for (int i = 0; i < level; ++i) std::cout << "  ";
        const Node& node = nodes.at(current);
        std::cout << current << " (" << node.label << ")" << std::endl;

        std::string wrappedLabel = wrapLabel(node.label, 20);

        if (isRoot) {
            out << "  \"" << current << "\" [label=\"" << wrappedLabel << "\", shape=doubleoctagon, style=filled, fillcolor=lightblue];" << std::endl;
            isRoot = false;
        } else {
            out << "  \"" << current << "\" [label=\"" << wrappedLabel << "\", shape=box];" << std::endl;
        }

        for (int neighbor : node.outEdges) {
            if (visited.find(neighbor) == visited.end()) {
                q.push({neighbor, level + 1});
                visited.insert(neighbor);
                out << "  \"" << current << "\" -> \"" << neighbor << "\";" << std::endl;
            }
        }
    }

    // Add year scale on the left side in vertical order
    out << "  { node [shape=plaintext, fontsize=16];" << std::endl;
    out << "    edge [style=invis];" << std::endl;
    int prevYear = -1;
    for (int year : years) {
        if (prevYear != -1) {
            out << "    " << prevYear << " -> " << year << ";" << std::endl;
        }
        prevYear = year;
        out << "    " << year << " [label=\"" << year << "\"];" << std::endl;
    }
    out << "  }" << std::endl;

    // Organize nodes by ranks based on years, skipping the root's year
    for (const auto& level : levels) {
        if (level.first == nodes.at(start).year) continue; // skip the root's year
        out << "  { rank=same; ";
        out << level.first << "; ";
        for (int node : level.second) {
            out << "\"" << node << "\"; ";
        }
        out << "}" << std::endl;
    }

    out << "}" << std::endl;
}

int main() {
    std::unordered_map<int, Node> nodes;
    parseDotFile("data/graph_with_non_zero_pagerank.dot", nodes);

    int start;
    int maxLevels;
    std::cout << "Enter the starting node id: ";
    std::cin >> start;
    std::cout << "Enter the number of levels to visualize (-1 for all levels): ";
    std::cin >> maxLevels;

    std::ofstream outfile("bfs_tree.dot");
    bfsTree(start, nodes, maxLevels, outfile);
    outfile.close();

    std::cout << "BFS tree DOT file has been generated: bfs_tree.dot" << std::endl;

    return 0;
}
