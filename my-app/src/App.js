import React, { useState, useEffect } from 'react';
import { Button, TextField, Table, TableContainer, TableCell, TableHead, TableRow, Paper, TableBody, Container } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './App.css';
import posthog from 'posthog-js';
import Login from './Login';

const theme = createTheme({
  palette: {
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#DCEDC8',
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

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(localStorage.getItem('loggedInUser') || null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingId, setEditingId] = useState(null); 
  const [editingText, setEditingText] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    posthog.init('phc_YGT2EnmKDc5ZAl2x3R9oIpXeQ564MXaPir2JNm0C4ve', {
      api_host: 'https://us.i.posthog.com',
      disable_session_recording: true,
    });
  }, []);

  useEffect(() => {
    if (loggedInUser) {
      
      posthog.capture('pageview', {
        page_name: 'App_page',
        user: loggedInUser,
      });
    } else {
      posthog.capture('pageview', {
        page_name: 'Login_page',
      });
    }
  }, [loggedInUser]);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (savedTasks) {
      setTasks(savedTasks);
    }
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim() === '') return;

    const newTaskObject = { 
      id: Date.now(), 
      name: newTask.trim(), 
      user: loggedInUser, 
      time 
    };
    setTasks([...tasks, newTaskObject]);
    setNewTask('');
    setTime('');

    posthog.capture('add_task', {
      task_name: newTask.trim(),
      assigned_user: loggedInUser,
      task_time: time,
    });
  };

  const startEditing = (id) => {
    setEditingId(id);
    const taskToEdit = tasks.find((task) => task.id === id);
    if (taskToEdit) {
      setEditingText(taskToEdit.name);
    }
  };

  const saveTask = () => {
    if (editingText.trim() === '') return;

    const updatedTasks = tasks.map((task) =>
      task.id === editingId ? { ...task, name: editingText.trim() }:task
    );
    setTasks(updatedTasks);
    setEditingId(null);
    setEditingText('');
  };

  const deleteTask = (id) => {
    const taskToDelete = tasks.find((task) => task.id === id);
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);

    posthog.capture('task_deleted', {
      task_name: taskToDelete.name,
      assigned_user: taskToDelete.user,
    });
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem('loggedInUser');
  };

  return (
    <ThemeProvider theme={theme}>
      {!loggedInUser ? (
        <Login
          onLogin={(user) => {
            setLoggedInUser(user);
            localStorage.setItem('loggedInUser', user);
          }}
        />
      ) : (
        <Container maxWidth="xl" style={{ backgroundColor: theme.palette.background.default, padding:'20px' }}>
          <h1 style={{ textAlign: 'center' }}>Task Manager</h1>
          <div style={{ margin:'20px', display:'flex', flexDirection:'column' }}>
            <TextField
              label="New Task"
              variant="outlined"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              style={{ marginBottom: '20px' }}
            />
            <TextField
              label="Add time"
              variant="outlined"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              style={{ marginBottom: '40px' }}
            />
            <Button
              onClick={addTask}
              variant="contained"
              color="primary"
              style={{ marginBottom: '40px', maxWidth: '10px', textAlign: 'center', display: 'block'}}
            >
              Add Task
            </Button>
            <Button
              onClick={handleLogout}
              color="secondary"
              variant="contained"
              style={{ marginBottom: '20px', display: 'block', margin: 'auto', textAlign: 'center' }}
            >
              Logout
            </Button>
          </div>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Task Name</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks
                  .filter((task) => task.user === loggedInUser)
                  .map((task) => (
                    <TableRow key={task.id}>
                      {editingId === task.id ? (
                        <>
                          <TableCell>
                            <TextField
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              fullWidth
                            />
                          </TableCell>
                          <TableCell>
                            <Button onClick={saveTask} variant="contained" color="secondary">
                              Save
                            </Button>
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell>{task.name}</TableCell>
                          <TableCell>{task.time}</TableCell>
                          <TableCell>
                            <Button onClick={() => startEditing(task.id)} variant="contained" color="secondary" style={{marginRight:'20px'}}>
                              Edit
                            </Button>
                            <Button onClick={() => deleteTask(task.id)} variant="contained" color="secondary">
                              Delete
                            </Button>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      )}
    </ThemeProvider>
  );
};

export default App;