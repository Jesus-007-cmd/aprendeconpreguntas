import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
//import './QuizApp.css';
import trailheadQuestions1 from '../../data/01preguntasTrailHeald.json';
import trailheadQuestions2 from '../../data/02preguntasTrailHeald.json';
import trailheadQuestions3 from '../../data/03PreguntasTrailHead.json';
import preguntascertificacionCAP2 from '../../data/preguntascertificacionCAP2.json';
import telcelQuestions1 from '../../data/preguntastelcel.json';
import telcelQuestions2 from '../../data/preguntastelcel2.json';
import lenguajeFrances from '../../data/LenguajeFrances.json';
import quiz_web_dev from '../../data/quiz_web_dev.json';
import quiz_web_dev2 from '../../data/quiz_web_dev2.json';

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
  const [category, setCategory] = useState(''); // Estado para la categoría
  const [showMenu, setShowMenu] = useState(true); // Estado para mostrar el menú

  // Referencia para el contenedor de la aplicación
  const quizContainerRef = useRef(null);

  // Función para activar el modo pantalla completa
  const enterFullScreen = () => {
    if (quizContainerRef.current.requestFullscreen) {
      quizContainerRef.current.requestFullscreen();
    } else if (quizContainerRef.current.webkitRequestFullscreen) { // Soporte para Safari
      quizContainerRef.current.webkitRequestFullscreen();
    } else if (quizContainerRef.current.msRequestFullscreen) { // Soporte para IE/Edge
      quizContainerRef.current.msRequestFullscreen();
    }
  };

  // Función para salir del modo pantalla completa
  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { // Soporte para Safari
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { // Soporte para IE/Edge
      document.msExitFullscreen();
    }
  };

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
      case 'quiz_web_dev':
          return quiz_web_dev;
      case 'quiz_web_dev2':
          return quiz_web_dev2;
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
      setQuestions(shuffledQuestions);
    };

    if (category) {
      const selectedQuestions = loadQuestions(category);
      shuffleQuestions(selectedQuestions);
    }
  }, [category]);

  const handleAnswerSelect = selectedAnswer => {
    const currentQuestion = questions[currentQuestionIndex];

    if (selectedAnswer === currentQuestion["Correct Answer"]) {
      setSelectedAnswer(selectedAnswer);
      setScore(score + 1);
      setShowCorrect(true);
      setTimeout(() => {
        setShowCorrect(false);
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          setShowResult(true);
        }
      }, 500); // Mostrar "¡Bien hecho!" por 0.5 segundos
    } else {
      const updatedIncorrectQuestions = [...incorrectQuestions, currentQuestion];
      setIncorrectQuestions(updatedIncorrectQuestions);
      localStorage.setItem('incorrectQuestions', JSON.stringify(updatedIncorrectQuestions));
      setSelectedAnswer(selectedAnswer);
    }
  };

  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory);
    setShowMenu(false); // Ocultar el menú al seleccionar una categoría
  };

  const handleRestartQuiz = () => {
    setScore(0);
    setCurrentQuestionIndex(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setIncorrectQuestions([]);
    setShowOnlyCorrect(false);
  
    const shuffleAnswers = () => {
      const shuffledQuestions = questions.map(question => {
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
    const results = questions.filter(question =>
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
    <div ref={quizContainerRef} className="relative bg-gray-900 text-white min-h-screen p-4">
      {showMenu && (
        <>
          <button
            onClick={enterFullScreen}
            className="mb-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            Pantalla Completa
          </button>
  
          <button
            onClick={exitFullScreen}
            className="mb-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
          >
            Salir Pantalla Completa
          </button>
  
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {[
              { key: 'trailhead1', label: 'Preguntas Trailhead 1' },
              { key: 'trailhead2', label: 'Preguntas Trailhead 2' },
              { key: 'trailhead3', label: 'Preguntas Trailhead 3' },
              { key: 'certificacion', label: 'Preguntas Certificación' },
              { key: 'telcel1', label: 'Preguntas Telcel 1' },
              { key: 'telcel2', label: 'Preguntas Telcel 2' },
              { key: 'lenguajeFrances', label: 'Preguntas Francés' },
              { key: 'quiz_web_dev', label: 'Preguntas Desarrollo Web Responsivo' },
              { key: 'quiz_web_dev2', label: 'Preguntas Desarrollo Web Responsivo 2' },
            ].map(({ key, label }) => (
              <button
                key={key}
                className="bg-indigo-600 hover:bg-indigo-700 py-2 px-4 rounded shadow-md transition duration-200 ease-in-out transform hover:scale-105"
                onClick={() => handleCategorySelect(key)}
              >
                {label}
              </button>
            ))}
          </div>
  
          <Bar incorrectQuestions={incorrectQuestions} />
          <ActionBar
            handleGenerateJson={handleGenerateJson}
            handleStartMiniQuiz={handleStartMiniQuiz}
            handleStartFromQuestion={handleStartFromQuestion}
            handleSearch={handleSearch}
            handleBackToQuiz={handleBackToQuiz}
          />
        </>
      )}
  
      {!showMenu && (
        <button
          className="absolute bottom-2 right-2 text-4xl bg-transparent border-none cursor-pointer"
          onClick={() => setShowMenu(true)}
        >
          ⚙️
        </button>
      )}
  
      {searchResults.length > 0 ? (
        <div className="space-y-4">
          {searchResults.map((question) => (
            <div key={uuidv4()} className="bg-gray-800 p-4 rounded shadow-md">
              <h2 className="text-lg font-semibold">{question["Question Text"]}</h2>
              <ul className="list-disc list-inside">
                <li>{question["Option 1"]}</li>
                <li>{question["Option 2"]}</li>
                <li>{question["Option 3"]}</li>
                <li>{question["Correct Answer"]}</li>
              </ul>
            </div>
          ))}
        </div>
      ) : !showResult ? (
        <div>
          {questions.length > 0 && currentQuestionIndex < questions.length && (
            <div className="bg-gray-800 p-4 rounded shadow-md">
              <p className="text-xl font-semibold mb-4">
                {questions[currentQuestionIndex]["Question Text"]}
              </p>
  
              {showOnlyCorrect ? (
                <p className="text-green-400 font-bold">
                  {questions[currentQuestionIndex]["Correct Answer"]}
                </p>
              ) : (
                questions[currentQuestionIndex]["options"].map((option) => (
                  <button
                    key={uuidv4()}
                    onClick={() => handleAnswerSelect(option)}
                    className={`w-full max-w-xs text-lg py-2 px-4 my-2 rounded transition duration-200 ${
                      selectedAnswer === option
                        ? "bg-orange-500 hover:bg-orange-600"
                        : "bg-blue-700 hover:bg-blue-800"
                    }`}
                  >
                    {option}
                  </button>
                ))
              )}
  
              {showCorrect && <div className="text-green-500 mt-4">¡Bien hecho!</div>}
  
              {currentQuestionIndex > 0 && selectedAnswer && (
                <small className="block mt-2 text-gray-400">
                  Repasa pregunta anterior:
                  <span className="block">
                    {questions[currentQuestionIndex - 1]["Question Text"]} : {selectedAnswer}
                  </span>
                </small>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-800 p-4 rounded shadow-md text-center">
          <h1 className="text-2xl font-semibold">Resultado</h1>
          <p className="text-lg my-2">Tu puntaje: {score}</p>
          <button
            onClick={handleRestartQuiz}
            className="bg-green-600 hover:bg-green-700 py-2 px-4 rounded"
          >
            Reiniciar Quiz
          </button>
        </div>
      )}
    </div>
  );
}  

export default QuizApp;
