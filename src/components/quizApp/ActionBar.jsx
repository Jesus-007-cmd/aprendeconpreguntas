import React, { useState } from 'react';

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
    <div className="bg-gray-800 p-4 rounded shadow-md text-white relative">
      <div
        className="absolute top-2 right-2 text-2xl cursor-pointer hover:text-gray-400"
        onClick={toggleOptions}
      >
        &#9881;
      </div>

      <div className={`mt-8 flex flex-wrap gap-2 transition-opacity duration-300 ease-in-out ${showOptions ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <button
          onClick={handleGenerateJson}
          className="bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded"
        >
          Generar JSON
        </button>

        <button
          onClick={handleStartMiniQuiz}
          className="bg-green-600 hover:bg-green-700 py-2 px-4 rounded"
        >
          Iniciar Mini Quiz
        </button>

        <input
          type="number"
          value={questionNumber}
          onChange={handleInputChange}
          placeholder="Número de pregunta"
          className="bg-gray-700 border border-gray-600 rounded py-2 px-4"
        />

        <button
          onClick={handleButtonClick}
          className="bg-purple-600 hover:bg-purple-700 py-2 px-4 rounded"
        >
          Comenzar desde aquí
        </button>

        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Buscar pregunta"
          className="bg-gray-700 border border-gray-600 rounded py-2 px-4"
        />

        <button
          onClick={handleSearchButtonClick}
          className="bg-indigo-600 hover:bg-indigo-700 py-2 px-4 rounded"
        >
          Buscar
        </button>

        <button
          onClick={handleBackToQuiz}
          className="bg-yellow-600 hover:bg-yellow-700 py-2 px-4 rounded"
        >
          Regresar al Quiz
        </button>

        <button
          onClick={handleShowOnlyCorrect}
          className="bg-teal-600 hover:bg-teal-700 py-2 px-4 rounded"
        >
          Mostrar solo correcta
        </button>
      </div>
    </div>
  );
};

export default ActionBar;
