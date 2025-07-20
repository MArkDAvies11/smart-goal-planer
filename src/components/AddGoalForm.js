// src/components/AddGoalForm.js
import React, { useState } from 'react';
import './AddGoalForm.css'; // Create this CSS file for styling

function AddGoalForm({ onAddGoal }) { // onAddGoal will be a function passed from App.js
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [category, setCategory] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior (page reload)

    // Basic validation
    if (!name || !targetAmount || !category || !deadline) {
      alert('Please fill in all fields.');
      return;
    }

    const newGoal = {
      name,
      targetAmount: parseFloat(targetAmount), // Convert to number
      savedAmount: 0, // New goals start with 0 saved
      category,
      deadline,
      createdAt: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD
    };

    // Call the function passed from App.js to handle adding the goal
    onAddGoal(newGoal);

    // Clear form fields after submission
    setName('');
    setTargetAmount('');
    setCategory('');
    setDeadline('');
  };

  return (
    <form className="add-goal-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Goal Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="targetAmount">Target Amount:</label>
        <input
          type="number"
          id="targetAmount"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          required
          min="0"
          step="0.01"
        />
      </div>
      <div className="form-group">
        <label htmlFor="category">Category:</label>
        <input
          type="text"
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="deadline">Deadline:</label>
        <input
          type="date"
          id="deadline"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="add-goal-btn">Add Goal</button>
    </form>
  );
}

export default AddGoalForm;