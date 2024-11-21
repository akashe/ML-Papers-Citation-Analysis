import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';

function Footer() {
  return (
    <Box 
      component="footer" 
      sx={{ 
        p: { xs: 1.5, sm: 2 },
        backgroundColor: 'background.default',
        mt: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1
      }}
    >
      <Link
        href="https://buymeacoffee.com/akashe" // Replace with your Buy Me a Coffee username
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          color: 'text.secondary',
          textDecoration: 'none',
          '&:hover': {
            color: 'primary.main'
          }
        }}
      >
        <LocalCafeIcon sx={{ fontSize: '1rem' }} />
        <Typography
          variant="body2"
          sx={{
            fontSize: { xs: '0.75rem', sm: '0.875rem' }
          }}
        >
          Buy me a coffee
        </Typography>
      </Link>
      <Typography 
        variant="body2" 
        color="text.secondary" 
        align="center"
        sx={{
          fontSize: { xs: '0.75rem', sm: '0.875rem' }
        }}
      >
        © {new Date().getFullYear()} Citation Network Explorer
      </Typography>
    </Box>
  );
}

export default Footer;