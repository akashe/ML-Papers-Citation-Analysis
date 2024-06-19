import re


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


def filter_and_write_dot_file(nodes, edges, output_dot_filename):
    with open(output_dot_filename, 'w') as file:
        file.write("digraph G {\n")
        for node_id, node in nodes.items():
            if node['page_rank'] > 0:
                file.write(
                    f'{node_id}[label="{node["label"]}", year="{node["year"]}", citationCount="{node["citation_count"]}", pageRank="{node["page_rank"]}"];\n')
        for from_node, to_node in edges:
            if from_node in nodes and to_node in nodes:
                if nodes[from_node]['page_rank'] > 0 and nodes[to_node]['page_rank'] > 0:
                    file.write(f'{from_node} -> {to_node};\n')
        file.write("}\n")


if __name__ == "__main__":
    input_dot_filename = 'data/output.dot'
    output_dot_filename = 'data/graph_with_non_zero_pagerank.dot'

    nodes, edges = parse_dot_file(input_dot_filename)
    filter_and_write_dot_file(nodes, edges, output_dot_filename)
