// ActionBar.js
import React, { useState } from 'react';
import './ActionBar.css';

const ActionBar = ({ handleGenerateJson, handleStartMiniQuiz, handleStartFromQuestion }) => {
  const [questionNumber, setQuestionNumber] = useState('');
  const [showOptions, setShowOptions] = useState(false);

  const handleInputChange = (e) => {
    setQuestionNumber(e.target.value);
  };

  const handleButtonClick = () => {
    handleStartFromQuestion(Number(questionNumber));
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  return (
    <div className="action-bar">
      <div className="gear-icon" onClick={toggleOptions}>
        &#9881; {/* Unicode for gear icon */}
      </div>
      {showOptions && (
        <div className="options">
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
      )}
    </div>
  );
};

export default ActionBar;
