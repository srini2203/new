import React, { useState } from 'react';
import { Button, TextField, Container } from '@mui/material';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem('users')) || {};

    if (users[username] && users[username] === password) {
      setError('');
      onLogin(username); 
    } else {
      setError('Invalid username or password');
    }
  };

  const handleRegister = () => {
    const users = JSON.parse(localStorage.getItem('users')) || {};

    if (username.trim() === '' || password.trim() === '') {
      setError('Username and password cannot be empty');
      return;
    }

    if (users[username]) {
      setError('User already exists');
      return;
    }

    users[username] = password;
    localStorage.setItem('users', JSON.stringify(users));

    setError('User registered successfully. Please log in.');
  };

  return (
    <Container maxWidth="xs" style={{ marginTop: '50px', textAlign: 'center' }}>
      <h2>Login</h2>
      <TextField
        label="Username"
        variant="outlined"
        fullWidth
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleLogin}
        style={{ marginTop: '10px' }}
      >
        Login
      </Button>
      <Button
        variant="contained"
        color="secondary"
        fullWidth
        onClick={handleRegister}
        style={{ marginTop: '10px' }}
      >
        Register
      </Button>
    </Container>
  );
};

export default Login;