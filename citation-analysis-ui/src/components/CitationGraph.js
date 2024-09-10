import React, { useEffect, useState, useRef } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import { getChildren, getPaperInfo } from '../services/api';

const CitationGraph = ({ elements, rootId, depth, numPapers, selectionCriteria }) => {
  const [cyInstance, setCyInstance] = useState(null);
  const [tooltip, setTooltip] = useState({ display: 'none', content: '', x: 0, y: 0 });
  const cyRef = useRef(null);

  useEffect(() => {
    if (cyInstance && elements.length > 0) {
      cyInstance.elements().remove();
      cyInstance.add(elements);

      cyInstance.on('tap', 'node', function(evt) {
        const node = evt.target;
        if (node.hasClass('expanded')) {
          collapseChildren(node);
        } else {
          expandChildren(node);
        }
      });

      cyInstance.on('mouseover', 'node', function(evt) {
        const node = evt.target;
        showTooltip(node);
      });

      cyInstance.on('mouseout', 'node', function() {
        hideTooltip();
      });

      cyInstance.on('mousemove', function(evt) {
        const pos = evt.renderedPosition || evt.position;
        setTooltip(prev => ({
          ...prev,
          x: pos.x + 15,
          y: pos.y + 15
        }));
      });

      // Center and fit the graph
      cyInstance.fit();
      cyInstance.center();

      // Apply layout
      cyInstance.layout({
        name: 'breadthfirst',
        directed: true,
        padding: 50,
        spacingFactor: 1.5,
        animate: true,
        animationDuration: 1000,
        fit: true,
        maximal: true
      }).run();
    }
  }, [cyInstance, elements]);

  const collapseChildren = (node) => {
    const nodesToRemove = [];
    const edgesToRemove = [];

    function recursiveCollapse(nodeId) {
      const childrenEdges = cyInstance.edges(`[source="${nodeId}"]`);
      childrenEdges.forEach(edge => {
        const targetNode = edge.target();
        recursiveCollapse(targetNode.id());
        edgesToRemove.push(edge);
        nodesToRemove.push(targetNode);
      });
    }

    recursiveCollapse(node.id());

    cyInstance.batch(() => {
      edgesToRemove.forEach(edge => edge.remove());
      nodesToRemove.forEach(node => node.remove());
    });

    node.removeClass('expanded');
  };

  const expandChildren = async (node) => {
    const children = await getChildren(node.id(), rootId, depth, numPapers, selectionCriteria);
    const childNodes = children.map(child => ({
      data: { 
        id: child.id, 
        label: child.label || child.id,
        fillcolor: child.fillcolor || '#cccccc'
      }
    }));
    const childEdges = children.map(child => ({
      data: { source: node.id(), target: child.id }
    }));

    cyInstance.batch(() => {
      cyInstance.add([...childNodes, ...childEdges]);
    });

    node.addClass('expanded');

    // Re-run layout
    cyInstance.layout({
      name: 'breadthfirst',
      directed: true,
      padding: 50,
      spacingFactor: 1.5,
      animate: true,
      animationDuration: 1000,
      fit: true,
      maximal: true
    }).run();
  };

  const showTooltip = async (node) => {
    const info = await getPaperInfo(node.id());
    setTooltip({
      display: 'block',
      content: `
        <h4>${info.title}</h4>
        <p><strong>Published Date:</strong> ${info.published_date}</p>
        <p><strong>Citation Count:</strong> ${info.citationCount}</p>
        <p><strong>TLDR:</strong> ${info.tldr}</p>
      `,
      x: node.renderedPosition().x,
      y: node.renderedPosition().y
    });
  };

  const hideTooltip = () => {
    setTooltip(prev => ({ ...prev, display: 'none' }));
  };

  return (
    <div style={{ position: 'relative', height: '80vh', border: '1px solid #ccc' }}>
      <CytoscapeComponent
        elements={elements}
        style={{ width: '100%', height: '100%' }}
        cy={(cy) => {
          setCyInstance(cy);
          cyRef.current = cy;
        }}
        layout={{
          name: 'breadthfirst',
          directed: true,
          padding: 50,
          spacingFactor: 1.5,
          animate: false,
          fit: true,
          maximal: true
        }}
        stylesheet={[
          {
            selector: 'node',
            style: {
              'label': 'data(label)',
              'background-color': 'data(fillcolor)',
              'shape': 'ellipse',
              'width': 30,
              'height': 30,
              'text-valign': 'bottom',
              'text-halign': 'center',
              'text-wrap': 'wrap',
              'text-max-width': 100,
              'font-size': '8px',
              'padding-bottom': '5px'
            }
          },
          {
            selector: 'edge',
            style: {
              'width': 1,
              'line-color': '#ccc',
              'target-arrow-color': '#ccc',
              'target-arrow-shape': 'triangle',
              'curve-style': 'bezier',
              'arrow-scale': 0.5
            }
          }
        ]}
      />
      <div
        style={{
          position: 'absolute',
          display: tooltip.display,
          left: tooltip.x,
          top: tooltip.y,
          backgroundColor: 'white',
          border: '1px solid black',
          padding: '5px',
          zIndex: 1000,
          maxWidth: '300px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)'
        }}
        dangerouslySetInnerHTML={{ __html: tooltip.content }}
      />
    </div>
  );
};

export default CitationGraph;