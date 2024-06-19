import re
import random


def parse_dot_file(dot_filename):
    nodes = {}
    edges = []
    node_pattern = re.compile(r'(\d+)\[label="(.*?)", year="(\d+)", citationCount="(\d+)", pageRank="([\d\.]+)"\];')
    edge_pattern = re.compile(r'(\d+)\s*->\s*(\d+);')

    with open(dot_filename, 'r') as file:
        for line in file:
            node_match = node_pattern.match(line)
            if node_match:
                node_id = int(node_match.group(1))
                label = node_match.group(2)
                year = int(node_match.group(3))
                citation_count = int(node_match.group(4))
                page_rank = float(node_match.group(5))
                nodes[node_id] = {'label': label, 'year': year, 'citation_count': citation_count,
                                  'page_rank': page_rank}
            else:
                edge_match = edge_pattern.match(line)
                if edge_match:
                    from_node = int(edge_match.group(1))
                    to_node = int(edge_match.group(2))
                    edges.append((from_node, to_node))

    return nodes, edges


def select_nodes(nodes, num_nodes=1000):
    selected_node_ids = random.sample(list(nodes.keys()), num_nodes)
    selected_nodes = {node_id: nodes[node_id] for node_id in selected_node_ids}
    return selected_nodes


def filter_edges(edges, selected_nodes):
    selected_node_ids = set(selected_nodes.keys())
    selected_edges = [(from_node, to_node) for from_node, to_node in edges if
                      from_node in selected_node_ids and to_node in selected_node_ids]
    return selected_edges


def write_dot_file(nodes, edges, output_dot_filename):
    with open(output_dot_filename, 'w') as file:
        file.write("digraph G {\n")
        for node_id, node in nodes.items():
            file.write(
                f'{node_id}[label="{node["label"]}", year="{node["year"]}", citationCount="{node["citation_count"]}", pageRank="{node["page_rank"]}"];\n')
        for from_node, to_node in edges:
            file.write(f'{from_node} -> {to_node};\n')
        file.write("}\n")


if __name__ == "__main__":
    input_dot_filename = 'data/graph_with_non_zero_pagerank.dot'
    output_dot_filename = 'data/sampled_graph.dot'
    num_nodes = 1000

    nodes, edges = parse_dot_file(input_dot_filename)
    selected_nodes = select_nodes(nodes, num_nodes)
    selected_edges = filter_edges(edges, selected_nodes)
    write_dot_file(selected_nodes, selected_edges, output_dot_filename)
