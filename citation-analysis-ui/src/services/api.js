import axios from 'axios';

const API_URL = 'http://localhost:9990';  // Update this with your FASTAPI server URL

export const searchPapers = async (query) => {
  const response = await axios.post(`${API_URL}/search_papers/`, { query });
  return response.data;
};

export const generateTree = async (paperId, depth) => {
  const response = await axios.post(`${API_URL}/generate_tree/`, { paper_id: paperId, depth });
  return response.data;
};

export const getRootInfo = async (paperId, depth) => {
    const response = await axios.post(`${API_URL}/get_root_info/`, {
      paper_id: parseInt(paperId),
      depth: parseInt(depth)
    });
    return response.data;
  };

export const getChildren = async (paperId, rootId, depth, numPapers, selectionCriteria) => {
  const response = await axios.post(`${API_URL}/get_children/`, {
    paper_id: paperId,
    root_id: rootId,
    depth,
    num_papers: numPapers,
    selection_criteria: selectionCriteria
  });
  return response.data;
};

export const getPaperInfo = async (paperId) => {
  const response = await axios.post(`${API_URL}/get_paper_info/`, { paper_id: paperId });
  return response.data;
};