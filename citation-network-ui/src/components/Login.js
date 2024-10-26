import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import {
  TextField,
  Button,
  Alert,
  Typography,
  Box,
  Link as MuiLink,
  Paper,
} from '@mui/material';
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
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
          bgcolor="background.default"
          component="form"
          onSubmit={handleLogin}
        >
          <Paper elevation={3} sx={{ p: 4, maxWidth: 400 }}>
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
          </Paper>
        </Box>
  );
}

export default Login;