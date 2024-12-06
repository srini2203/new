Login.js

import React, { useState } from 'react';
import { Button, TextField, Container, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#90caf9' },
    secondary: { main: '#f50057' },
  },
});

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem('users')) || {};
    if (users[username] && users[username] === password) {
      localStorage.setItem('loggedInUser', username);
      onLogin(username);
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm" style={{ marginTop: '100px', textAlign: 'center' }}>
        <Typography variant="h4" style={{ marginBottom: '20px' }}>Login</Typography>
        {error && <Typography color="error">{error}</Typography>}
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          style={{ marginBottom: '20px' }}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          style={{ marginBottom: '20px' }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
          Login
        </Button>
      </Container>
    </ThemeProvider>
  );
};

export default Login;