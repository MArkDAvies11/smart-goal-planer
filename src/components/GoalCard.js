// src/components/GoalCard.js
import React, { useState } from 'react';
import './GoalCard.css';

function GoalCard({ goal, onUpdateGoal, onDeleteGoal }) {
  const [depositAmount, setDepositAmount] = useState('');

  // --- NEW: State for Edit Mode ---
  const [isEditing, setIsEditing] = useState(false);
  // --- NEW: Local state for editable fields, initialized with current goal data ---
  const [editedName, setEditedName] = useState(goal.name);
  const [editedTargetAmount, setEditedTargetAmount] = useState(goal.targetAmount);
  const [editedCategory, setEditedCategory] = useState(goal.category);
  const [editedDeadline, setEditedDeadline] = useState(goal.deadline);


  // --- Helper Functions (No changes here unless noted) ---
  const progress = (goal.savedAmount / goal.targetAmount) * 100;
  const progressBarWidth = Math.min(progress, 100);
  const remainingAmount = goal.targetAmount - goal.savedAmount;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getDeadlineStatus = (deadlineDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    const deadline = new Date(deadlineDate);
    deadline.setHours(0, 0, 0, 0);

    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 / 24)); // Fixed calculation here, was missing *24

    if (goal.savedAmount >= goal.targetAmount) {
      return <span className="status completed">Completed!</span>;
    } else if (diffDays <= 0) { 
      return <span className="status overdue">Overdue</span>;
    } else if (diffDays <= 30) { 
      return <span className="status warning">Due Soon ({diffDays} days left)</span>;
    }
    return <span className="status on-track">{diffDays} days left</span>;
  };

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);

    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid positive deposit amount.");
      return;
    }

    const newSavedAmount = goal.savedAmount + amount;
    onUpdateGoal(goal.id, { savedAmount: newSavedAmount });
    setDepositAmount('');
  };

  const handleDeleteClick = () => {
    onDeleteGoal(goal.id);
  };

  // --- NEW: Handle Edit Actions ---
  const handleEditClick = () => {
    setIsEditing(true);
    // When entering edit mode, ensure local state reflects current goal data
    setEditedName(goal.name);
    setEditedTargetAmount(goal.targetAmount);
    setEditedCategory(goal.category);
    setEditedDeadline(goal.deadline);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Optionally reset edited values to original if user cancels after typing
    setEditedName(goal.name);
    setEditedTargetAmount(goal.targetAmount);
    setEditedCategory(goal.category);
    setEditedDeadline(goal.deadline);
  };

  const handleSaveEdit = () => {
    // Basic validation
    if (!editedName || !editedTargetAmount || !editedCategory || !editedDeadline) {
      alert('Please fill in all fields for the edited goal.');
      return;
    }

    const updates = {
      name: editedName,
      targetAmount: parseFloat(editedTargetAmount), // Ensure it's a number
      category: editedCategory,
      deadline: editedDeadline,
    };

    // Use the existing onUpdateGoal function from App.js
    onUpdateGoal(goal.id, updates);

    setIsEditing(false); // Exit edit mode
  };

  // --- Render logic based on isEditing state ---
  return (
    <div className="goal-card">
      {isEditing ? (
        // Render edit form
        <div className="edit-form">
          <div className="form-group">
            <label htmlFor={`name-${goal.id}`}>Name:</label>
            <input
              type="text"
              id={`name-${goal.id}`}
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor={`targetAmount-${goal.id}`}>Target:</label>
            <input
              type="number"
              id={`targetAmount-${goal.id}`}
              value={editedTargetAmount}
              onChange={(e) => setEditedTargetAmount(e.target.value)}
              required
              min="0"
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label htmlFor={`category-${goal.id}`}>Category:</label>
            <input
              type="text"
              id={`category-${goal.id}`}
              value={editedCategory}
              onChange={(e) => setEditedCategory(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor={`deadline-${goal.id}`}>Deadline:</label>
            <input
              type="date"
              id={`deadline-${goal.id}`}
              value={editedDeadline}
              onChange={(e) => setEditedDeadline(e.target.value)}
              required
            />
          </div>
          <div className="edit-actions">
            <button className="save-btn" onClick={handleSaveEdit}>Save</button>
            <button className="cancel-btn" onClick={handleCancelEdit}>Cancel</button>
          </div>
        </div>
      ) : (
        // Render display mode
        <>
          <h3>{goal.name}</h3>
          <p>Category: {goal.category}</p>
          <p>Target: {formatCurrency(goal.targetAmount)}</p>
          <p>Saved: {formatCurrency(goal.savedAmount)}</p>
          <p>Remaining: {formatCurrency(remainingAmount)}</p>
          <p>Deadline: {goal.deadline} {getDeadlineStatus(goal.deadline)}</p>
          
          {/* Progress Bar */}
          <div className="progress-bar-container">
            <div
              className={`progress-bar-fill ${progress >= 100 ? 'completed' : ''}`} 
              style={{ width: `${progressBarWidth}%` }} 
              ></div>
          </div>
          <p className="progress-percentage">{progress.toFixed(2)}%</p>

          {/* Action Buttons */}
          <div className="card-actions">
            <div className="deposit-section">
              <input
                type="number"
                placeholder="Deposit amount"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                min="0"
                step="0.01"
                className="deposit-input"
              />
              <button className="deposit-btn" onClick={handleDeposit}>Deposit</button>
            </div>
            
            <button className="edit-btn" onClick={handleEditClick}>Edit</button> {/* Add onClick */}
            <button className="delete-btn" onClick={handleDeleteClick}>Delete</button> 
          </div>
        </>
      )}
    </div>
  );
}

export default GoalCard;