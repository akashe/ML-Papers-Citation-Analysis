  // src/App.js
  import React from 'react';
  import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
  import { Container, Typography } from '@mui/material';
  import CitationNetwork from './components/CitationNetwork';
  import SignUp from './components/SignUp';
  import Login from './components/Login';
  import ReadingList from './components/ReadingList';
  import { AuthProvider, useAuth } from './contexts/AuthContext';

  function App() {
    return (
      <AuthProvider>
        <Router>
          <Container maxWidth="lg">
            <Typography variant="h4" align="center" gutterBottom>
              Citation Network Explorer
            </Typography>
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
                path="/" 
                element={
                  <PrivateRoute>
                    <CitationNetwork />
                  </PrivateRoute>
                } 
              />
            </Routes>
          </Container>
        </Router>
      </AuthProvider>
    );
  }

  function PrivateRoute({ children }) {
    const { currentUser } = useAuth();
    return currentUser ? children : <Navigate to="/login" />;
  }

  export default App;