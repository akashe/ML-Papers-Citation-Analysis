// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#004d61', // Midnight teal
    },
    secondary: {
      main: '#ff6b6b', // Coral
    },
    background: {
      default: '#f0f4f8', // Light ash gray
    },
    text: {
      primary: '#333333', // Dark gray for text
      secondary: '#575757', // Medium gray for secondary text
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          color: '#FFFFFF', // Button text in white
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          color: '#333333',
          boxShadow: 'none',
        },
      },
    },
  },
});

export default theme;
