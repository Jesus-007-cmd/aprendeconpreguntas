import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

function MiniQuiz({ onBackToMain }) {
  const storedIncorrectQuestions =
    JSON.parse(localStorage.getItem('incorrectQuestions')) || [];

  // ❌ Antes: const [questions, setQuestions] = useState(storedIncorrectQuestions);
  // ✅ Ahora: solo usamos questions
  const [questions] = useState(storedIncorrectQuestions);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showCorrect, setShowCorrect] = useState(false);

  const handleAnswerSelect = (option) => {
    const currentQuestion = questions[currentQuestionIndex];

    if (option === currentQuestion['Correct Answer']) {
      setSelectedAnswer(option);
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
      setSelectedAnswer(option);
    }
  };

  const handleRestartMiniQuiz = () => {
    setScore(0);
    setCurrentQuestionIndex(0);
    setShowResult(false);
    setSelectedAnswer(null);
    // ✅ Ya no necesitamos llamar a setQuestions
  };

  if (questions.length === 0) {
    return (
      <div className="bg-gray-800 p-6 rounded shadow-md text-center">
        <h1 className="text-xl font-semibold">No hay incorrectas guardadas</h1>
        <button
          onClick={onBackToMain}
          className="bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded mt-4"
        >
          Volver al Quiz principal
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6 flex flex-col items-center">
      {!showResult ? (
        <div className="bg-gray-800 p-6 rounded shadow-md w-full max-w-3xl text-center">
          <p className="text-gray-400 text-sm mb-1">
            Mini Quiz – Pregunta {currentQuestionIndex + 1} de {questions.length}
          </p>
          <p className="text-xl font-semibold mb-6">
            {questions[currentQuestionIndex]['Question Text']}
          </p>

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

          {showCorrect && (
            <div className="text-green-500 mt-4 text-lg">¡Bien hecho!</div>
          )}
        </div>
      ) : (
        <div className="bg-gray-800 p-6 rounded shadow-md text-center">
          <h1 className="text-2xl font-semibold">Resultado Mini Quiz</h1>
          <p className="text-lg my-2">Tu puntaje: {score}</p>

          <button
            onClick={handleRestartMiniQuiz}
            className="bg-green-600 hover:bg-green-700 py-2 px-4 rounded mr-2"
          >
            Reintentar Mini Quiz
          </button>

          <button
            onClick={onBackToMain}
            className="bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded ml-2"
          >
            Volver al Quiz principal
          </button>
        </div>
      )}
    </div>
  );
}

export default MiniQuiz;
