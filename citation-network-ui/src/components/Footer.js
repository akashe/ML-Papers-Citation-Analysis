import React from 'react';
import { Box, Typography } from '@mui/material';

function Footer() {
  return (
    <Box component="footer" sx={{ p: 2, backgroundColor: 'background.default' }}>
      <Typography variant="body2" color="text.secondary" align="center">
        © {new Date().getFullYear()} Citation Network Explorer. All rights reserved.
      </Typography>
    </Box>
  );
}

export default Footer;