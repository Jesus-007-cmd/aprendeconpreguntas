import React, { useState } from 'react';

// Función para reproducir la pronunciación en francés
const playAudio = (text, lang = 'fr-FR') => {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  const voices = synth.getVoices();
  const frenchVoice = voices.find(voice => voice.lang === lang);

  if (frenchVoice) {
    utterance.voice = frenchVoice;
    synth.speak(utterance);
  } else {
    console.error('No se encontró una voz en francés.');
  }
};

const FrenchPracticeExercise = () => {
  const [answers, setAnswers] = useState({});
  const [showAnswers, setShowAnswers] = useState(false);
  const [feedback, setFeedback] = useState({});
  const [selectedVoice, setSelectedVoice] = useState('fr-FR');

  // Preguntas y respuestas correctas
  const questions = [
    { question: 'Comment dit-on "One" en français ?', correctAnswer: 'Un', pronunciation: 'an', spanish: 'uno' },
    { question: 'Comment dit-on "Two" en français ?', correctAnswer: 'Deux', pronunciation: 'de', spanish: 'dos' },
    { question: 'Comment dit-on "Three" en français ?', correctAnswer: 'Trois', pronunciation: 'trua', spanish: 'tres' },
    // Añadir más preguntas según sea necesario
  ];

  const handleInputChange = (e, index) => {
    const newAnswers = { ...answers, [index]: e.target.value };
    setAnswers(newAnswers);
  };

  const checkAnswers = () => {
    const newFeedback = {};
    questions.forEach((q, index) => {
      newFeedback[index] = answers[index]?.trim().toLowerCase() === q.correctAnswer.toLowerCase()
        ? 'Correcto'
        : `Incorrecto, la respuesta es ${q.correctAnswer}`;
    });
    setFeedback(newFeedback);
  };

  const revealAnswers = () => {
    setShowAnswers(true);
  };

  const handleVoiceChange = (e) => {
    setSelectedVoice(e.target.value);
  };

  return (
    <div className="french-practice-exercise">
      <h2>Ejercicio de práctica de francés</h2>
      <p>Escribe la respuesta en francés para cada pregunta. Luego, verifica tus respuestas o revela las respuestas correctas.</p>

      {/* Opción para seleccionar el tipo de francés */}
      <div>
        <label>Elige el tipo de francés:</label>
        <select value={selectedVoice} onChange={handleVoiceChange}>
          <option value="fr-FR">Francés de Francia</option>
          <option value="fr-CA">Francés de Canadá</option>
          {/* Puedes agregar más opciones si hay otros dialectos */}
        </select>
      </div>

      {questions.map((q, index) => (
        <div key={index} className="question-block">
          <p>{q.question}</p>
          <input
            type="text"
            value={answers[index] || ''}
            onChange={(e) => handleInputChange(e, index)}
          />
          {feedback[index] && <p>{feedback[index]}</p>}
        </div>
      ))}

      <button onClick={checkAnswers}>Verificar respuestas</button>
      <button onClick={revealAnswers}>Ver respuestas</button>

      {showAnswers && (
        <div className="answers-reveal">
          <h3>Respuestas Correctas</h3>
          {questions.map((q, index) => (
            <div key={index} className="answer-block">
              <p>
                <strong>{q.correctAnswer}</strong> (se pronuncia como <em>{q.pronunciation}</em> y en español es <em>{q.spanish}</em>)
              </p>
              <button onClick={() => playAudio(q.correctAnswer, selectedVoice)}>Escuchar pronunciación</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FrenchPracticeExercise;
