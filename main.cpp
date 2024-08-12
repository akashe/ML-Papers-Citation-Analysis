#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <unordered_map>
#include <boost/graph/adjacency_list.hpp>
#include <boost/graph/graphviz.hpp>
#include <rapidjson/document.h>
#include <rapidjson/istreamwrapper.h>
#include <thread>
#include <mutex>
#include <sstream>
#include <utility>
#include <stdexcept>

using namespace rapidjson;
using namespace boost;
using namespace std;

// Define custom property tags for vertex properties
struct VertexProperties {
    string name;
    string url;
    int centrality;
    int year;
};

// Define the graph type
typedef adjacency_list<vecS, vecS, directedS, VertexProperties> Graph;
typedef graph_traits<Graph>::vertex_descriptor Vertex;

// Struct to store paper information
struct PaperInfo {
    string title;
    string url;
    int year;
    int citationCount;
};

// Global variables
mutex mtx;
std::unordered_map<string, Vertex> node_map; // Use std::unordered_map explicitly
std::unordered_map<string, PaperInfo> paper_info_map; // Use std::unordered_map explicitly
Graph g;
int csv_lines_processed = 0;
int csv_lines_skipped = 0;
int json_lines_processed = 0;
int json_lines_skipped = 0;

std::string ReplaceAll(std::string str, const std::string& from, const std::string& to) {
    size_t start_pos = 0;
    while((start_pos = str.find(from, start_pos)) != std::string::npos) {
        str.replace(start_pos, from.length(), to);
        start_pos += to.length(); // Handles case where 'to' is a substring of 'from'
    }
    return str;
}

vector<string> split_csv_line(const string& line) {
    vector<string> result;
    stringstream ss(line);
    string item;
    bool in_quotes = false;
    string temp;
    
    while (getline(ss, item, ',')) {
        if (in_quotes) {
            temp += ',' + item;
            if (!item.empty() && item.back() == '"') {
                result.push_back(temp.substr(1, temp.size() - 2)); // Remove surrounding quotes
                in_quotes = false;
            }
        } else {
            if (!item.empty() && item.front() == '"' && item.back() != '"') {
                temp = item;
                in_quotes = true;
            } else if (!item.empty() && item.front() == '"' && item.back() == '"') {
                result.push_back(item.substr(1, item.size() - 2)); // Remove surrounding quotes
            } else {
                result.push_back(item);
            }
        }
    }
    
    return result;
}

string escape_dot_string(const string& str) {
    string escaped = str;
    size_t pos = 0;
    while ((pos = escaped.find('"', pos)) != string::npos) {
        escaped.replace(pos, 1, "\\\"");
        pos += 2;
    }
    return escaped;
}

void load_paper_info(const string& csv_filename) {
    ifstream file(csv_filename);
    if (!file.is_open()) {
        cerr << "Error opening file: " << csv_filename << endl;
        return;
    }

    string line;
    getline(file, line); // Skip header

    while (getline(file, line)) {
        vector<string> fields = split_csv_line(line);
        if (fields.size() < 5) {  // Adjusted number of expected columns
            cerr << "Skipping malformed line: " << line << endl;
            csv_lines_skipped++;
            continue;
        }

        string paperId = fields[0];
        string url = fields[1];
        string title_old = escape_dot_string(fields[2]);
        // TODO: replacing "" in paper names with nothing because some paper are being missed this way
        string title = ReplaceAll(title_old, std::string("\"\""), std::string(" "));
        string year = fields[3];
        string citationCount = fields[4];

        try {
            int yearInt = stoi(year);
            int citationCountInt = stoi(citationCount);
            PaperInfo info = {title, url, yearInt, citationCountInt};
            paper_info_map[paperId] = info;

            // Add node to graph
            Vertex v = add_vertex(g);
            node_map[paperId] = v;
            g[v].name = title;
            g[v].url = url;
            g[v].centrality = citationCountInt;
            g[v].year = yearInt;
            csv_lines_processed++;
        } catch (const std::invalid_argument& e) {
            cerr << "Invalid argument: " << e.what() << " in line: " << line << endl;
            csv_lines_skipped++;
            continue;
        } catch (const std::out_of_range& e) {
            cerr << "Out of range: " << e.what() << " in line: " << line << endl;
            csv_lines_skipped++;
            continue;
        }
    }

    file.close();
}

void parse_jsonl_file(const string& filename) {
    ifstream ifs(filename);
    if (!ifs.is_open()) {
        cerr << "Error opening file: " << filename << endl;
        return;
    }

    IStreamWrapper isw(ifs);
    string line;
    while (getline(ifs, line)) {
        Document d;
        d.Parse(line.c_str());

        if (!d.IsObject()) {
            cerr << "Skipping malformed JSON line: " << line << endl;
            json_lines_skipped++;
            continue;
        }

        auto citedPaperIdItr = d.FindMember("citedPaperId");
        auto citingPaperItr = d.FindMember("citingPaper");
        
        if (citedPaperIdItr == d.MemberEnd() || !citedPaperIdItr->value.IsString() ||
            citingPaperItr == d.MemberEnd() || !citingPaperItr->value.IsObject()) {
            cerr << "Skipping malformed JSON line: " << line << endl;
            json_lines_skipped++;
            continue;
        }

        auto& citingPaper = citingPaperItr->value;
        auto citingPaperIdItr = citingPaper.FindMember("paperId");
        auto citingPaperTitleItr = citingPaper.FindMember("title");
        auto citingPaperYearItr = citingPaper.FindMember("year");

        // Replace null values with defaults
        string cited_paper_id = citedPaperIdItr->value.IsString() ? citedPaperIdItr->value.GetString() : "unknown";
        string citing_paper_id = citingPaperIdItr->value.IsString() ? citingPaperIdItr->value.GetString() : "unknown";
        string citing_paper_title = citingPaperTitleItr->value.IsString() ? escape_dot_string(citingPaperTitleItr->value.GetString()) : "unknown";
        int citing_paper_year = citingPaperYearItr->value.IsInt() ? citingPaperYearItr->value.GetInt() : 0;

        string url_start = "https://www.semanticscholar.org/paper/";

        lock_guard<mutex> lock(mtx);
        if (node_map.find(cited_paper_id) == node_map.end()) {
            // If the cited paper is not in the initial set, add it as an isolated node
            Vertex v = add_vertex(g);
            node_map[cited_paper_id] = v;
            g[v].name = cited_paper_id; // Just adding the paper id as a node name
            g[v].url = url_start + cited_paper_id;
            g[v].centrality = 0;
            g[v].year = 0;
        }
        if (node_map.find(citing_paper_id) == node_map.end()) {
            // If the citing paper is not in the initial set, add it as an isolated node
            Vertex v = add_vertex(g);
            node_map[citing_paper_id] = v;
            g[v].name = citing_paper_title;
            g[v].url = url_start + citing_paper_id;
            g[v].centrality = 0;
            g[v].year = citing_paper_year;
        }

//        add_edge(node_map[citing_paper_id], node_map[cited_paper_id], g);
        add_edge(node_map[cited_paper_id], node_map[citing_paper_id], g);

        if (json_lines_processed % 100000 == 0) {
            cout << "Json lines processed: " << json_lines_processed << endl;
        }

        json_lines_processed++;
    }

    ifs.close();
}

// Custom property writer for vertex properties
class VertexPropertyWriter {
public:
    VertexPropertyWriter(Graph& g) : g(g) {}

    template <class VertexOrEdge>
    void operator()(ostream& out, const VertexOrEdge& v) const {
        out << "[label=\"" << g[v].name << "\"";
        out << ", year=\"" << g[v].year << "\"";
        out << ", citationCount=\"" << g[v].centrality << "\"";
        out << ", url=\"" << g[v].url << "\"]";
    }

private:
    Graph& g;
};

int main() {
    // Load paper information from cleaned CSV file
    string csv_filename = "data/semantic_scholar_paper_details_for_c_code.csv";
    load_paper_info(csv_filename);

    cout << "CSV lines processed: " << csv_lines_processed << ", CSV lines skipped: " << csv_lines_skipped << endl;

    // Parse the JSONL file to build the graph
    string jsonl_filename = "data/citations.jsonl";
    parse_jsonl_file(jsonl_filename);

    cout << "JSON lines processed: " << json_lines_processed << ", JSON lines skipped: " << json_lines_skipped << endl;

    // Save the graph to a file with custom property writer
    ofstream dotfile("data/citation_network.dot");
    write_graphviz(dotfile, g, VertexPropertyWriter(g));

    cout << "Graph construction complete. Nodes: " << num_vertices(g) << ", Edges: " << num_edges(g) << endl;

    return 0;
}
