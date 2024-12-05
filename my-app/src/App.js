import React, { useState, useEffect } from 'react';
import {
  Button,TextField,Select,MenuItem,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,Container,ThemeProvider,createTheme,} from '@mui/material';
import posthog from 'posthog-js';

posthog.init('phc_YGT2EnmKDc5ZAl2x3R9oIpXeQ564MXaPir2JNm0C4ve', {
  api_host: 'https://us.i.posthog.com', 
  debug: true, 
  capture_pageview: true, 
});

const App = () => {
  const [newTask, setNewTask] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [time, setTime] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState('');

  useEffect(()=>{
    localStorage.setItem('tasks',JSON.stringify(tasks));
  },[tasks]);

  useEffect(()=>{
    const storedtasks=(localStorage.getItem('tasks'));
    if(storedtasks){
      setTasks(JSON.parse(storedtasks))
    }
  },[]);

  
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

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="xl" style={{backgroundColor:'skyblue'}}>
        <h1>Task Management App</h1>
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