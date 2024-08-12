import re
import csv


def parse_dot_file(dot_filename):
    nodes = []
    edges = []
    node_pattern = re.compile(r'(\d+)\[label="(.*?)", year="(\d+)", citationCount="(\d+)", url="(.*?)", pageRank="([\deE\.\-]+)"\];')
    edge_pattern = re.compile(r'(\d+)\s*->\s*(\d+);')

    with open(dot_filename, 'r') as file:
        for line in file:
            node_match = node_pattern.match(line)
            if node_match:
                node_id = int(node_match.group(1))
                label = node_match.group(2)
                year = int(node_match.group(3))
                citation_count = int(node_match.group(4))
                url = node_match.group(5)
                page_rank = float(node_match.group(6))
                nodes.append([node_id, label, year, citation_count, url, page_rank])
            else:
                edge_match = edge_pattern.match(line)
                if edge_match:
                    from_node = int(edge_match.group(1))
                    to_node = int(edge_match.group(2))
                    edges.append([from_node, to_node])

    return nodes, edges


def write_csv(nodes, edges, nodes_filename, edges_filename):
    with open(nodes_filename, 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['node_id', 'label', 'year', 'citation_count', 'url', 'page_rank'])
        writer.writerows(nodes)

    with open(edges_filename, 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['from_node', 'to_node'])
        writer.writerows(edges)


if __name__ == "__main__":
    dot_filename = 'data/output.dot'
    nodes_filename = 'data/nodes.csv'
    edges_filename = 'data/edges.csv'

    nodes, edges = parse_dot_file(dot_filename)
    write_csv(nodes, edges, nodes_filename, edges_filename)
