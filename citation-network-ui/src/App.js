import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container, Typography, Box } from '@mui/material';
import CitationNetwork from './components/CitationNetwork';
import PathFinder from './components/PathFinder'; // Import the new PathFinder component
import SignUp from './components/SignUp';
import Login from './components/Login';
import ReadingList from './components/ReadingList';
import Header from './components/Header';
import Footer from './components/Footer';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Box display="flex" flexDirection="column" minHeight="100vh">
          <Header />
          <Container component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
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
            </Routes>
          </Container>
          <Footer />
        </Box>
      </Router>
    </AuthProvider>
  );
}

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

export default App;