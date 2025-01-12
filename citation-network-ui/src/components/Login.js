import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Container, TextField, Button, Alert, Typography, Box, Link as MuiLink, Grid, Paper, InputAdornment, IconButton  } from '@mui/material';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import ExplainerComponent from './Introduction';
import LoginForm from './LoginForm';
import { useAnonymous } from '../contexts/AnonymousContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message || '';
  const exceeded = location.state?.exceeded;
  const { graphCount } = useAnonymous();

  const showLoginForm = exceeded || graphCount >= 3;

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

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  // return (
  //   <Container maxWidth="xl" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f5f5f5' }}>
  //     <Grid container sx={{ flex: 1, my: 4 }} spacing={3} alignItems="center">
  //       {/* Left side - Welcome message */}
  //       <Grid item xs={12} md={6}>
  //         <Paper
  //           elevation={3}
  //           sx={{
  //             height: '100%',
  //             p: 4,
  //             display: 'flex',
  //             flexDirection: 'column',
  //             alignItems: 'center',
  //             justifyContent: 'center',
  //             backgroundColor: 'white',
  //             borderRadius: 2,
  //           }}
  //         >
  //           <Box sx={{ textAlign: 'center', mb: 3 }}>
  //             <img
  //               src="/background1.jpg"
  //               alt="Citation Network Explorer"
  //               style={{ maxWidth: '200px', height: 'auto', marginBottom: '1rem' }}
  //             />
  //             <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
  //               Citation Network Explorer
  //             </Typography>
  //              <Typography variant="body1" color="text.secondary" sx={{ mt: 2, mb: 2 }}>
  //               Discover, organize, and visualize academic connections.
  //             </Typography>
  //             <Box sx={{ textAlign: 'left', mt: 2 }}>
  //               <Typography variant="h6" color="primary" gutterBottom>
  //                 Key Features:
  //               </Typography>
  //               <ul style={{ paddingLeft: '20px' }}>
  //                 <li>
  //                   <Typography variant="body2" color="text.secondary">
  //                     <strong>Visualize Citation Trees:</strong> Explore how ideas develop over time with BFS trees up to 10 levels deep.
  //                   </Typography>
  //                 </li>
  //                 <li>
  //                   <Typography variant="body2" color="text.secondary">
  //                     <strong>Create Reading Lists:</strong> Save papers of interest to your personalized reading list for easy access.
  //                   </Typography>
  //                 </li>
  //                 <li>
  //                   <Typography variant="body2" color="text.secondary">
  //                     <strong>Quick Insights:</strong> Each node provides a TLDR of the paper, giving you a snapshot of its content.
  //                   </Typography>
  //                 </li>
  //                 <li>
  //                   <Typography variant="body2" color="text.secondary">
  //                     <strong>Trace Idea Paths:</strong> Find connections between two papers to see how ideas have converged over time.
  //                   </Typography>
  //                 </li>
  //               </ul>
  //               <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
  //                 Start exploring and uncover the scholarly connections that shape the field!
  //               </Typography>
  //             </Box>
  //           </Box>
  //           {/* Add more features or benefits here */}
  //         </Paper>
  //       </Grid>

  //       {/* Right side - Login Form */}
  //       <Grid item xs={12} md={6}>
  //         <Box
  //           component="form"
  //           onSubmit={handleLogin}
  //           sx={{
  //             maxWidth: 400,
  //             mx: 'auto',
  //             p: 4,
  //             boxShadow: 3,
  //             borderRadius: 2,
  //             backgroundColor: '#fff',
  //           }}
  //         >
  //           <Typography variant="h5" align="center" gutterBottom fontWeight="medium">
  //             Log in to your account
  //           </Typography>
  //           {message && <Alert severity="info" sx={{ mb: 2 }}>{message}</Alert>}
  //           {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
  //           <TextField
  //             label="Email"
  //             type="email"
  //             value={email}
  //             onChange={(e) => setEmail(e.target.value)}
  //             required
  //             fullWidth
  //             margin="normal"
  //             variant="outlined"
  //           />
  //           <TextField
  //             label="Password"
  //             type={showPassword ? 'text' : 'password'}
  //             value={password}
  //             onChange={(e) => setPassword(e.target.value)}
  //             required
  //             fullWidth
  //             margin="normal"
  //             variant="outlined"
  //             InputProps={{
  //               endAdornment: (
  //                 <InputAdornment position="end">
  //                   <IconButton onClick={handleClickShowPassword} edge="end">
  //                     {showPassword ? <VisibilityOff /> : <Visibility />}
  //                   </IconButton>
  //                 </InputAdornment>
  //               ),
  //             }}
  //           />
  //           <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3, mb: 2, py: 1.5 }}>
  //             Log In
  //           </Button>
  //           <Typography variant="body2" align="center" sx={{ mt: 2 }}>
  //             Don't have an account?{' '}
  //             <MuiLink component={Link} to="/signup" color="primary">
  //               Sign Up
  //             </MuiLink>
  //           </Typography>
  //         </Box>
  //       </Grid>
  //     </Grid>
  //   </Container>
  // );


  return (
    <Grid container component="main" 
      sx={{ 
        minHeight: { xs: 'calc(100vh - 112px)', md: 'calc(100vh - 128px)' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: { xs: 1, md: 2 } // Stack vertically on mobile
      }}>
      <Grid
        item
        xs={12}
        md={9}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: { xs: '25vh', sm: '50vh', md: '100%' }, // Reduced height on mobile from 40vh to 35vh
          position: 'relative',
          overflow: 'hidden',
          padding: { xs: '0', sm: '1rem', md: '2rem' },
        }}
      >
        <ExplainerComponent/>
      </Grid>
      <Grid
        item
        xs={12}
        md={3}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, md: 4 }, // Add padding on mobile
          width: '100%' // Ensure full width on mobile
        }}
      >
        {showLoginForm ? (
        <Box 
          component="form"
          onSubmit={handleLogin}
          sx={{ 
            width: '100%',
            maxWidth: { xs: '100%', sm: 300 },
            p: { xs: 2, md: 4 }
          }}
        >
          <Typography 
            variant="h5" 
            align="center" 
            gutterBottom 
            fontWeight="medium"
            sx={{
              fontFamily: '"Open Sans", sans-serif',
              fontSize: "25px",
              fontWeight: "500",
              textAlign: "center",
              color: "rgb(77, 47, 47)",
            }}
          >
            Log in to your account
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
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                backgroundColor: 'rgba(187, 187, 187, 0.15)',
              },
              '& .MuiInputLabel-root': {
                fontFamily: '"Inter", sans-serif',
                fontSize: "12px",
                fontWeight: "500",
                color: "rgb(136, 136, 136)",
              },
              '& .MuiOutlinedInput-input': {
                fontFamily: '"Inter", sans-serif',
                fontSize: "14px",
                fontWeight: "500",
                color: "rgb(77, 47, 47)",
              }
            }}
          />
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            margin="normal"
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                backgroundColor: 'rgba(187, 187, 187, 0.15)',
              },
              '& .MuiInputLabel-root': {
                fontFamily: '"Inter", sans-serif',
                fontSize: "12px",
                fontWeight: "500",
                color: "rgb(136, 136, 136)",
              },
              '& .MuiOutlinedInput-input': {
                fontFamily: '"Inter", sans-serif',
                fontSize: "14px",
                fontWeight: "500",
                color: "rgb(77, 47, 47)",
              }
            }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3, mb: 2, py: 1.5 }}>
            Log In
          </Button>
          <Typography 
            variant="body2" 
            align="center" 
            sx={{ 
              mt: 2,
              fontFamily: '"Inter", sans-serif',
              fontSize: "14px",
              fontWeight: "500",
              textAlign: "center",
              color: "rgb(77, 47, 47)",
            }}
          >
            Don't have an account?{' '}
            <MuiLink component={Link} to="/signup" color="primary">
              Sign Up
            </MuiLink>
          </Typography>
        </Box>
        ) : (
          <Box
            sx={{ 
              width: '100%',
              maxWidth: { xs: '100%', sm: 300 },
              p: { xs: 2, md: 4 },
              textAlign: 'center'
            }}
          >
            <Typography 
              variant="h5" 
              gutterBottom
              sx={{
                fontFamily: '"Open Sans", sans-serif',
                fontSize: "25px",
                fontWeight: "500",
                color: "rgb(77, 47, 47)",
                mb: 3
              }}
            >
              Ready to dive in?
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              component={Link}
              to="/"
              state={{ fromExploreButton: true }} 
              sx={{ 
                py: 1.5,
                px: 4,
                borderRadius: '10px',
                textTransform: 'none',
                fontSize: '16px',
                fontWeight: '500',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)'
              }}
            >
              Let's Start Exploring
            </Button>
          </Box>
        )}
      </Grid>
    </Grid>
  );
}

export default Login;