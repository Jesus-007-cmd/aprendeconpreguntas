import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './QuizApp.css';
import trailheadQuestions1 from '../../data/01preguntasTrailHeald.json';
import trailheadQuestions2 from '../../data/02preguntasTrailHeald.json';
import trailheadQuestions3 from '../../data/03PreguntasTrailHead.json';
import preguntascertificacionCAP2 from '../../data/preguntascertificacionCAP2.json';
import telcelQuestions1 from '../../data/preguntastelcel.json';
import telcelQuestions2 from '../../data/preguntastelcel2.json';
import lenguajeFrances from '../../data/LenguajeFrances.json'

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
  const [searchResults, setSearchResults] = useState([]);
  const [showOnlyCorrect, setShowOnlyCorrect] = useState(false);
  const [category, setCategory] = useState('');  // Nuevo estado para la categoría

  const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };
  const loadQuestions = (category) => {
    switch (category) {
      case 'trailhead1':
        return trailheadQuestions1;
      case 'trailhead2':
        return trailheadQuestions2;
      case 'trailhead3':
        return trailheadQuestions3;
      case 'certificacion':
        return preguntascertificacionCAP2;
      case 'telcel1':
        return telcelQuestions1;
      case 'telcel2':
        return telcelQuestions2;
      case 'lenguajeFrances':
        return lenguajeFrances;
      default:
        return [];
    }
  };
  

  useEffect(() => {
    const shuffleQuestions = (questionsData) => {
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
      setQuestions(shuffledQuestions);  // Establecer las preguntas barajadas
    };
  
    if (category) {
      const selectedQuestions = loadQuestions(category);  // Cargar preguntas según la categoría seleccionada
      shuffleQuestions(selectedQuestions);  // Barajar las respuestas
    }
  }, [category]);
  
  

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
      }, 500); // Mostrar "¡Bien hecho!" por 1.5 segundos
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
    setShowOnlyCorrect(false);
  
    const shuffleAnswers = () => {
      const shuffledQuestions = questions.map(question => {  // Cambiado de questionsData a questions
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
      setShowOnlyCorrect(false);
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
      setShowOnlyCorrect(false);
    } else {
      alert('Número de pregunta fuera de rango.');
    }
  };
  const handleSearch = (term) => {
    const results = questions.filter(question =>  // Cambiado de questionsData a questions
      question["Question Text"].toLowerCase().includes(term.toLowerCase())
    ).map(question => ({
      "Question Text": question["Question Text"],
      "Correct Answer": question["Correct Answer"]
    }));
    setSearchResults(results);
  };
  
  

  const handleBackToQuiz = () => {
    setSearchResults([]);
    setShowOnlyCorrect(false);
  };

  

  return (
    <div className="quiz-container">
      <div className="category-buttons">
      <button onClick={() => setCategory('trailhead1')}>Preguntas Trailhead 1</button>
      <button onClick={() => setCategory('trailhead2')}>Preguntas Trailhead 2</button>
      <button onClick={() => setCategory('trailhead3')}>Preguntas Trailhead 3</button>
      <button onClick={() => setCategory('certificacion')}>Preguntas Certificación</button>
      <button onClick={() => setCategory('telcel1')}>Preguntas Telcel 1</button>
      <button onClick={() => setCategory('telcel2')}>Preguntas Telcel 2</button>
      <button onClick={() => setCategory('lenguajeFrances')}>Preguntas Frances</button>
      
    </div>
      <Bar incorrectQuestions={incorrectQuestions} />
      <ActionBar
        handleGenerateJson={handleGenerateJson}
        handleStartMiniQuiz={handleStartMiniQuiz}
        handleStartFromQuestion={handleStartFromQuestion}
        handleSearch={handleSearch}
        handleBackToQuiz={handleBackToQuiz}
      />
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
          
            {questions.length > 0 && currentQuestionIndex < questions.length && (
              <div className="question-container">
                <h2>{questions[currentQuestionIndex]["Question Text"]}</h2>
                {showOnlyCorrect ? (
                  <p>{questions[currentQuestionIndex]["Correct Answer"]}</p>
                ) : (
                  questions[currentQuestionIndex]["options"].map(option => (
                    <button
                      key={uuidv4()}
                      onClick={() => handleAnswerSelect(option)}
                      className={selectedAnswer === option ? "selected" : ""}
                      style={{ fontSize: '4vh', padding: '10px', margin: '5px' }} // Estilos en línea
                    >
                      {option}
                    </button>
                  ))
                )}
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
