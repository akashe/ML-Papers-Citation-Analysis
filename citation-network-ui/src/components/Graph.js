import React, { useEffect, useRef } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import axios from '../axiosInstance'; // Import the custom Axios instance
import { makeStyles } from '@mui/styles';
import {
  Card,
  CardContent,
  Typography,
  Popover,
  Button,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';

const useStyles = makeStyles({
  graphContainer: {
    height: '600px',
    width: '100%',
    marginTop: '20px',
  },
  tooltipCard: {
    // pointerEvents: 'none',
    maxWidth: '300px',
  },
  addButton: {
    marginTop: '10px',
  },
});

function Graph({ rootNode, depth, numPapers, selectionCriteria }) {
  const classes = useStyles();
  const cyRef = useRef(null);
  const { currentUser } = useAuth();
  const [tooltip, setTooltip] = React.useState({
    open: false,
    anchorEl: null,
    data: null,
    added: false, // New property
  });

  useEffect(() => {
    if (cyRef.current) {
      const cy = cyRef.current;

      // Clear existing elements
      cy.elements().remove();

      // Add root node
      cy.add({
        data: {
          id: rootNode.id.toString(),
          label: rootNode.label || rootNode.id.toString(),
        },
      });

      // Load first-level children
      loadChildren(rootNode.id.toString());

      // Center and fit the graph
      cy.layout({ name: 'breadthfirst', directed: true, padding: 10 }).run();
    }
  }, [rootNode]);

  // Function to load children of a node
  const loadChildren = (nodeId) => {
    axios
      .post('/get_children/', {
        paper_id: parseInt(nodeId),
        depth: parseInt(depth),
        root_id: parseInt(rootNode.id),
        num_papers: parseInt(numPapers),
        selection_criteria: selectionCriteria,
      })
      .then((response) => {
        const cy = cyRef.current;
        cy.batch(() => {
          response.data.forEach((child) => {
            if (!cy.getElementById(child.id.toString()).length) {
              cy.add({
                data: {
                  id: child.id.toString(),
                  label: child.label || child.id.toString(),
                },
              });
            }
            if (
              !cy
                .edges(
                  `[source="${nodeId}"][target="${child.id.toString()}"]`
                )
                .length
            ) {
              cy.add({
                data: {
                  source: nodeId.toString(),
                  target: child.id.toString(),
                },
              });
            }
          });
        });

        // Re-layout the graph
        cy.layout({ name: 'breadthfirst', directed: true, padding: 10, spacingFactor: 1.5, }).run();
      })
      .catch((error) => {
        console.error('Error loading children:', error);
      });
  };

  // Function to collapse children of a node
  const collapseChildren = (nodeId) => {
    const cy = cyRef.current;
    const nodesToRemove = [];
    const edgesToRemove = [];

    const recursiveCollapse = (currentNodeId) => {
      const childrenEdges = cy.edges(`[source="${currentNodeId}"]`);
      childrenEdges.forEach((edge) => {
        const targetNode = edge.target();
        recursiveCollapse(targetNode.id());
        edgesToRemove.push(edge);
        nodesToRemove.push(targetNode);
      });
    };

    recursiveCollapse(nodeId);

    cy.batch(() => {
      edgesToRemove.forEach((edge) => edge.remove());
      nodesToRemove.forEach((node) => node.remove());
    });

    // Re-layout the graph
    cy.layout({ name: 'breadthfirst', directed: true, padding: 10, spacingFactor: 1.5 }).run();
  };

  // Event Handlers
  useEffect(() => {
    if (cyRef.current) {
      const cy = cyRef.current;

      cy.on('tap', 'node', (evt) => {
        const nodeId = evt.target.id();

        // Check if the node has been expanded already
        if (evt.target.data('expanded')) {
          // Collapse the node
          collapseChildren(nodeId);
          evt.target.data('expanded', false);
        } else {
          // Expand the node
          loadChildren(nodeId);
          evt.target.data('expanded', true);
        }
      });

      cy.on('mouseover', 'node', (evt) => {
        const nodeId = evt.target.id();
        const nodePosition = evt.target.renderedPosition();
        axios
          .post('/get_paper_info/', { paper_id: parseInt(nodeId) })
          .then((response) => {
            setTooltip({
              open: true,
              anchorPosition: {
                left: nodePosition.x + evt.cy.container().getBoundingClientRect().left,
                top: nodePosition.y + evt.cy.container().getBoundingClientRect().top,
              },
              data: response.data,
              nodeId: nodeId,
              added: false, // Reset the added state
            });
          })
          .catch((error) => {
            console.error('Error fetching paper info:', error);
          });
      });

      cy.on('mouseout', 'node', () => {
        // Immediately close and reset tooltip state
        setTooltip({
          open: false,
          anchorPosition: null,
          data: null,
          nodeId: null,
          added: false
        });
      });
    }
  }, [cyRef, depth, numPapers, selectionCriteria, rootNode]);

  const handleAddToReadingList = async () => {
    if (!currentUser) {
      console.log('No current user');
      return;
    }
    console.log('Add to Reading List clicked');
    const userDoc = doc(db, 'users', currentUser.uid);
    try {
      await updateDoc(userDoc, {
        readingList: arrayUnion(tooltip.nodeId),
      });
      console.log('Added to reading list');
      setTooltip({ ...tooltip, open: false, added: true });
    } catch (error) {
      console.error('Error adding to reading list:', error);
    }
  };

  return (
    <>
      <div className={classes.graphContainer}>
        <CytoscapeComponent
          elements={[]}
          style={{ width: '100%', height: '100%' }}
          cy={(cy) => {
            cyRef.current = cy;
          }}
          layout={{ name: 'breadthfirst', directed: true, padding: 10 }}
          stylesheet={[
            {
              selector: 'node',
              style: {
                label: 'data(label)',
                'background-color': '#1976d2',
                color: '#000',
                'text-valign': 'bottom',
                'text-halign': 'center',
                'text-wrap': 'wrap',
                'text-max-width': '100px',
                'font-size': '16px',
                'text-margin-y': '10px',
                width: 32,
                height: 32,
              },
            },
            {
              selector: 'edge',
              style: {
                width: 2,
                'line-color': '#ccc',
                'target-arrow-color': '#ccc',
                'target-arrow-shape': 'triangle',
                'curve-style': 'bezier',
              },
            },
          ]}
        />
      </div>

      <Popover
        open={tooltip.open}
        anchorReference="anchorPosition"
        anchorPosition={tooltip.anchorPosition}
        onClose={() => setTooltip({ open: false, anchorEl: null, data: null, nodeId: null, added: false })}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        disableRestoreFocus
        transitionDuration={0}  // Add this line
        style={{ pointerEvents: 'none' }}  // Add this line
      >
        {tooltip.data && (
          <Card className={classes.tooltipCard}>
            <CardContent>
              <Typography variant="h6">{tooltip.data.title}</Typography>
              <Typography variant="body2">
                <strong>Published Date:</strong> {tooltip.data.published_date}
              </Typography>
              <Typography variant="body2">
                <strong>Citation Count:</strong> {tooltip.data.citationCount}
              </Typography>
              {tooltip.data.url && (
                  <Typography
                    variant="body2"
                    className={classes.linkTypography}
                  >
                    <a
                      href={tooltip.data.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={classes.link}
                    >
                      Paper URL
                    </a>
                  </Typography>
                )}
              <Typography variant="body2">
                <strong>TL;DR:</strong> {tooltip.data.tldr}
              </Typography>
              {currentUser && currentUser.emailVerified && (
                <Button 
                  variant="contained"
                  color="primary" 
                  className={classes.addButton}
                  onClick={handleAddToReadingList}
                  disabled={tooltip.added} // Disable button if already added
                  >
                  {tooltip.added ? 'Added to Reading List' : 'Add to Reading List'}
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </Popover>
    </>
  );
}

export default Graph;
