import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

function Header() {
  const { currentUser } = useAuth();
  const location = useLocation(); // Hook to get current path

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const renderAuthButtons = () => {
    if (currentUser) {
      if (location.pathname === '/') {
        return (
          <>
            <Button color="inherit" component={Link} to="/reading-list">
              Reading List
            </Button>
            <Button color="inherit" component={Link} to="/path-finder">
              Path Between 2 Papers
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        );
      } else if (location.pathname === '/reading-list' || location.pathname === '/path-finder') {
        return (
          <>
            <Button color="inherit" component={Link} to="/">
              Home
            </Button>
            <Button color="inherit" component={Link} to="/reading-list">
              Reading List
            </Button>
            <Button color="inherit" component={Link} to="/path-finder">
              Path Between 2 Papers
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        );
      }
    } else {
      if (location.pathname === '/login') {
        return (
          <Button color="inherit" component={Link} to="/signup">
            Sign Up
          </Button>
        );
      } else if (location.pathname === '/signup') {
        return (
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
        );
      }
    }
    return null;
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Citation Network Explorer
        </Typography>
        {renderAuthButtons()}
      </Toolbar>
    </AppBar>
  );
}

export default Header;