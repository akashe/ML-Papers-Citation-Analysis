// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light', // or 'dark' for dark mode
    primary: {
      main: '#1976d2', // Adjust primary color
    },
    secondary: {
      main: '#ff4081', // Adjust secondary color
    },
    background: {
      default: '#f4f6f8', // Light background
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  components: {
    // Customize component styles
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Rounded corners
          textTransform: 'none', // Disable uppercase transformation
        },
      },
    },
  },
});

export default theme;
