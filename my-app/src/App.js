import React, { useState,useEffect} from 'react';
import {Button,TextField,Select,MenuItem,Table,TableContainer,TableCell,TableHead,TableRow,Paper, TableBody,Container}from '@mui/material';
import {createTheme,ThemeProvider}from '@mui/material/styles';
import './App.css'; 

const theme=createTheme({
  palette:{
    primary:{
      main:'#90caf9',
    },
    secondary:{
      main:'#f50057',
    },
    background:{
      default:'#42a5f5',
    },
  },
  typography:{
    fontSize:12,
    fontFamily:'Roboto,sans-serif',
    h1:{
      color:'#f44336',
    },
  },
});

const App = () => {
  const [tasks, setTasks] = useState([]); 
  const [newTask, setNewTask] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [time, setTime] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState('');

  useEffect(()=>{
    const savedTasks=JSON.parse(localStorage.getItem('tasks'));
    if(savedTasks){
      setTasks(savedTasks);
    }
  },[]);

  useEffect(()=>{
    localStorage.setItem('tasks',JSON.stringify(tasks))
  },[tasks])

  const addTask = () => {

    if (newTask.trim() === '' || assignedTo === '' || time === '') return;

    setTasks([...tasks, { name: newTask.trim(), assignedTo, time }]);

    setNewTask('');
    setAssignedTo('');
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
      <Container maxWidth="xl" style={{backgroundColor:theme.palette.background.default,padding:'20px'}}>
      <h1 style={{textAlign:'center'}}>Task Manager</h1>
      
      <div style={{margin:'20px',display:'flex',flexDirection:'column'}}>
        <TextField 
        label="Text"
        variant="outlined"
        value={newTask}
        onChange={(e)=>{setNewTask(e.target.value)}}
        style={{marginBottom :'20px'}}
        />
        <Select
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          displayEmpty
          fullWidth
          style={{marginBottom:'20px'}}
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
          style={{marginBottom:'20px'}}
          fullWidth
        />
        <Button onClick={addTask} variant="contained" color="primary" style={{marginBottom:'20px'}}>Add Task</Button>
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
            <TableRow key={index} >
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
                <TableCell><button onClick={() => saveTask(index)} variant="contained" color="Secondary">Save</button></TableCell>
              </>

            ) : (
              <>
                <TableCell>{task.name}</TableCell>
                <TableCell>Assigned to: {task.assignedTo}</TableCell>
                <TableCell>Time: {task.time}</TableCell>
                <TableCell><button onClick={() => startEditing(index)} variant="Contained" color="Secondary">Edit</button>
                <button onClick={() => deleteTask(index)} variant="Contained" color="Secondary">Delete</button></TableCell>
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

