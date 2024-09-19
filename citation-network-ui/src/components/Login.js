import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { TextField, Button, Alert, Typography, Box, Link as MuiLink, Grid, Paper } from '@mui/material';
import { useNavigate, useLocation, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message || '';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential.user.emailVerified) {
        navigate('/');
      } else {
        setError('Please verify your email before logging in.');
        auth.signOut();
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Grid container sx={{ minHeight: '100vh' }}>
      <Grid item xs={12} md={6}>
        <Paper
          elevation={3}
          sx={{
            height: '100%',
            p: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
          }}
        >
          <Box>
            <Typography variant="h5" gutterBottom>
              Welcome to Citation Network Explorer!
            </Typography>
            <Typography variant="body1">
              Explore and manage your academic reading list with ease. Our platform allows you to track, organize, and discover new resources tailored to your research interests. Join our community to enhance your citation network and collaborate with peers.
            </Typography>
          </Box>
        </Paper>
      </Grid>
      {/* Login Form Section */}
      <Grid item xs={12} md={6}>
        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{
            maxWidth: 400,
            mx: 'auto',
            mt: 8,
            p: 3,
            boxShadow: 3,
            borderRadius: 2,
            backgroundColor: '#fff',
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Login
          </Typography>
          {message && <Alert severity="info" sx={{ mb: 2 }}>{message}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Don't have an account?{' '}
            <MuiLink component={Link} to="/signup">
              Sign Up
            </MuiLink>
          </Typography>
        </Box>
      </Grid>
      
      {/* Project Discussion Section */}
      
    </Grid>
  );
}

export default Login;