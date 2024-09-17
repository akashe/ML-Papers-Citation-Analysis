import React from 'react';
import { Container, Typography } from '@mui/material';
import CitationNetwork from './components/CitationNetwork';

function App() {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" align="center" gutterBottom>
        Citation Network Explorer
      </Typography>
      <CitationNetwork />
    </Container>
  );
}

export default App;
