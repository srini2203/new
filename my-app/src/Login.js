import React, { useState } from 'react';
import { Button, TextField, Container } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import posthog from 'posthog-js'

const theme = createTheme({
  palette: {
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontSize: 12,
    fontFamily: 'Roboto, sans-serif',
    h1: {
      color: '#f44336',
    },
  },
});

const Login = ({onLogin}) => {
  const [username, setUserName] = useState('');

  const validUsers = {
    srini:'01',
    sakthi:'02',
    parasu:'03',
  };

  const handleLogin = () => {
    const trimmedUsername = username.trim();
    if (validUsers[trimmedUsername]) {
      const user = {
        username: trimmedUsername,
        id: validUsers[trimmedUsername],
      };
      localStorage.setItem('loggedInUser', JSON.stringify(user)); 
      onLogin(user);
      posthog.identify(user.id,{
        username:user.username,
      });
    } else {
      alert('Invalid username. Please try again.');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm" style={{ marginTop:'50px',textAlign:'center' }}>
        <h1>Login</h1>
        <TextField
          label="Enter your username"
          variant="outlined"
          value={username}
          onChange={(e) => setUserName(e.target.value)}
          fullWidth
          style={{ marginBottom:'20px' }}
        />
        <Button
          onClick={handleLogin}
          variant="contained"
          color="primary"
          style={{ textAlign:'center', margin:'auto' }}
        >
          Login
        </Button>
      </Container>
    </ThemeProvider>
  );
};

export default Login