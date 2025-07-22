// src/App.js
import React, { useState, useEffect } from 'react';
import GoalList from './components/GoalList';
import AddGoalForm from './components/AddGoalForm';
import './App.css'; 

const API_BASE_URL = 'https://json-server-vercel-snowy-six.vercel.app'; 

function App() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch goals (can be reused if needed)
  const fetchGoals = () => {
    setLoading(true);
    setError(null);
    fetch(`${API_BASE_URL}/goals`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setGoals(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching goals:", err);
        setError("Failed to load goals. Please try again later.");
        setLoading(false);
      });
  };

  // Initial fetch when the component mounts
  useEffect(() => {
    fetchGoals();
  }, []); 

  // Function to handle adding a new goal
  const handleAddGoal = (newGoalData) => {
    fetch(`${API_BASE_URL}/goals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newGoalData),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(addedGoal => {
      setGoals(prevGoals => [...prevGoals, addedGoal]);
      alert('Goal added successfully!');
    })
    .catch(err => {
      console.error("Error adding goal:", err);
      alert('Failed to add goal: ' + err.message);
    });
  };

  // Function to handle updating a goal (reused for deposits and later for editing)
  const handleUpdateGoal = (goalId, updates) => {
    fetch(`${API_BASE_URL}/goals/${goalId}`, {
      method: 'PATCH', // Use PATCH for partial updates
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates), // Send only the updated fields
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(updatedGoal => {
      // Update the goals state: find the updated goal and replace it
      setGoals(prevGoals => 
        prevGoals.map(goal => 
          goal.id === updatedGoal.id ? updatedGoal : goal
        )
      );
      // Optional: alert('Goal updated successfully!'); // Can be too frequent
    })
    .catch(err => {
      console.error("Error updating goal:", err);
      alert('Failed to update goal: ' + err.message);
    });
  };

  // --- NEW: Function to handle deleting a goal ---
  const handleDeleteGoal = (goalId) => {
    if (!window.confirm("Are you sure you want to delete this goal?")) {
      return; // Stop if user cancels
    }

    fetch(`${API_BASE_URL}/goals/${goalId}`, {
      method: 'DELETE', // Use DELETE method
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // No JSON body expected for a successful DELETE, just check status
      return response.text().then(text => text ? JSON.parse(text) : {}); // Handle empty response gracefully
    })
    .then(() => {
      // Filter out the deleted goal from the state
      setGoals(prevGoals => prevGoals.filter(goal => goal.id !== goalId));
      alert('Goal deleted successfully!');
    })
    .catch(err => {
      console.error("Error deleting goal:", err);
      alert('Failed to delete goal: ' + err.message);
    });
  };


  if (loading) {
    return <div className="loading">Loading goals...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="App">
      <header>
        <h1>Smart Goal Planner</h1>
      </header>
      <main>
        {/* Placeholder for Overview Dashboard */}
        <section className="overview-dashboard">
          <h2>Overview</h2>
          <p>Total Goals: {goals.length}</p>
          {/* Other overview stats will go here later */}
        </section>

        {/* Add Goal Form */}
        <section className="add-goal-section">
          <h2>Add New Goal</h2>
          <AddGoalForm onAddGoal={handleAddGoal} />
        </section>

        {/* Goal List */}
        <section className="goal-list-section">
          <h2>Your Goals</h2>
          {/* Pass the handleDeleteGoal function down to GoalList */}
          <GoalList 
            goals={goals} 
            onUpdateGoal={handleUpdateGoal} 
            onDeleteGoal={handleDeleteGoal} // NEW PROP
          /> 
        </section>
      </main>
    </div>
  );
}

export default App;