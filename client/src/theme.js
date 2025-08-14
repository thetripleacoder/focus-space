// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb', // Tailwind blue-600
    },
    secondary: {
      main: '#10b981', // Tailwind emerald-500
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
});

export default theme;
