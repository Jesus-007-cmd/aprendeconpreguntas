import React from 'react';

const Question = ({ question, onAnswer }) => {
  const handleAnswer = (answer) => {
    const isCorrect = answer === question["Correct Answer"];
    onAnswer(isCorrect);
  };

  return (
    <div>
      <h2>{question["Question Text"]}</h2>
      {question.options.map((option, index) => (
        <button key={index} onClick={() => handleAnswer(option)}>
          {option}
        </button>
      ))}
    </div>
  );
};

export default Question;
