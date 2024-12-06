import React, { useState, useEffect } from 'react';
import { Button, TextField,Table, TableContainer, TableCell, TableHead, TableRow, Paper, TableBody, Container } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './App.css'; 
import Login from './Login';
import posthog from 'posthog-js'

const theme = createTheme({
  palette: {
    primary: { main: '#90caf9' },
    secondary: { main: '#f50057' },
    background: { default: '#42a5f5' },
  },
  typography: {
    fontSize: 12,
    fontFamily: 'sans-serif',
    h1: {color: '#f44336'},
  },
});

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [time, setTime] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [loggedInUser, setLoggedInUser] = useState('');

  useEffect(()=>{
    posthog.init(
      'phc_YGT2EnmKDc5ZAl2x3R9oIpXeQ564MXaPir2JNm0C4ve',
      {
        api_host:'https://us.i.posthog.com'
      }
    );
  },[]);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || {};
    if (loggedInUser && savedTasks[loggedInUser]) {
      setTasks(savedTasks[loggedInUser]);
    }
  }, [loggedInUser]);

  useEffect(() => {
    if (loggedInUser) {
      const savedTasks = JSON.parse(localStorage.getItem('tasks')) || {};
      savedTasks[loggedInUser] = tasks;
      localStorage.setItem('tasks', JSON.stringify(savedTasks));
    }
  }, [tasks,loggedInUser]);

  useEffect(()=>{
    if(loggedInUser){
      posthog.capture(
        'Page_viewed',{
          user:loggedInUser,
          page:'App'
        }
      )
    }
    else{
      posthog.capture(
        'Page_viewed',{
          user:loggedInUser,
          page:'Login'
        }
      );
    }
  });

  const handleLogin = (username) => {
    setLoggedInUser(username);
    posthog.identify(
      username,{
        name:username,
      }
    );
  };

  const handleLogout = () => {
    setLoggedInUser('');
    setTasks([]);
  };

  const addTask = () => {
    if (newTask.trim() === '' ||  time === '') return;
    setTasks([...tasks, { name: newTask.trim(),time }]);
    setNewTask('');
    setTime('');
  };

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const startEditing = (index) => {
    setEditingIndex(index);
    setEditingText(tasks[index].name);
  };

  const saveTask = (index) => {
    if (editingText.trim() === '') return;
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, name: editingText.trim() } : task
    );
    setTasks(updatedTasks);
    setEditingIndex(null);
    setEditingText('');
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="xl" style={{ backgroundColor: theme.palette.background.default, padding: '20px' }}>
        {!loggedInUser ? (
          <Login onLogin={handleLogin} />
        ) : (
          <div>
            <h2>Welcome, {loggedInUser}</h2>
            <Button onClick={handleLogout} variant="contained" color="secondary" style={{ marginBottom: '20px' }}>
              Logout
            </Button>

            <div style={{ margin: '20px', display: 'flex', flexDirection: 'column' }}>
              <TextField
                label="Text"
                variant="outlined"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                style={{ marginBottom: '20px' }}
              />
              <TextField
              label="Time"
              variant="outlined"
              value={time}
              onChange={(e)=>setTime(e.target.value)}
              style={{marginBottom:'20px'}}
              />
              
              <Button onClick={addTask} variant="contained" color="primary" style={{ marginBottom: '20px', textAlign: 'center', display: 'block', margin: 'auto' }}>
                Add Task
              </Button>
            </div>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Task name</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tasks.map((task, index) => (
                    <TableRow key={index}>
                      {editingIndex === index ? (
                        <>
                          <TableCell>
                            <TextField
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              fullWidth
                            />
                          </TableCell>
                          <TableCell colSpan={2}></TableCell>
                          <TableCell>
                            <Button onClick={() => saveTask(index)} variant="contained" color="secondary">Save</Button>
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell>{task.name}</TableCell>
                          <TableCell>{task.time}</TableCell>
                          <TableCell>
                            <Button onClick={() => startEditing(index)} variant="contained" color="secondary">Edit</Button>
                            <Button onClick={() => deleteTask(index)} variant="contained" color="secondary">Delete</Button>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default App;