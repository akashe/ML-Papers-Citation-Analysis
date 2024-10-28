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
import { Autocomplete } from '@mui/material';
import debounce from 'lodash/debounce';

function CitationNetwork() {
  const [searchQuery, setSearchQuery] = useState('');
  const [paperOptions, setPaperOptions] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState('');
  const [depth, setDepth] = useState(2);
  const [numPapers, setNumPapers] = useState(10);
  const [selectionCriteria, setSelectionCriteria] = useState('citationCount');
  const [rootNode, setRootNode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const debouncedSearch = React.useCallback(
    debounce(async (query) => {
      if (!query || query.length < 3) return; // Only search if query is 3 or more characters
      setSearchLoading(true);
      try {
        const response = await axios.post('/search_papers/', { query });
        setPaperOptions(response.data);
      } catch (error) {
        console.error('Error searching papers:', error);
      } finally {
        setSearchLoading(false);
      }
    }, 800), // Increased debounce delay to 800ms
    [] // Empty dependency array since we don't need to recreate this function
  );

  React.useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

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
        <Grid item xs={12} sm={8}>
        <Autocomplete
          fullWidth
          options={paperOptions}
          getOptionLabel={(option) => option.label || ''}
          loading={searchLoading}
          onInputChange={(_, newInputValue) => {
            setSearchQuery(newInputValue);
            if (newInputValue.length >= 3) { // Only trigger search if 3 or more characters
              debouncedSearch(newInputValue);
            } else {
              setPaperOptions([]); // Clear options if input is too short
            }
          }}
          onChange={(_, newValue) => {
            setSelectedPaper(newValue ? newValue.id : '');
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search for a paper (minimum 3 characters)"
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {searchLoading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
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