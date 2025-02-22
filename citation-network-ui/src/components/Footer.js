import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

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
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <Link
          href="https://buymeacoffee.com/akashe"
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

        <Link
          href="https://www.linkedin.com/in/akashkumar2/"
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
          <LinkedInIcon sx={{ fontSize: '1rem' }} />
          <Typography
            variant="body2"
            sx={{
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }}
          >
            LinkedIn
          </Typography>
        </Link>
      </Box>
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