import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import store from './store';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </Provider>
      </Router>
    </QueryClientProvider>
  </React.StrictMode>
);
