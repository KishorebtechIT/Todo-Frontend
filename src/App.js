import React, { Component } from 'react';
import './App.css';

class App extends Component {
  
    state = {
      tasks: [],
      taskName: ''
    };
  

  componentDidMount() {
    this.fetchTasks();
  }

  fetchTasks = async () => {
    const response = await fetch('http://localhost:5000/tasks');
    const data = await response.json();
    this.setState({ tasks: data });
  };

  addTask = async () => {
    if (this.state.taskName) {
      const response = await fetch('http://localhost:5000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: this.state.taskName }),
      });
      const newTask = await response.json();
      this.setState(prevState => ({
        tasks: [...prevState.tasks, newTask],
        taskName: ''
      }));
    }
  };

  deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'DELETE',
    });
    this.fetchTasks(); };


  updateTask = async (id) => {
    const newName = prompt('Update task:');
    if (newName) {
      const response = await fetch(`http://localhost:5000/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName }),
      });
      const updatedTask = await response.json();
      this.setState(prevState => ({
        tasks: prevState.tasks.map(task => (task._id === id ? updatedTask : task)),
      }));
    }
  };

  toggleComplete = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}/complete`, {
      method: 'PATCH',
    });
    this.fetchTasks(); 
  };


  render() {
    return (
      <div className="app-container">
        <h1>Todo List</h1>
        <div className="input-container">
          <input
            type="text"
            value={this.state.taskName}
            onChange={(event) => this.setState({ taskName: event.target.value })}
            placeholder="Add a new task"
            className="task-input"
          />
          <button onClick={this.addTask} className="add-button">Add</button>
        </div>
        <ul className="task-list">
          {this.state.tasks.map(task => (
            <li key={task._id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => this.toggleComplete(task._id)}
                className="task-checkbox"
              />
              {task.name}
              <button onClick={() => this.deleteTask(task._id)} className="delete-button">Delete</button>
              <button onClick={() => this.updateTask(task._id)} className="edit-button">Edit</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default App;
