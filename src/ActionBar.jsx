import React, { useState } from 'react';
import './ActionBar.css';

const ActionBar = ({ handleGenerateJson, handleStartMiniQuiz, handleStartFromQuestion, handleSearch, handleBackToQuiz, handleShowOnlyCorrect }) => {
  const [questionNumber, setQuestionNumber] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e) => {
    setQuestionNumber(e.target.value);
  };

  const handleButtonClick = () => {
    handleStartFromQuestion(Number(questionNumber));
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchButtonClick = () => {
    handleSearch(searchTerm);
  };

  return (
    <div className="action-bar">
      <div className="gear-icon" onClick={toggleOptions}>
        &#9881; {/* Unicode for gear icon */}
      </div>
      <div className={`options ${showOptions ? 'show' : ''}`}>
        <button onClick={handleGenerateJson}>Generar JSON</button>
        <button onClick={handleStartMiniQuiz}>Iniciar Mini Quiz</button>
        <input
          type="number"
          value={questionNumber}
          onChange={handleInputChange}
          placeholder="Número de pregunta"
        />
        <button onClick={handleButtonClick}>Comenzar desde aquí</button>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Buscar pregunta"
        />
        <button onClick={handleSearchButtonClick}>Buscar</button>
        <button onClick={handleBackToQuiz}>Regresar al Quiz</button>
        <button onClick={handleShowOnlyCorrect}>Mostrar solo correcta</button>
      </div>
    </div>
  );
};

export default ActionBar;
