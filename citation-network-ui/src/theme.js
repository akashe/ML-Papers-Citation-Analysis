import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#424242', // Changed to a darker gray for a more subdued look
    },
    secondary: {
      main: '#ff5722', // Changed to a vibrant orange for contrast
    },
    background: {
      default: '#f5f5f5', // Light grey background
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

export default theme;