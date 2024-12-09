import React, { useState } from 'react';
import { Button, TextField, Container } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import posthog from 'posthog-js';

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
    fontFamily: 'Roboto,sans-serif',
    h1: {
      color: '#f44336',
    },
  },
});

const validUsers = ['Srini','Parasu','Sakthi'];

const Login = ({onLogin}) => {
  const [username, setUsername] = useState('');

  const handleLogin = () => {
    if (validUsers.includes(username)) {
      onLogin(username);
      posthog.identify(username); 
      posthog.capture('user_logged_in', { username });
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
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          style={{ marginBottom: '20px' }}
        />
        <Button
          onClick={handleLogin}
          variant="contained"
          color="primary"
          style={{ textAlign: 'center', margin: 'auto' }}
        >
          Login
        </Button>
      </Container>
    </ThemeProvider>
  );
};

export default Login;