// src/components/GoalList.js
import React from 'react';
import GoalCard from './GoalCard';
import './GoalList.css';

// Accept onDeleteGoal prop
function GoalList({ goals, onUpdateGoal, onDeleteGoal }) { // Add onDeleteGoal to props
  return (
    <div className="goal-list">
      {goals.map(goal => (
        // Pass onDeleteGoal to each GoalCard
        <GoalCard 
          key={goal.id} 
          goal={goal} 
          onUpdateGoal={onUpdateGoal} 
          onDeleteGoal={onDeleteGoal} // NEW PROP
        />
      ))}
    </div>
  );
}

export default GoalList;