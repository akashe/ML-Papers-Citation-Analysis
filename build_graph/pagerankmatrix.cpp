#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <vector>
#include <Eigen/Sparse>
#include <chrono>
#include <cmath>

const double DAMPING_FACTOR = 0.99;
const int MAX_ITERATIONS = 100;
const double CONVERGENCE_THRESHOLD = 1e-9;
const double MIN_DANGLING_CONTRIBUTION = 1e-9;

struct Node {
    std::string label;
    std::string url;
    int year;
    int citationCount;
    double pageRank;
    std::vector<int> outEdges;
};

void parseDotFile(const std::string& filename, std::unordered_map<int, Node>& nodes, std::vector<Eigen::Triplet<double>>& tripletList, std::unordered_map<int, int>& idMapping, int& numNodes, int& totalCitations, int& maxCitations) {
    std::ifstream infile(filename);
    std::string line;
    int lineNumber = 0;
    int index = 0;
    std::unordered_set<int> uniqueNodes;
    totalCitations = 0;
    maxCitations = 0;

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

                // Correcting the direction of edges for PageRank
                tripletList.emplace_back(idMapping[from], idMapping[to], 1.0); // Correct direction for PageRank
                nodes[to].outEdges.push_back(from); // Change direction here
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
                size_t citationCountEnd = fullLine.find("\"", citationCountStart);
                node.citationCount = std::stoi(fullLine.substr(citationCountStart, citationCountEnd - citationCountStart));

                size_t urlStart = fullLine.find("url=\"") + 5;
                size_t urlEnd = fullLine.find("\"]", urlStart);
                node.url = fullLine.substr(urlStart, urlEnd - urlStart);

                node.pageRank = 0.0;
                nodes[id] = node;

                uniqueNodes.insert(id);

                if (idMapping.find(id) == idMapping.end()) {
                    idMapping[id] = index++;
                }

                totalCitations += node.citationCount;
                if (node.citationCount > maxCitations) {
                    maxCitations = node.citationCount;
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

void computePageRank(const std::unordered_map<int, Node>& nodes, std::vector<Eigen::Triplet<double>>& tripletList, std::unordered_map<int, double>& pageRanks, const std::unordered_map<int, int>& idMapping, int numNodes, int totalCitations, int maxCitations) {
    Eigen::SparseMatrix<double> adjacencyMatrix(numNodes, numNodes);
    adjacencyMatrix.setFromTriplets(tripletList.begin(), tripletList.end());

    // Initialize ranks with citation count bias
    Eigen::VectorXd ranks(numNodes);
    for (const auto& it : idMapping) {
        int id = it.first;
        int mappedId = it.second;
        double normalizedCitation = log(nodes.at(id).citationCount + 1) / log(maxCitations + 1);
        ranks[mappedId] = normalizedCitation;
    }
    ranks /= ranks.sum();

    Eigen::VectorXd oldRanks(numNodes);

    Eigen::VectorXd danglingNodes = Eigen::VectorXd::Zero(numNodes);
    for (const auto& it : idMapping) {
        int id = it.first;
        int mappedId = it.second;
        if (nodes.at(id).outEdges.empty()) {
            danglingNodes[mappedId] = 1.0;
        }
    }

    for (int iteration = 0; iteration < MAX_ITERATIONS; ++iteration) {
        oldRanks = ranks;
        double danglingContribution = MIN_DANGLING_CONTRIBUTION * danglingNodes.sum();
        Eigen::VectorXd newRanks = DAMPING_FACTOR * (adjacencyMatrix * oldRanks + danglingContribution * Eigen::VectorXd::Ones(numNodes)) + (1 - DAMPING_FACTOR) / numNodes * Eigen::VectorXd::Ones(numNodes);

        newRanks /= newRanks.sum();

        double diff = (newRanks - oldRanks).norm();

        if (iteration % 1 == 0) {
            std::cout << "Iteration " << iteration << ": diff = " << diff << std::endl;
        }

        if (diff < CONVERGENCE_THRESHOLD) {
            ranks = newRanks;
            break;
        }
        ranks = newRanks;
    }

    double maxRank = ranks.maxCoeff();
    double scaleFactor = 1.0 / maxRank;

    for (const auto& it : idMapping) {
        int originalId = it.first;
        int mappedId = it.second;
        pageRanks[originalId] = ranks(mappedId) * scaleFactor;
    }

    double minRank = ranks.minCoeff() * scaleFactor;
    maxRank = ranks.maxCoeff() * scaleFactor;
    std::cout << "Min PageRank: " << minRank << ", Max PageRank: " << maxRank << std::endl;
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

    //  TODO: remove the next comment
    //  g++ -std=c++11 -I /Users/akashkumar/Downloads/eigen-3.4.0 -o pagerank pagerankmatrix.cpp

    auto start = std::chrono::high_resolution_clock::now();

    std::unordered_map<int, Node> nodes;
    std::vector<Eigen::Triplet<double>> tripletList;
    std::unordered_map<int, int> idMapping;
    int numNodes;
    int totalCitations;
    int maxCitations;
    parseDotFile("data/citation_network_fixed.dot", nodes, tripletList, idMapping, numNodes, totalCitations, maxCitations);

    std::unordered_map<int, double> pageRanks;
    computePageRank(nodes, tripletList, pageRanks, idMapping, numNodes, totalCitations, maxCitations);

    updateDotFile("data/citation_network_fixed.dot", nodes, pageRanks);

    auto end = std::chrono::high_resolution_clock::now();
    std::chrono::duration<double> duration = end - start;
    std::cout << "Execution time: " << duration.count() << " seconds" << std::endl;

    return 0;
}
