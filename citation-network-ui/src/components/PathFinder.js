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
} from '@mui/material';
import axios from '../axiosInstance';
import PathGraph from './PathGraph'; // Import the new PathGraph component

function PathFinder() {
  const [searchQuery1, setSearchQuery1] = useState('');
  const [searchQuery2, setSearchQuery2] = useState('');
  const [paperOptions1, setPaperOptions1] = useState([]);
  const [paperOptions2, setPaperOptions2] = useState([]);
  const [selectedPaper1, setSelectedPaper1] = useState('');
  const [selectedPaper2, setSelectedPaper2] = useState('');
  const [loading, setLoading] = useState(false);
  const [paths, setPaths] = useState(null);

  const handleSearch1 = () => {
    axios
      .post('/search_papers/', { query: searchQuery1 })
      .then((response) => {
        setPaperOptions1(response.data);
      })
      .catch((error) => {
        console.error('Error searching papers:', error);
      });
  };

  const handleSearch2 = () => {
    axios
      .post('/search_papers/', { query: searchQuery2 })
      .then((response) => {
        setPaperOptions2(response.data);
      })
      .catch((error) => {
        console.error('Error searching papers:', error);
      });
  };

  const handleFindPaths = async () => {
    if (!selectedPaper1 || !selectedPaper2) {
      alert('Please select both papers.');
      return;
    }

    setLoading(true);
    setPaths(null);

    try {
      const response = await axios.post('/find_paths/', {
        start_id: parseInt(selectedPaper1),
        end_id: parseInt(selectedPaper2),
      });

      if (!response.data.paths) {
        alert(response.data.message);
        setLoading(false);
        return;
      }

      setPaths(response.data.paths);
    } catch (error) {
      console.error('Error finding paths:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Grid container spacing={2} alignItems="center">
        {/* First Paper Search and Selection */}
        <Grid item xs={12} sm={5}>
          <TextField
            label="Search for the first paper"
            variant="outlined"
            fullWidth
            value={searchQuery1}
            onChange={(e) => setSearchQuery1(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch1}
            fullWidth
          >
            Search
          </Button>
        </Grid>
        <Grid item xs={12} sm={5}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Select First Paper</InputLabel>
            <Select
              value={selectedPaper1}
              onChange={(e) => setSelectedPaper1(e.target.value)}
              label="Select First Paper"
            >
              {paperOptions1.map((paper) => (
                <MenuItem key={paper.id} value={paper.id}>
                  {paper.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Second Paper Search and Selection */}
        <Grid item xs={12} sm={5}>
          <TextField
            label="Search for the second paper"
            variant="outlined"
            fullWidth
            value={searchQuery2}
            onChange={(e) => setSearchQuery2(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch2}
            fullWidth
          >
            Search
          </Button>
        </Grid>
        <Grid item xs={12} sm={5}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Select Second Paper</InputLabel>
            <Select
              value={selectedPaper2}
              onChange={(e) => setSelectedPaper2(e.target.value)}
              label="Select Second Paper"
            >
              {paperOptions2.map((paper) => (
                <MenuItem key={paper.id} value={paper.id}>
                  {paper.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Find Paths Button */}
        <Grid item xs={12} sm={3}>
          <Button
            variant="contained"
            align="center"
            color="secondary"
            onClick={handleFindPaths}
            fullWidth
          >
            Find Paths
          </Button>
        </Grid>
      </Grid>

      {/* Loading Indicator */}
      {loading && (
        <Grid container justifyContent="center" sx={{ mt: 2 }}>
          <CircularProgress />
        </Grid>
      )}

      {/* PathGraph Component */}
      {paths && !loading && (
        <PathGraph
          paths={paths}
          isPathFinder={true} // Pass a prop to differentiate if needed
        />
      )}
    </Box>
  );
}

export default PathFinder;