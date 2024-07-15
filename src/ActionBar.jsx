// ActionBar.js
import React, { useState } from 'react';
import './ActionBar.css';

const ActionBar = ({ handleGenerateJson, handleStartMiniQuiz, handleStartFromQuestion }) => {
  const [questionNumber, setQuestionNumber] = useState('');

  const handleInputChange = (e) => {
    setQuestionNumber(e.target.value);
  };

  const handleButtonClick = () => {
    handleStartFromQuestion(Number(questionNumber));
  };

  return (
    <div className="action-bar">
      <button onClick={handleGenerateJson}>Generar JSON</button>
      <button onClick={handleStartMiniQuiz}>Iniciar Mini Quiz</button>
      <input 
        type="number" 
        value={questionNumber} 
        onChange={handleInputChange} 
        placeholder="Número de pregunta" 
      />
      <button onClick={handleButtonClick}>Comenzar desde aquí</button>
    </div>
  );
};

export default ActionBar;
