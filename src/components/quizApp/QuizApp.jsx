import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import trailheadQuestions1 from '../../data/01preguntasTrailHeald.json';
import trailheadQuestions2 from '../../data/02preguntasTrailHeald.json';
import trailheadQuestions3 from '../../data/03PreguntasTrailHead.json';
import preguntascertificacionCAP2 from '../../data/preguntascertificacionCAP2.json';
import telcelQuestions1 from '../../data/preguntastelcel.json';
import telcelQuestions2 from '../../data/preguntastelcel2.json';
import telcelQuestions3 from '../../data/preguntastelcel3.json';
import lenguajeFrances from '../../data/LenguajeFrances.json';
import quiz_web_dev from '../../data/quiz_web_dev.json';
import quiz_web_dev2 from '../../data/quiz_web_dev2.json';
import MiniQuiz from './MiniQuiz'; 
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
  const [category, setCategory] = useState('');
  const [showMenu, setShowMenu] = useState(true);
  const [showMiniQuiz, setShowMiniQuiz] = useState(false);

  const quizContainerRef = useRef(null);

  // --- Pantalla completa ---
  const enterFullScreen = () => {
    if (quizContainerRef.current.requestFullscreen) {
      quizContainerRef.current.requestFullscreen();
    } else if (quizContainerRef.current.webkitRequestFullscreen) {
      quizContainerRef.current.webkitRequestFullscreen();
    } else if (quizContainerRef.current.msRequestFullscreen) {
      quizContainerRef.current.msRequestFullscreen();
    }
  };

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  };

  // --- Mezclar ---
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  // --- Iniciar Mini Quiz ---
  const handleStartMiniQuiz = () => {
    const storedIncorrectQuestions =
      JSON.parse(localStorage.getItem('incorrectQuestions')) || [];
    if (storedIncorrectQuestions.length > 0) {
      setShowMiniQuiz(true); // aquí sí abrimos el componente MiniQuiz.jsx
    } else {
      alert('No hay preguntas incorrectas almacenadas.');
    }
  };

  // --- Cargar preguntas ---
  const loadQuestions = (category) => {
    switch (category) {
      case 'trailhead1': return trailheadQuestions1;
      case 'trailhead2': return trailheadQuestions2;
      case 'trailhead3': return trailheadQuestions3;
      case 'certificacion': return preguntascertificacionCAP2;
      case 'telcel1': return telcelQuestions1;
      case 'telcel2': return telcelQuestions2;
      case 'telcel3': return telcelQuestions3;
      case 'lenguajeFrances': return lenguajeFrances;
      case 'quiz_web_dev': return quiz_web_dev;
      case 'quiz_web_dev2': return quiz_web_dev2;
      default: return [];
    }
  };

  useEffect(() => {
    const shuffleQuestions = (questionsData) => {
      const shuffledQuestions = questionsData.map((question) => {
        const options = [
          question['Option 1'],
          question['Option 2'],
          question['Option 3'],
          question['Correct Answer'],
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

  // --- Selección de respuesta ---
  const handleAnswerSelect = (selectedAnswer) => {
    const currentQuestion = questions[currentQuestionIndex];

    if (selectedAnswer === currentQuestion['Correct Answer']) {
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
      }, 600);
    } else {
      const updatedIncorrectQuestions = [...incorrectQuestions, currentQuestion];
      setIncorrectQuestions(updatedIncorrectQuestions);
      localStorage.setItem('incorrectQuestions', JSON.stringify(updatedIncorrectQuestions));
      setSelectedAnswer(selectedAnswer);
    }
  };

  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory);
    setShowMenu(false);
  };

  const handleRestartQuiz = () => {
    setScore(0);
    setCurrentQuestionIndex(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setIncorrectQuestions([]);
    setShowOnlyCorrect(false);

    const shuffleAnswers = () => {
      const shuffledQuestions = questions.map((question) => {
        const options = [
          question['Option 1'],
          question['Option 2'],
          question['Option 3'],
          question['Correct Answer'],
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
    const results = questions
      .filter((question) =>
        question['Question Text'].toLowerCase().includes(term.toLowerCase())
      )
      .map((question) => ({
        ...question,
      }));
    setSearchResults(results);
  };

  const handleBackToQuiz = () => {
    setSearchResults([]);
    setShowOnlyCorrect(false);
  };

  // --- Render ---
  return (
    <div
      ref={quizContainerRef}
      className="relative bg-gray-900 text-white min-h-screen p-4 flex flex-col items-center"
    >
      {showMiniQuiz ? (
        <MiniQuiz onBackToMain={() => setShowMiniQuiz(false)} />
      ) : (
        <>
          {/* Menú */}
          {showMenu && (
            <>
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                <button
                  onClick={enterFullScreen}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                >
                  Pantalla Completa
                </button>
                <button
                  onClick={exitFullScreen}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
                >
                  Salir Pantalla Completa
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 w-full max-w-5xl">
                {[
                  { key: 'trailhead1', label: 'Preguntas Trailhead 1' },
                  { key: 'trailhead2', label: 'Preguntas Trailhead 2' },
                  { key: 'trailhead3', label: 'Preguntas Trailhead 3' },
                  { key: 'certificacion', label: 'Preguntas Certificación' },
                  { key: 'telcel1', label: 'Preguntas Telcel 1' },
                  { key: 'telcel2', label: 'Preguntas Telcel 2' },
                  { key: 'telcel3', label: 'Preguntas Telcel 3' },
                  { key: 'lenguajeFrances', label: 'Preguntas Francés' },
                  { key: 'quiz_web_dev', label: 'Preguntas Web Dev 1' },
                  { key: 'quiz_web_dev2', label: 'Preguntas Web Dev 2' },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    className="bg-indigo-600 hover:bg-indigo-700 py-3 px-4 rounded shadow-md transition transform hover:scale-105 w-full"
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

          {/* Botón ajustes */}
          {!showMenu && (
            <button
              className="fixed bottom-4 right-4 text-4xl bg-gray-700 p-2 rounded-full shadow-lg"
              onClick={() => setShowMenu(true)}
            >
              ⚙️
            </button>
          )}

          {/* Mensaje en móvil fullscreen */}
          {!showMenu && window.innerWidth < 768 && (
            <div className="fixed bottom-16 bg-black/70 text-white px-4 py-2 rounded-md text-sm">
              👉 Desliza hacia atrás o usa el botón para salir de pantalla completa
            </div>
          )}

          {/* Resultados de búsqueda */}
          {searchResults.length > 0 && (
            <div className="bg-gray-800 p-6 rounded shadow-md w-full max-w-3xl mt-4">
              <h2 className="text-lg font-semibold mb-3">Resultados de búsqueda:</h2>
              {searchResults.map((q, i) => (
                <p key={i} className="text-sm text-gray-300 my-1">
                  {q['Question Text']} →{' '}
                  <span className="text-green-400">{q['Correct Answer']}</span>
                </p>
              ))}
              <button
                onClick={handleBackToQuiz}
                className="mt-3 bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
              >
                Volver al quiz
              </button>
            </div>
          )}

          {/* Quiz */}
          {!showMenu && !showResult && searchResults.length === 0 && questions.length > 0 && (
            <div className="bg-gray-800 p-6 rounded shadow-md w-full max-w-3xl text-center">
              <p className="text-xl font-semibold mb-6">
                {questions[currentQuestionIndex]['Question Text']}
              </p>

              {showOnlyCorrect ? (
                <p className="text-green-400 font-bold text-lg">
                  ✅ {questions[currentQuestionIndex]['Correct Answer']}
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {questions[currentQuestionIndex]['options'].map((option) => (
                    <button
                      key={uuidv4()}
                      onClick={() => handleAnswerSelect(option)}
                      className={`py-3 px-4 min-h-[60px] flex items-center justify-center rounded text-lg transition ${
                        selectedAnswer === option
                          ? 'bg-orange-500 hover:bg-orange-600'
                          : 'bg-blue-700 hover:bg-blue-800'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              {/* Botón mostrar solo la correcta */}
              <button
                onClick={() => setShowOnlyCorrect(!showOnlyCorrect)}
                className="mt-4 text-sm text-white bg-gray-600 px-3 py-1 rounded hover:bg-gray-700"
              >
                {showOnlyCorrect ? 'Ocultar respuesta correcta' : 'Mostrar solo la correcta'}
              </button>

              {showCorrect && (
                <div className="text-green-500 mt-4 text-lg">¡Bien hecho!</div>
              )}

              {currentQuestionIndex > 0 && selectedAnswer && (
                <small className="block mt-6 text-gray-400 text-sm">
                  <span className="italic">Repasa anterior:</span><br/>
                  <span className="text-gray-300">{questions[currentQuestionIndex - 1]['Question Text']}</span><br/>
                  <span className="text-green-400">→ {selectedAnswer}</span>
                </small>
              )}
            </div>
          )}

          {/* Resultado */}
          {showResult && (
            <div className="bg-gray-800 p-6 rounded shadow-md text-center">
              <h1 className="text-2xl font-semibold">Resultado</h1>
              <p className="text-lg my-2">Tu puntaje: {score}</p>
              <button
                onClick={handleRestartQuiz}
                className="bg-green-600 hover:bg-green-700 py-2 px-4 rounded"
              >
                Reiniciar Quiz
              </button>

              {incorrectQuestions.length > 0 && (
                <>
                  <button
                    onClick={handleStartMiniQuiz}
                    className="bg-yellow-600 hover:bg-yellow-700 py-2 px-4 rounded ml-2"
                  >
                    Repetir con incorrectas
                  </button>
                  <button
                    onClick={handleGenerateJson}
                    className="bg-indigo-600 hover:bg-indigo-700 py-2 px-4 rounded ml-2"
                  >
                    Descargar incorrectas (.json)
                  </button>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default QuizApp;
