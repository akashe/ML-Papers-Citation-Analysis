import React, { useState } from 'react';
import SearchPaper from './components/SearchPaper';
import CitationGraph from './components/CitationGraph';
import { generateTree, getRootInfo, getChildren } from './services/api';
import './App.css';

function App() {
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [graphElements, setGraphElements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [depth, setDepth] = useState(3);
  const [numPapers, setNumPapers] = useState(10);
  const [selectionCriteria, setSelectionCriteria] = useState('citationCount');

  const handlePaperSelect = async (paperId, selectedDepth, selectedNumPapers, selectedCriteria) => {
    setIsLoading(true);
    setSelectedPaper(paperId);
    setDepth(selectedDepth);
    setNumPapers(selectedNumPapers);
    setSelectionCriteria(selectedCriteria);

    try {
      const response = await generateTree(paperId, selectedDepth);
      if (response.message === 'Tree already exists' || response.message === 'Tree generation started') {
        setTimeout(async () => {
          const rootInfo = await getRootInfo(paperId, selectedDepth);
          const rootElement = {
            data: {
              id: rootInfo.id,
              label: rootInfo.label || rootInfo.id,
              fillcolor: '#cccccc'
            }
          };

          const children = await getChildren(paperId, paperId, selectedDepth, selectedNumPapers, selectedCriteria);
          const childElements = children.map(child => ({
            data: {
              id: child.id,
              label: child.label || child.id,
              fillcolor: '#cccccc'
            }
          }));

          const edgeElements = children.map(child => ({
            data: {
              source: paperId,
              target: child.id
            }
          }));

          setGraphElements([rootElement, ...childElements, ...edgeElements]);
          setIsLoading(false);
        }, 5000);
      }
    } catch (error) {
      console.error('Error generating tree:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Citation Analysis Tool</h1>
      <SearchPaper onPaperSelect={handlePaperSelect} />
      {isLoading && <div className="spinner"></div>}
      {selectedPaper && (
        <CitationGraph
          elements={graphElements}
          rootId={selectedPaper}
          depth={depth}
          numPapers={numPapers}
          selectionCriteria={selectionCriteria}
        />
      )}
    </div>
  );
}

export default App;