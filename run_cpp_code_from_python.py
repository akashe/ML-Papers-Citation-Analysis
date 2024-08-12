import subprocess
from fastapi import HTTPException
parsed_dot_file_name = "data/output.dot"


def run_bfs_cpp_generation(paper_id: int, depth: int):
    executable = './graph_bfs'  # Path to the compiled executable
    result = subprocess.run([executable, str(paper_id), str(depth), parsed_dot_file_name], capture_output=True, text=True)

    if result.returncode != 0:
        print(f"Error running BFS generation: {result.stderr}")
    else:
        # print(f"Output: {result.stdout}")
        print("Successful tree generation")


def create_png_from_dot(paper_id: int, depth: int):
    executable = "dot"
    image_format = "-Tpng"
    input_file = f"data/bfs_trees/bfs_tree_{paper_id}_{depth}.dot"
    output_file = f"-o data/pngs/{paper_id}_{depth}.png"
    result = subprocess.run([executable, image_format, input_file, output_file], capture_output=True, text=True)

    if result.returncode != 0:
        print(f"Error creating png from dot file: {result.stderr}")
    else:
        # print(f"Output: {result.stdout}")
        print("Successful png generation")


def get_path_between_two_nodes(start_node, end_node, max_depth="10"):
    executable = './find_path'  # Path to the compiled executable for path finding
    result = subprocess.run([executable, start_node, end_node, max_depth, parsed_dot_file_name], capture_output=True, text=True)

    if result.returncode != 0:
        print(f"Error finding paths: {result.stderr}")
        raise HTTPException(status_code=500, detail="Error finding paths")
    else:
        paths = result.stdout.strip().split('\n')
        if "No path found" in paths[0]:
            return {"paths": None, "message": "No path found between the nodes."}
        else:
            paths_list = [path.split() for path in paths]
            return {"paths": paths_list}
