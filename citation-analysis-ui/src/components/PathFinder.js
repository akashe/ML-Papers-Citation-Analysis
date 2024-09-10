import React, { useState } from 'react';
import { findPaths } from '../services/api';

const PathFinder = () => {
  const [startId, setStartId] = useState('');
  const [endId, setEndId] = useState('');
  const [paths, setPaths] = useState([]);

  const handleFindPaths = async () => {
    const result = await findPaths(startId, endId);
    setPaths(result.paths);
  };

  return (
    <div>
      <input
        type="text"
        value={startId}
        onChange={(e) => setStartId(e.target.value)}
        placeholder="Start paper ID"
      />
      <input
        type="text"
        value={endId}
        onChange={(e) => setEndId(e.target.value)}
        placeholder="End paper ID"
      />
      <button onClick={handleFindPaths}>Find Paths</button>
      <ul>
        {paths.map((path, index) => (
          <li key={index}>{path.join(' -> ')}</li>
        ))}
      </ul>
    </div>
  );
};

export default PathFinder;