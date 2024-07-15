// QuizApp.js
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './QuizApp.css';
import questionsData from './data/preguntastelcel2.json';
import Bar from './Bar';
import ActionBar from './ActionBar';

function QuizApp() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showCorrect, setShowCorrect] = useState(false);
  const [incorrectQuestions, setIncorrectQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  useEffect(() => {
    const shuffleAnswers = () => {
      const shuffledQuestions = questionsData.map(question => {
        const options = [
          question["Option 1"],
          question["Option 2"],
          question["Option 3"],
          question["Correct Answer"]
        ];
        shuffleArray(options);
        return { ...question, options };
      });

      setQuestions(shuffledQuestions);
    };

    shuffleAnswers();
  }, []);

  const handleAnswerSelect = selectedAnswer => {
    const currentQuestion = questions[currentQuestionIndex];

    if (selectedAnswer === currentQuestion["Correct Answer"]) {
      setScore(score + 1);
      setShowCorrect(true);
      setTimeout(() => {
        setShowCorrect(false);
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          setShowResult(true);
        }
      }, 1500); // Mostrar "¡Bien hecho!" por 1.5 segundos
    } else {
      const updatedIncorrectQuestions = [...incorrectQuestions, currentQuestion];
      setIncorrectQuestions(updatedIncorrectQuestions);
      localStorage.setItem('incorrectQuestions', JSON.stringify(updatedIncorrectQuestions));
      setSelectedAnswer(selectedAnswer);
    }
  };

  const handleRestartQuiz = () => {
    setScore(0);
    setCurrentQuestionIndex(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setIncorrectQuestions([]);
    const shuffleAnswers = () => {
      const shuffledQuestions = questionsData.map(question => {
        const options = [
          question["Option 1"],
          question["Option 2"],
          question["Option 3"],
          question["Correct Answer"]
        ];
        shuffleArray(options);
        return { ...question, options };
      });

      setQuestions(shuffledQuestions);
    };
    shuffleAnswers();
  };

  const handleGenerateJson = () => {
    const jsonContent = JSON.stringify(incorrectQuestions, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'incorrect_questions.json';
    link.click();
  };

  const handleStartMiniQuiz = () => {
    const storedIncorrectQuestions = JSON.parse(localStorage.getItem('incorrectQuestions')) || [];
    if (storedIncorrectQuestions.length > 0) {
      setQuestions(storedIncorrectQuestions);
      setCurrentQuestionIndex(0);
      setScore(0);
      setShowResult(false);
      setSelectedAnswer(null);
    } else {
      alert('No hay preguntas incorrectas almacenadas.');
    }
  };

  const handleStartFromQuestion = (index) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
      setScore(0);
      setShowResult(false);
      setSelectedAnswer(null);
    } else {
      alert('Número de pregunta fuera de rango.');
    }
  };

  const handleSearch = () => {
    const results = questionsData.filter(question =>
      question["Question Text"].toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  };

  return (
    <div className="quiz-container">
      <Bar incorrectQuestions={incorrectQuestions} />
      <ActionBar
        handleGenerateJson={handleGenerateJson}
        handleStartMiniQuiz={handleStartMiniQuiz}
        handleStartFromQuestion={handleStartFromQuestion}
      />
      <div className="search-bar">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar pregunta"
        />
        <button onClick={handleSearch}>Buscar</button>
      </div>
      {searchResults.length > 0 ? (
        <div className="search-results">
          {searchResults.map((question, index) => (
            <div key={uuidv4()} className="question-container">
              <h2>{question["Question Text"]}</h2>
              <ul>
                <li>{question["Option 1"]}</li>
                <li>{question["Option 2"]}</li>
                <li>{question["Option 3"]}</li>
                <li>{question["Correct Answer"]}</li>
              </ul>
            </div>
          ))}
        </div>
      ) : (
        !showResult ? (
          <div>
            <h1>Quiz App</h1>
            {questions.length > 0 && currentQuestionIndex < questions.length && (
              <div className="question-container">
                <h2>{questions[currentQuestionIndex]["Question Text"]}</h2>
                {questions[currentQuestionIndex]["options"].map(option => (
                  <button
                    key={uuidv4()}
                    onClick={() => handleAnswerSelect(option)}
                    className={selectedAnswer === option ? "selected" : ""}
                    style={{ fontSize: '18px', padding: '10px', margin: '5px' }} // Estilos en línea
                  >
                    {option}
                  </button>
                ))}
                {showCorrect && <div className="correct">¡Bien hecho!</div>}
              </div>
            )}
          </div>
        ) : (
          <div className="result-container">
            <h1>Result</h1>
            <p>Your Score: {score}</p>
            <button onClick={handleRestartQuiz}>Restart Quiz</button>
          </div>
        )
      )}
    </div>
  );
}

export default QuizApp;
