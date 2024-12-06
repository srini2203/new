import React, { useState, useEffect } from 'react';
import {Button,TextField,Select,MenuItem,Table,TableContainer,TableCell,TableHead,TableRow,Paper,TableBody,Container,Typography,} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './App.css';
import posthog from 'posthog-js';

const theme = createTheme({
  palette: {
    primary: { main: '#90caf9' },
    secondary: { main: '#f50057' },
    background: { default: '#42a5f5' },
  },
  typography: {
    fontSize: 12,
    fontFamily: 'Roboto, sans-serif',
    h1: { color: '#f44336' },
  },
});

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [time, setTime] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    posthog.init('phc_YGT2EnmKDc5ZAl2x3R9oIpXeQ564MXaPir2JNm0C4ve', {
      api_host: 'https://us.i.posthog.com',
      debug: 'true',
    });
  }, []);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (savedTasks) {
      setTasks(savedTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const user = localStorage.getItem('loggedInUser');
    if (user) setLoggedInUser(user);
  }, []);

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem('users')) || {};
    if (users[username] && users[username] === password) {
      localStorage.setItem('loggedInUser', username);
      setLoggedInUser(username);
    } else {
      setError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    setLoggedInUser('');
  };

  const addTask = () => {
    if (newTask.trim() === '' || assignedTo === '' || time === '') return;

    setTasks([...tasks, { name: newTask.trim(), assignedTo, time }]);

    setNewTask('');
    setAssignedTo('');
    setTime('');

    posthog.capture('add_task', {
      task_name: 'NewTask',
      taskAssignedTo: 'assignedTo',
      tasktime: 'time',
    });
  };

  const deleteTask = (index) => {
    const taskToDelete = tasks[index];
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);

    posthog.capture('task_deleted', {
      task_name: taskToDelete.name,
      taskAssignedTo: taskToDelete.assignedTo,
      task_time: taskToDelete.time,
    });
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

  if (!loggedInUser) {
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth="sm" style={{ marginTop: '100px', textAlign: 'center' }}>
          <Typography variant="h4" style={{ marginBottom: '20px' }}>
            Login
          </Typography>
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
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="xl" style={{ backgroundColor: theme.palette.background.default, padding: '20px' }}>
        <Typography variant="h6" style={{ marginBottom: '20px' }}>
          Welcome, {loggedInUser}!
        </Typography>
        <Button variant="contained" color="secondary" onClick={handleLogout} style={{ marginBottom: '20px' }}>
          Logout
        </Button>

        <h1 style={{ textAlign: 'center' }}>Task Manager</h1>
        <div style={{ margin: '20px', display: 'flex', flexDirection: 'column' }}>
          <TextField
            label="Text"
            variant="outlined"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            style={{ marginBottom: '20px' }}
          />
          <Select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            displayEmpty
            fullWidth
            style={{ marginBottom: '20px' }}
          >
            <MenuItem value="">Assign To</MenuItem>
            <MenuItem value="Sakthi">Sakthi</MenuItem>
            <MenuItem value="Parasu">Parasu</MenuItem>
            <MenuItem value="Srini">Srini</MenuItem>
          </Select>
          <TextField
            type="time"
            value={time}
            variant="outlined"
            onChange={(e) => setTime(e.target.value)}
            style={{ marginBottom: '20px' }}
            fullWidth
          />
          <Button
            onClick={addTask}
            variant="contained"
            color="primary"
            style={{
              marginBottom: '20px',
              maxWidth: '10px',
              textAlign: 'center',
              display: 'block',
              margin: 'auto',
            }}
          >
            Add Task
          </Button>
        </div>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Task name</TableCell>
                <TableCell>Assigned to</TableCell>
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
                        <button onClick={() => saveTask(index)}>Save</button>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>{task.name}</TableCell>
                      <TableCell>Assigned to: {task.assignedTo}</TableCell>
                      <TableCell>Time: {task.time}</TableCell>
                      <TableCell>
                        <button onClick={() => startEditing(index)}>Edit</button>
                        <button onClick={() => deleteTask(index)}>Delete</button>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </ThemeProvider>
  );
};

export default App;