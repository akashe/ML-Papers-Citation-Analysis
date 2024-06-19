#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <vector>
#include <Eigen/Sparse>
#include <chrono>

const double DAMPING_FACTOR = 0.85;
const int MAX_ITERATIONS = 100;
const double CONVERGENCE_THRESHOLD = 1e-6;

struct Node {
    std::string label;
    int year;
    int citationCount;
    double pageRank;
    std::vector<int> outEdges;
};

void parseDotFile(const std::string& filename, std::unordered_map<int, Node>& nodes, std::vector<Eigen::Triplet<double>>& tripletList, std::unordered_map<int, int>& idMapping, int& numNodes) {
    std::ifstream infile(filename);
    std::string line;
    int lineNumber = 0;
    int index = 0;
    std::unordered_set<int> uniqueNodes;

    try {
        while (std::getline(infile, line)) {
            ++lineNumber;
            if (line.find("->") != std::string::npos) {
                std::stringstream ss(line);
                int from, to;
                char ignore;
                ss >> from >> ignore >> ignore >> to;

                uniqueNodes.insert(from);
                uniqueNodes.insert(to);

                if (idMapping.find(from) == idMapping.end()) {
                    idMapping[from] = index++;
                }
                if (idMapping.find(to) == idMapping.end()) {
                    idMapping[to] = index++;
                }

                tripletList.emplace_back(idMapping[to], idMapping[from], 1.0); // Inverse direction for PageRank
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

                node.pageRank = std::stoi(fullLine.substr(citationCountStart, citationCountEnd - citationCountStart));
                nodes[id] = node;

                uniqueNodes.insert(id);

                if (idMapping.find(id) == idMapping.end()) {
                    idMapping[id] = index++;
                }
            }
        }

        numNodes = uniqueNodes.size();
    } catch (const std::exception& e) {
        std::cerr << "Error parsing line " << lineNumber << ": " << line << std::endl;
        std::cerr << "Exception: " << e.what() << std::endl;
        exit(EXIT_FAILURE);
    }
}

void computePageRank(const std::unordered_map<int, Node>& nodes, std::vector<Eigen::Triplet<double>>& tripletList, std::unordered_map<int, double>& pageRanks, const std::unordered_map<int, int>& idMapping, int numNodes) {
    Eigen::SparseMatrix<double> adjacencyMatrix(numNodes, numNodes);
    adjacencyMatrix.setFromTriplets(tripletList.begin(), tripletList.end());

    Eigen::VectorXd ranks = Eigen::VectorXd::Ones(numNodes) / numNodes;
    Eigen::VectorXd oldRanks(numNodes);

    Eigen::VectorXd danglingNodes = Eigen::VectorXd::Zero(numNodes);
    for (auto it = idMapping.begin(); it != idMapping.end(); ++it) {
        int id = it->first;
        int mappedId = it->second;
        if (nodes.at(id).outEdges.empty()) {
            danglingNodes[mappedId] = 1.0;
        }
    }

    for (int iteration = 0; iteration < MAX_ITERATIONS; ++iteration) {
        oldRanks = ranks;
        double danglingContribution = danglingNodes.dot(oldRanks) / numNodes;
        Eigen::VectorXd newRanks = DAMPING_FACTOR * (adjacencyMatrix * ranks + danglingContribution * Eigen::VectorXd::Ones(numNodes)) + (1 - DAMPING_FACTOR) / numNodes * Eigen::VectorXd::Ones(numNodes);

        // Normalize newRanks
        newRanks /= newRanks.sum();

        double diff = (newRanks - oldRanks).norm();
        if (diff < CONVERGENCE_THRESHOLD) {
            ranks = newRanks;
            break;
        }
        ranks = newRanks;
    }

    for (auto it = idMapping.begin(); it != idMapping.end(); ++it) {
        int originalId = it->first;
        int mappedId = it->second;
        pageRanks[originalId] = ranks(mappedId);
    }
}

void updateDotFile(const std::string& filename, const std::unordered_map<int, Node>& nodes, const std::unordered_map<int, double>& pageRanks) {
    std::ifstream infile(filename);
    std::ofstream outfile("data/output.dot");
    std::string line;
    while (std::getline(infile, line)) {
        if (line.find("->") != std::string::npos) {
            outfile << line << std::endl;
        } else if (line.find("[label=") != std::string::npos) {
            std::stringstream ss(line);
            int id;
            ss >> id;

            auto it = pageRanks.find(id);
            if (it != pageRanks.end()) {
                size_t pos = line.find("];");
                std::string newLine = line.substr(0, pos) + ", pageRank=\"" + std::to_string(it->second) + "\"];";
                outfile << newLine << std::endl;
            } else {
                outfile << line << std::endl;
            }
        } else {
            outfile << line << std::endl;
        }
    }
}

int main() {
    auto start = std::chrono::high_resolution_clock::now();

    std::unordered_map<int, Node> nodes;
    std::vector<Eigen::Triplet<double>> tripletList;
    std::unordered_map<int, int> idMapping;
    int numNodes;
    parseDotFile("data/citation_network_fixed.dot", nodes, tripletList, idMapping, numNodes);

    std::unordered_map<int, double> pageRanks;
    computePageRank(nodes, tripletList, pageRanks, idMapping, numNodes);

    updateDotFile("data/citation_network_fixed.dot", nodes, pageRanks);

    auto end = std::chrono::high_resolution_clock::now();
    std::chrono::duration<double> duration = end - start;
    std::cout << "Execution time: " << duration.count() << " seconds" << std::endl;

    return 0;
}
