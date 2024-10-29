import React from 'react';
import { Box, Typography } from '@mui/material';

function Footer() {
  return (
    <Box 
      component="footer" 
      sx={{ 
        p: { xs: 1.5, sm: 2 }, // Smaller padding on mobile
        backgroundColor: 'background.default',
        mt: 'auto' // Push footer to bottom
      }}
    >
      <Typography 
        variant="body2" 
        color="text.secondary" 
        align="center"
        sx={{
          fontSize: { xs: '0.75rem', sm: '0.875rem' } // Smaller font on mobile
        }}
      >
        © {new Date().getFullYear()} Citation Network Explorer
      </Typography>
    </Box>
  );
}

export default Footer;