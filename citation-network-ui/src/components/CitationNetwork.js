import React, { useState } from 'react';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  CircularProgress,
  Box,
  Typography
} from '@mui/material';
import axios from '../axiosInstance';
import Graph from './Graph';

function CitationNetwork() {
  const [searchQuery, setSearchQuery] = useState('');
  const [paperOptions, setPaperOptions] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState('');
  const [depth, setDepth] = useState(2);
  const [numPapers, setNumPapers] = useState(10);
  const [selectionCriteria, setSelectionCriteria] = useState('citationCount');
  const [loading, setLoading] = useState(false);
  const [rootNode, setRootNode] = useState(null);

  const handleSearch = () => {
    axios
      .post('/search_papers/', { query: searchQuery })
      .then((response) => {
        setPaperOptions(response.data);
      })
      .catch((error) => {
        console.error('Error searching papers:', error);
      });
  };

  const handleGenerateTree = () => {
    setLoading(true);
    axios
      .post('/generate_tree/', {
        paper_id: parseInt(selectedPaper),
        depth: parseInt(depth),
      })
      .then((response) => {
        if (response.data.message === 'Tree already exists') {
          loadRootNode();
        } else {
          // Wait a bit for the backend to generate the tree
          setTimeout(loadRootNode, 5000);
        }
      })
      .catch((error) => {
        console.error('Error generating tree:', error);
        setLoading(false);
      });
  };

  const loadRootNode = () => {
    axios
      .post('/get_root_info/', {
        paper_id: parseInt(selectedPaper),
        depth: parseInt(depth),
      })
      .then((response) => {
        setRootNode(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading root node:', error);
        setLoading(false);
      });
  };

  return (
    <Box sx={{ 
      mt: 1,  // Increased top margin
      mx: 'auto',
      maxWidth: '1200px',
      p: 1,
    }}>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{
          fontFamily: '"Inter Display", sans-serif',
          fontSize: "30px",
          fontWeight: "700",
          letterSpacing: "-1px",
          textAlign: "center",
          color: "rgb(51, 51, 51)",
          mb: 4
        }}
      >
        Generate Citation Network
      </Typography>
      <Grid container spacing={2} alignItems="center">
        {/* Search and Paper Selection */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Search for a paper"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            fullWidth
          >
            Search
          </Button>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Select Paper</InputLabel>
            <Select
              value={selectedPaper}
              onChange={(e) => setSelectedPaper(e.target.value)}
              label="Select Paper"
            >
              {paperOptions.map((paper) => (
                <MenuItem key={paper.id} value={paper.id}>
                  {paper.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Depth, Number of Papers, Selection Criteria */}
        <Grid item xs={12} sm={2}>
          <TextField
            label="Depth"
            type="number"
            variant="outlined"
            fullWidth
            inputProps={{ min: 2, max: 20 }}
            value={depth}
            onChange={(e) => setDepth(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Number of Papers</InputLabel>
            <Select
              value={numPapers}
              onChange={(e) => setNumPapers(e.target.value)}
              label="Number of Papers"
            >
              {[10, 20, 40, 60, 100].map((num) => (
                <MenuItem key={num} value={num}>
                  {num}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Selection Criteria</InputLabel>
            <Select
              value={selectionCriteria}
              onChange={(e) => setSelectionCriteria(e.target.value)}
              label="Selection Criteria"
            >
              <MenuItem value="citationCount">Citation Count</MenuItem>
              <MenuItem value="pageRank">PageRank</MenuItem>
              <MenuItem value="random">Random</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Generate Tree Button */}
        <Grid item xs={12} sm={3}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleGenerateTree}
            fullWidth
          >
            Generate Tree
          </Button>
        </Grid>
      </Grid>

      {/* Loading Indicator */}
      {loading && (
        <Grid container justifyContent="center" sx={{ mt: 2 }}>
          <CircularProgress />
        </Grid>
      )}

      {/* Graph Component */}
      {rootNode && !loading && (
        <Graph
          rootNode={rootNode}
          depth={depth}
          numPapers={numPapers}
          selectionCriteria={selectionCriteria}
        />
      )}
    </Box>
  );
}

export default CitationNetwork;