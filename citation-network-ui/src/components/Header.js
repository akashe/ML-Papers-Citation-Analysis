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
import { Link, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

function Header() {
  const { currentUser } = useAuth();
  const location = useLocation(); // Hook to get current path
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
          Citation Network Explorer
        </Typography>
        {renderAuthButtons()}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
