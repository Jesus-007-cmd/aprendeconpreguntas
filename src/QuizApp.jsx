// QuizApp.js
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './QuizApp.css';
import questionsData from './data/preguntastelcel2.json';
import Bar from './Bar';

function QuizApp() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showCorrect, setShowCorrect] = useState(false);
  const [incorrectQuestions, setIncorrectQuestions] = useState([]);

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
      }, 500);
    } else {
      setIncorrectQuestions([...incorrectQuestions, currentQuestion]);
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
    const incorrectQuestions = JSON.parse(localStorage.getItem('incorrectQuestions')) || [];
    const jsonContent = JSON.stringify(incorrectQuestions, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'incorrect_questions.json';
    link.click();
  };
  return (
    <div className="quiz-container">
      <Bar incorrectQuestions={incorrectQuestions} />
      {!showResult ? (
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
                >
                  {option}
                </button>
              ))}
              {showCorrect && <div><p className="correct">¡Bien hecho!</p></div>}
            </div>
          )}
        </div>
      ) : (
        <div className="result-container">
          <h1>Result</h1>
          <p>Your Score: {score}</p>
          <button onClick={handleRestartQuiz}>Restart Quiz</button>
        </div>
      )}
    </div>
  );
}

export default QuizApp;
