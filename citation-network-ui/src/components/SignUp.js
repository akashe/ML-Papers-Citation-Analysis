import React, { useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  sendEmailVerification 
} from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { TextField, Button, Alert, Box, Typography, Link as MuiLink } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name,
        email,
        readingList: []
      });
      navigate('/login', { state: { message: 'Please verify your email before logging in.' } });
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSignUp}
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
        Sign Up
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        fullWidth
        margin="normal"
      />
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
        Sign Up
      </Button>
      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        Already have an account?{' '}
        <MuiLink component={Link} to="/login">
          Login
        </MuiLink>
      </Typography>
    </Box>
  );
}

export default SignUp;