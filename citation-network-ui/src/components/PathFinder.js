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
import PathGraph from './PathGraph'; // Import the new PathGraph component
import { Autocomplete } from '@mui/material';
import debounce from 'lodash/debounce';

function PathFinder() {
  const [searchQuery1, setSearchQuery1] = useState('');
  const [searchQuery2, setSearchQuery2] = useState('');
  const [paperOptions1, setPaperOptions1] = useState([]);
  const [paperOptions2, setPaperOptions2] = useState([]);
  const [selectedPaper1, setSelectedPaper1] = useState(null);
  const [selectedPaper2, setSelectedPaper2] = useState(null);
  const [searchLoading1, setSearchLoading1] = useState(false);
  const [searchLoading2, setSearchLoading2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paths, setPaths] = useState(null);

  const debouncedSearch1 = React.useCallback(
    debounce(async (query) => {
      if (!query || query.length < 3) return;
      setSearchLoading1(true);
      try {
        const response = await axios.post('/search_papers/', { query });
        setPaperOptions1(response.data);
      } catch (error) {
        console.error('Error searching papers:', error);
      } finally {
        setSearchLoading1(false);
      }
    }, 800),
    []
  );

  const debouncedSearch2 = React.useCallback(
    debounce(async (query) => {
      if (!query || query.length < 3) return;
      setSearchLoading2(true);
      try {
        const response = await axios.post('/search_papers/', { query });
        setPaperOptions2(response.data);
      } catch (error) {
        console.error('Error searching papers:', error);
      } finally {
        setSearchLoading2(false);
      }
    }, 800),
    []
  );

  React.useEffect(() => {
    return () => {
      debouncedSearch1.cancel();
      debouncedSearch2.cancel();
    };
  }, [debouncedSearch1, debouncedSearch2]);
  

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
        Generate Path Between papers
      </Typography>
      <Grid container spacing={2} alignItems="center">
        {/* First Paper Search and Selection */}
        <Grid item xs={12} sm={6}>
          <Autocomplete
            fullWidth
            options={paperOptions1}
            getOptionLabel={(option) => option.label || ''}
            loading={searchLoading1}
            onInputChange={(_, newInputValue) => {
              setSearchQuery1(newInputValue);
              if (newInputValue.length >= 3) {
                debouncedSearch1(newInputValue);
              } else {
                setPaperOptions1([]);
              }
            }}
            onChange={(_, newValue) => {
              setSelectedPaper1(newValue ? newValue.id : null);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search for the first paper"
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {searchLoading1 ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Grid>

        {/* Second Paper Search and Selection */}
        <Grid item xs={12} sm={6}>
          <Autocomplete
            fullWidth
            options={paperOptions2}
            getOptionLabel={(option) => option.label || ''}
            loading={searchLoading2}
            onInputChange={(_, newInputValue) => {
              setSearchQuery2(newInputValue);
              if (newInputValue.length >= 3) {
                debouncedSearch2(newInputValue);
              } else {
                setPaperOptions2([]);
              }
            }}
            onChange={(_, newValue) => {
              setSelectedPaper2(newValue ? newValue.id : null);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search for the second paper"
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {searchLoading2 ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Grid>
        {/* Find Paths Button */}
        <Grid 
          item 
          xs={12} 
          sm={3} 
          container 
          justifyContent="center"
          sx={{ mx: 'auto' }}  // Add horizontal margin auto
        >
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleFindPaths}
              sx={{ minWidth: '200px' }}  // Optional: set a minimum width
            >
              Find Paths
            </Button>
          </Box>
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