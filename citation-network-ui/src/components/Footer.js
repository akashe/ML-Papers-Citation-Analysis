import React from 'react';
import { Box, Typography } from '@mui/material';

function Footer() {
  return (
    <Box component="footer" sx={{ p: 2, mt: 'auto', backgroundColor: '#f5f5f5' }}>
      <Typography variant="body2" color="text.secondary" align="center">
        © {new Date().getFullYear()} Citation Network Explorer. All rights reserved.
      </Typography>
    </Box>
  );
}

export default Footer;