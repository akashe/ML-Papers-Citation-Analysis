import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

import CitationNetwork from './components/CitationNetwork';
import PathFinder from './components/PathFinder'; // Import the new PathFinder component
import SignUp from './components/SignUp';
import Login from './components/Login';
import ReadingList from './components/ReadingList';
import Header from './components/Header';
import Footer from './components/Footer';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function App() {
  console.log('App rendering, current path:', window.location.pathname);
  
  return (
    <ThemeProvider theme={theme}>
    <AuthProvider>
      <Router>
        <Box display="flex" flexDirection="column" minHeight="100vh">
          <Header />
          <Box component="main" flexGrow={1} p={2}>
            <Routes>
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route 
                path="/reading-list" 
                element={
                  <PrivateRoute>
                    <ReadingList />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/path-finder" 
                element={
                  <PrivateRoute>
                    <PathFinder />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/" 
                element={
                  <PrivateRoute>
                    <CitationNetwork />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="*" 
                element={
                  <div>
                    <h1>404 - Not Found</h1>
                    <p>Current Path: {window.location.pathname}</p>
                  </div>
                } 
              />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </Router>
    </AuthProvider>
    </ThemeProvider>
  );
}

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  console.log('PrivateRoute check:', {
    path: window.location.pathname,
    hasCurrentUser: !!currentUser
  });
  return currentUser ? children : <Navigate to="/login" />;
}

export default App;