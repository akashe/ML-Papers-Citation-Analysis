#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <unordered_map>
#include <vector>
#include <cmath>
#include <limits>
#include <thread>
#include <mutex>

const double DAMPING_FACTOR = 0.85;
const int MAX_ITERATIONS = 100;
const double CONVERGENCE_THRESHOLD = 1e-6;
const int NUM_THREADS = 8;  // Adjust this based on your CPU

struct Node {
    std::string label;
    int year;
    int citationCount;
    double pageRank;
    std::vector<int> outEdges;
    std::vector<int> inEdges;
};

std::mutex mtx;

void parseDotFile(const std::string& filename, std::unordered_map<int, Node>& graph) {
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
                graph[from].outEdges.push_back(to);
                graph[to].inEdges.push_back(from);
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
                graph[id] = node;
            }
        }
    } catch (const std::exception& e) {
        std::cerr << "Error parsing line " << lineNumber << ": " << line << std::endl;
        std::cerr << "Exception: " << e.what() << std::endl;
        exit(EXIT_FAILURE);
    }
}

void computePageRankChunk(std::unordered_map<int, Node>& graph, std::unordered_map<int, double>& newPageRanks, int start, int end) {
    double localDiff = 0.0;

    for (auto it = graph.begin(); std::distance(graph.begin(), it) < end; ++it) {
        if (std::distance(graph.begin(), it) < start) continue;

        int id = it->first;
        Node& node = it->second;
        double rankSum = 0.0;

        for (int inEdge : node.inEdges) {
            rankSum += graph[inEdge].pageRank / graph[inEdge].outEdges.size();
        }

        double newRank = (1 - DAMPING_FACTOR) / graph.size() + DAMPING_FACTOR * rankSum;
        newPageRanks[id] = newRank;
        localDiff += std::abs(newRank - node.pageRank);
    }

    std::lock_guard<std::mutex> lock(mtx);
    for (auto it = newPageRanks.begin(); std::distance(newPageRanks.begin(), it) < end; ++it) {
        if (std::distance(newPageRanks.begin(), it) < start) continue;

        graph[it->first].pageRank = it->second;
    }
}

void computePageRank(std::unordered_map<int, Node>& graph) {
    int numNodes = graph.size();
    std::unordered_map<int, double> newPageRanks;

    for (int iteration = 0; iteration < MAX_ITERATIONS; ++iteration) {
        std::vector<std::thread> threads;
        int chunkSize = numNodes / NUM_THREADS;

        for (int i = 0; i < NUM_THREADS; ++i) {
            int start = i * chunkSize;
            int end = (i + 1) * chunkSize;
            if (i == NUM_THREADS - 1) end = numNodes;

            threads.emplace_back(computePageRankChunk, std::ref(graph), std::ref(newPageRanks), start, end);
        }

        for (auto& thread : threads) {
            thread.join();
        }

        double diff = 0.0;
        for (const auto& [id, node] : graph) {
            diff += std::abs(newPageRanks[id] - node.pageRank);
        }

        if (diff < CONVERGENCE_THRESHOLD) {
            break;
        }
    }
}

void updateDotFile(const std::string& filename, std::unordered_map<int, Node>& graph) {
    std::ifstream infile(filename);
    std::ofstream outfile("output.dot");
    std::string line;
    while (std::getline(infile, line)) {
        if (line.find("->") != std::string::npos) {
            outfile << line << std::endl;
        } else if (line.find("[label=") != std::string::npos) {
            std::stringstream ss(line);
            int id;
            ss >> id;
            size_t pos = line.find("];");
            std::string newLine = line.substr(0, pos) + ", pageRank=\"" + std::to_string(graph[id].pageRank) + "\"];";
            outfile << newLine << std::endl;
        } else {
            outfile << line << std::endl;
        }
    }
}

int main() {
    std::unordered_map<int, Node> graph;
    parseDotFile("data/citation_network_fixed.dot", graph);
    computePageRank(graph);
    updateDotFile("data/citation_network_fixed.dot", graph);
    return 0;
}
