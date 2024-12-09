import React, {useState,useEffect } from 'react';
import { Button,TextField,Table,TableContainer,TableCell,TableHead,TableRow,Paper,TableBody,Container } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './App.css';
import posthog from 'posthog-js';
import Login from './Login';

const theme = createTheme({
  palette: {
    primary: {
      main:'#90caf9',
    },
    secondary: {
      main:'#f50057',
    },
    background: {
      default:'#42a5f5',
    },
  },
  typography: {
    fontSize: 12,
    fontFamily:'Roboto,sans-serif',
    h1: {
      color:'#f44336',
    },
  },
});

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(localStorage.getItem('loggedInUser') || null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    posthog.init('phc_YGT2EnmKDc5ZAl2x3R9oIpXeQ564MXaPir2JNm0C4ve', {
      api_host:'https://us.i.posthog.com',
      debug:'true',
    });
  }, []);

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

    const newTaskObject = { name: newTask.trim(), user: loggedInUser, time };
    setTasks([...tasks, newTaskObject]);
    setNewTask('');
    setTime('');

    posthog.capture('add_task', {
      task_name: newTask.trim(),
      assigned_user: loggedInUser,
      task_time: time,
    });
  };

  const deleteTask = (index) => {
    const taskToDelete = tasks[index];
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);

    posthog.capture('task_deleted', {
      task_name: taskToDelete.name,
      assigned_user: taskToDelete.user,
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

  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem('loggedInUser'); 
  };

  return (
    <ThemeProvider theme={theme}>
      {!loggedInUser ? (
        <Login onLogin={(user) => {
          setLoggedInUser(user);
          localStorage.setItem('loggedInUser', user); 
        }} />
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
              style={{ marginBottom:'40px', maxWidth:'10px', textAlign:'center', display:'block', margin:'auto' }}
            >
              Add Task
            </Button>
            <Button
              onClick={handleLogout}
              color="secondary"
              variant="contained"
              style={{ marginBottom:'20px', display:'block', margin:'auto', textAlign:'center' }}
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
                  .map((task, index) => (
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
                          <TableCell>
                            <Button onClick={() => saveTask(index)} variant="contained" color="secondary">
                              Save
                            </Button>
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell>{task.name}</TableCell>
                          <TableCell>{task.time}</TableCell>
                          <TableCell>
                            <Button onClick={() => startEditing(index)} variant="contained" color="secondary">
                              Edit
                            </Button>
                            <Button onClick={() => deleteTask(index)} variant="contained" color="secondary">
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
