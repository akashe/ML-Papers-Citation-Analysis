import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import GitHubIcon from '@mui/icons-material/GitHub';

function Header() {
  const { currentUser } = useAuth();
  const location = useLocation(); // Hook to get current path
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login'); // Add this line to redirect to login after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const renderAuthButtons = () => {
    const buttons = currentUser ? [
      { label: 'Home', path: '/' },
      { label: 'Reading List', path: '/reading-list' },
      { label: 'Path Between 2 Papers', path: '/path-finder' },
      { label: 'Logout', onClick: handleLogout }
    ] : [
      location.pathname === '/login' 
        ? { label: 'Sign Up', path: '/signup' }
        : { label: 'Login', path: '/login' }
    ];

    if (isMobile) {
      return (
        <>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            {buttons.map((button) => (
              <MenuItem
                key={button.label}
                onClick={() => {
                  handleMenuClose();
                  if (button.onClick) button.onClick();
                }}
                component={button.path ? Link : 'button'}
                to={button.path}
              >
                {button.label}
              </MenuItem>
            ))}
          </Menu>
        </>
      );
    }

    return buttons.map((button) => (
      <Button
        key={button.label}
        sx={{ 
          color: '#333333',
          backgroundColor: location.pathname === button.path ? '#e0e0e0' : 'transparent'
        }}
        component={button.path ? Link : 'button'}
        to={button.path}
        onClick={button.onClick}
      >
        {button.label}
      </Button>
    ));
  };

  return (
    <AppBar position="static" elevation={1} sx={{ padding: 0 }}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
        >
          PaperVerse
        </Typography>
        {location.pathname !== '/' && (
          <IconButton
            href="https://github.com/akashe/ML-Papers-Citation-Analysis"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ mr: 2, color: '#333333' }}
          >
            <GitHubIcon />
          </IconButton>
        )}
        {renderAuthButtons()}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
