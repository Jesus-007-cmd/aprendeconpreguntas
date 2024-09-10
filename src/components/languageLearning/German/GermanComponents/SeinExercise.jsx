import React, { useState } from 'react';

// Función para reproducir la pronunciación
const playAudio = (text) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'de-DE';
  window.speechSynthesis.speak(utterance);
};

const SeinExercise = () => {
  // Estados para las respuestas, explicaciones y traducciones
  const [showAnswers, setShowAnswers] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const sentences = [
    {
      text: "Heute ____ Sonntag.",
      answer: "ist",
      fullSentence: "Heute ist Sonntag.",
      pronunciation: "Heute ist Sonntag",
      explanation: "En esta oración usamos 'ist' (es) porque estamos hablando de 'hoy' (hoy es domingo).",
      translation: "Hoy es domingo."
    },
    {
      text: "Ich ____ 21 Jahre alt.",
      answer: "bin",
      fullSentence: "Ich bin 21 Jahre alt.",
      pronunciation: "Ich bin einundzwanzig Jahre alt",
      explanation: "'Bin' es la forma correcta del verbo 'sein' para 'yo'. Significa 'yo soy' o 'yo tengo' en esta frase.",
      translation: "Yo tengo 21 años."
    },
    {
      text: "Er ____ 22 Jahre alt.",
      answer: "ist",
      fullSentence: "Er ist 22 Jahre alt.",
      pronunciation: "Er ist zweiundzwanzig Jahre alt",
      explanation: "'Ist' es la forma correcta para 'él', 'ella' o 'ello'.",
      translation: "Él tiene 22 años."
    },
    {
      text: "Sie ____ groß und stark.",
      answer: "ist",
      fullSentence: "Sie ist groß und stark.",
      pronunciation: "Sie ist groß und stark",
      explanation: "'Ist' es la forma correcta del verbo para 'ella'.",
      translation: "Ella es alta y fuerte."
    },
    {
      text: "Wir ____ alle guten Menschen.",
      answer: "sind",
      fullSentence: "Wir sind alle guten Menschen.",
      pronunciation: "Wir sind alle guten Menschen",
      explanation: "'Sind' es la forma correcta del verbo 'sein' para 'nosotros'.",
      translation: "Nosotros somos todas buenas personas."
    }
  ];

  return (
    <div className="sein-exercise">
      <h2>Ejercicio del Verbo Sein</h2>

      {sentences.map((sentence, index) => (
        <div key={index} className="sentence">
          <p>
            {sentence.text.replace("____", showAnswers ? sentence.answer : "____")}
          </p>

          {/* Botón para escuchar la pronunciación */}
          <button onClick={() => playAudio(sentence.pronunciation)}>
            Escuchar Pronunciación
          </button>

          {/* Botón para mostrar la respuesta correcta */}
          <button onClick={() => setShowAnswers(true)}>
            Mostrar Respuesta Correcta
          </button>

          {/* Botón para mostrar la explicación y traducción */}
          <button onClick={() => setShowExplanation(index)}>
            Mostrar Explicación
          </button>

          {/* Mostrar explicación y traducción si está seleccionado */}
          {showExplanation === index && (
            <div className="explanation">
              <p><strong>Explicación:</strong> {sentence.explanation}</p>
              <p><strong>Traducción:</strong> {sentence.translation}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SeinExercise;

