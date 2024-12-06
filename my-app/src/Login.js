import React from 'react';
import {useState,useEffect} from 'react';
import {Button,TextField,ThemeProvider,createTheme} from '@mui/material';

const theme=createTheme({
    palette:{
        primary:'#b2a429',
        secondary:'##00bcd4',
    },
});

const Login=(onLogin)=>{
    const [username,setUsername]=useState('');
    const [password,setPassword]=useState('');
    const [error,setError]=useState('');

    const handleLogin=()=>{
        useEffect(()=>{
            const users=localStorage.getItem(JSON.parse(users)) || {}
            if (users[username]&& users[username]===password){
                localStorage.setItem('loggedInUser',username);
                onLogin(username);
            }
            else
            {
                setError('Invalid username and password',error);
            }
        });
    };
    return(
        <ThemeProvider theme={theme}>
        <Container maxwidth='xl' backgroundColor='green'>
            <h1>LOGIN PAGE</h1>
            <div style={{marginBottom:'20px'}}>
                <TextField
                label="Enter username"
                variant={outlined}
                value={username}
                onChange={(e)=> setUsername(e.target.value)}
                style={{marginBottom:'20px'}}
                />
                <TextField
                label="Enter your password"
                variant={outlined}
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                style={{marginBottom:'20px'}}
                />
                <Button 
                variant={contained}
                onClick={handleLogin}
                style={{display:'block',margin:'auto',marginBottom:'20px'}}
                >LOGIN</Button>
            </div>
        </Container>
        </ThemeProvider>

    );
};

export default Login;



