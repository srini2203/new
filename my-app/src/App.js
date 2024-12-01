import React, { useState } from 'react';

import './App.css'; 



const App = () => {

  const [tasks, setTasks] = useState([]); 

  const [newTask, setNewTask] = useState('');

  const [assignedTo, setAssignedTo] = useState('');

  const [time, setTime] = useState('');

  const [editingIndex, setEditingIndex] = useState(null);

  const [editingText, setEditingText] = useState('');



  

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

    <div className="container">

      <h1 className="header">Task Manager</h1>

      <div>

        <input

          type="text"

          placeholder="Add a new task....."

          value={newTask}

          onChange={(e) => setNewTask(e.target.value)}

          className="input"

        />

        <select

          value={assignedTo}

          onChange={(e) => setAssignedTo(e.target.value)}

          className="select"

        >

          <option value="">Assign To</option>

          <option value="Sakthi">Sakthi</option>

          <option value="Parasu">Parasu</option> 

          <option value="Srini">Srini</option>

        </select>

        <input

          type="time"

          value={time}

          onChange={(e) => setTime(e.target.value)}

          className="input"

        />

        <button onClick={addTask} className="button">Add Task</button>

      </div>

      <table className="task-table">

        <thead>

          <tr>

            <th>Task name</th>

            <th>Assigned to</th>

            <th>Time</th>

            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

        {tasks.map((task, index) => (

          <tr key={index} className="list-item">

            {editingIndex === index ? (

              <>

                <td>

                <input

                  type="text"

                  value={editingText}

                  onChange={(e) => setEditingText(e.target.value)}

                  className="input"

                /></td>

                <td colSpan={2}></td>

                <td><button onClick={() => saveTask(index)} className="button">Save</button></td>

              </>

            ) : (

              <>

                <td>{task.name}</td>

                <td>Assigned to: {task.assignedTo}</td>

                <td>Time: {task.time}</td>

                <td><button onClick={() => startEditing(index)} className="button">Edit</button>

                <button onClick={() => deleteTask(index)} className="delete-button">Delete</button></td>

              </>

            )}

          </tr>

        ))}

        </tbody>

      </table>

    </div>

  );

};



export default App;

