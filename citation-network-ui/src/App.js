import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import { useAnonymous, AnonymousProvider } from './contexts/AnonymousContext';

function App() {
  console.log('App rendering, current path:', window.location.pathname);
  
  return (
    <ThemeProvider theme={theme}>
    <AuthProvider>
      <AnonymousProvider>
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
                    <InitialRoute>
                      <CitationNetwork />
                    </InitialRoute>
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
      </AnonymousProvider>
    </AuthProvider>
    </ThemeProvider>
  );
}

function InitialRoute({ children }) {
  const { currentUser } = useAuth();
  const { graphCount } = useAnonymous();
  const location = useLocation();

  // Allow access if:
  // 1. User is logged in, OR
  // 2. User has started exploring (graphCount > 0), OR
  // 3. User came from the login page (via "Let's Start Exploring" button)
  if (currentUser || graphCount > 0 || location.state?.fromExploreButton) {
    return children;
  }

  // Otherwise, redirect to login
  return <Navigate to="/login" />;
}

// Existing PrivateRoute for other protected routes
function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  const { graphCount, shouldPromptLogin } = useAnonymous();

  if (currentUser || (!shouldPromptLogin && graphCount < 3)) {
    return children;
  }
  
  return <Navigate to="/login" state={{ exceeded: true }} />;
}

export default App;