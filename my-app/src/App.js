import React, { useState, useEffect } from 'react';
import {
  Button,TextField,Select,MenuItem,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,Container,ThemeProvider,createTheme,} from '@mui/material';
import posthog from 'posthog-js';

posthog.init('phc_YGT2EnmKDc5ZAl2x3R9oIpXeQ564MXaPir2JNm0C4ve', {
  api_host: 'https://us.i.posthog.com', 
  debug: true, 
  capture_pageview: true, 
  enable_session_recording:true,
});

const App = () => {
  const [newTask, setNewTask] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [time, setTime] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [loggedInUser,setLoggedInUser]=useState('');
  const [username,setUsername]=useState('');
  const [password,setPassword]=useState('');
  const [error,setError]=useState('');

  useEffect(()=>{
    const savedtasks=(localStorage.getItem('tasks'));
    if(savedtasks){
      setTasks(JSON.parse(savedtasks));
    }
  },[]);

  useEffect(()=>{
    localStorage.setItem('tasks',JSON.stringify(tasks));
  },[tasks]);

  useEffect(()=>{
    localStorage.getItem(JSON.parse(LoggedInUsers));
    if(users){                                                  ///////
      setLoggedInUser(user);
    }
  },[]);

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
  const handleLogout=()=>{
    useEffect(()=>{                                          //////////
      localStorage.removeItem('LoggedInUsers');
      setLoggedInUsers=''; 
    });

  }
  const theme = createTheme({
    palette: {
      primary: { main: '#1976d2' },
      secondary: { main: '#dc004e' },
    },
  });

  const addTask = () => {
    if (newTask.trim() === '' || assignedTo === '' || time === '') return;

    const task = { name: newTask.trim(), assignedTo, time };
    setTasks([...tasks, task]);

    posthog.capture('add_task', {
      taskName: task.name,
      assignedTo: task.assignedTo,
      time: task.time,
    });
    setNewTask('');
    setAssignedTo('');
    setTime('');
  };

  const deleteTask = (index) => {
    const taskToDelete = tasks[index];
    setTasks(tasks.filter((_, i) => i !== index));

    posthog.capture('delete_task', {
      taskName:taskToDelete.name,
      assignedTo:taskToDelete.assignedTo,
      time:taskToDelete.time,
    });
  };

  const startEditing = (index) => {
    setEditingIndex(index);
    setEditingText(tasks[index].name);
  };

  const saveTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].name = editingText;
    setTasks(updatedTasks);
    setEditingIndex(null);

    posthog.capture('edit_task', {
      taskName: editingText,
      previousTaskName: tasks[index].name,
      assignedTo: tasks[index].assignedTo,
      time: tasks[index].time,
    });
  };

  useEffect(() => {
    posthog.capture('page_view', { path: window.location.pathname });
  }, []);

  if(!LoggedInUser)
  {
    return(
      <ThemeProvider theme={theme}>
        <Container maxwidth='xl' backgroundColor='green'>
            <Typography variant="h3" style={{marginBottom:'10px'}}>login</Typography>
            {error && <Typography color="error">{error}</Typography>}
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
                onClick={handleLogin}
                variant={contained}
                style={{display:'block',margin:'auto',marginBottom:'20px'}}
                >LOGIN</Button>
            </div>
        </Container>
        </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="xl" style={{backgroundColor:'skyblue'}}>
        <Typography variant='h2'>Welcome to Task Management App</Typography>
        <Button 
        variant={contained}
        onClick={handleLogout}
        style={{display:'block',margin:'auto',marginBottom:'20px'}}
        >LOGOUT</Button>
        <div style={{ marginBottom: '20px' }}>
          <TextField
            label="Task Name"
            variant="outlined"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            style={{ marginBottom: '20px' }}
            fullWidth
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
                <TableCell>Task Name</TableCell>
                <TableCell>Assigned To</TableCell>
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
                        <Button
                          onClick={() => saveTask(index)}
                          variant="contained"
                          color="secondary"
                        >
                          Save
                        </Button>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>{task.name}</TableCell>
                      <TableCell>{task.assignedTo}</TableCell>
                      <TableCell>{task.time}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => startEditing(index)}
                          variant="contained"
                          color="primary"
                          style={{ marginRight: '10px' }}
                        >Edit</Button>
                        <Button
                          onClick={() => deleteTask(index)}
                          variant="contained"
                          color="secondary"
                        > Delete</Button>
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