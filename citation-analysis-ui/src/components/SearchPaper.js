import React, { useState } from 'react';
import { searchPapers } from '../services/api';

const SearchPaper = ({ onPaperSelect }) => {
  const [query, setQuery] = useState('');
  const [papers, setPapers] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState('');
  const [depth, setDepth] = useState(3);
  const [numPapers, setNumPapers] = useState(10);
  const [selectionCriteria, setSelectionCriteria] = useState('citationCount');

  const handleSearch = async () => {
    const results = await searchPapers(query);
    setPapers(results);
  };

  const handleGenerateTree = () => {
    onPaperSelect(selectedPaper, depth, numPapers, selectionCriteria);
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a paper"
      />
      <button onClick={handleSearch}>Search</button>
      <select onChange={(e) => setSelectedPaper(e.target.value)} value={selectedPaper}>
        <option value="">Select a paper</option>
        {papers.map((paper) => (
          <option key={paper.id} value={paper.id}>
            {paper.label}
          </option>
        ))}
      </select>
      <input
        type="number"
        value={depth}
        onChange={(e) => setDepth(parseInt(e.target.value))}
        min="2"
        max="20"
        placeholder="Depth"
      />
      <select value={numPapers} onChange={(e) => setNumPapers(parseInt(e.target.value))}>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="40">40</option>
        <option value="60">60</option>
        <option value="100">100</option>
      </select>
      <select value={selectionCriteria} onChange={(e) => setSelectionCriteria(e.target.value)}>
        <option value="citationCount">Citation Count</option>
        <option value="pageRank">PageRank</option>
        <option value="random">Random</option>
      </select>
      <button onClick={handleGenerateTree}>Generate Tree</button>
    </div>
  );
};

export default SearchPaper;