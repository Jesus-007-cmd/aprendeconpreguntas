import React, { useState } from "react";
import "./GermanPracticeExercise.css";

const GermanPracticeExercise = () => {
  const [answers, setAnswers] = useState({
    ich: "",
    du: "",
    er: "",
    sie: "",
    es: "",
    wir: "",
    ihr: "",
    Sie: "",
    siePlural: "",
  });

  const [results, setResults] = useState({
    ich: null,
    du: null,
    er: null,
    sie: null,
    es: null,
    wir: null,
    ihr: null,
    Sie: null,
    siePlural: null,
  });
  const [showGermanPracticeAnswers, setShowGermanPracticeAnswers] =
    useState(false);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [name]: value,
    }));
  };

  const handleVerify = () => {
    const newResults = {};
    Object.keys(answers).forEach((key) => {
      newResults[key] =
        answers[key].trim().toLowerCase() === correctAnswers[key].toLowerCase();
    });
    setResults(newResults);
  };

// Función para rellenar el campo de texto con la respuesta correcta
const fillCorrectAnswer = (field) => {
    const { answer, pronunciation } = correctAnswers[field];
  
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [field]: answer,
    }));
  
    // Reproduce el audio de la palabra correcta
    playAudio(answer, "de-DE");
  
    // Actualiza el resultado para mostrar la pronunciación
    setResults((prevResults) => ({
      ...prevResults,
      [field]: { correct: true, pronunciation: pronunciation },
    }));
  };
  
  const correctAnswers = {
    ich: { answer: "bin", pronunciation: "bin" },
    du: { answer: "bist", pronunciation: "bist" },
    er: { answer: "ist", pronunciation: "ist" },
    sie: { answer: "ist", pronunciation: "ist" },
    es: { answer: "ist", pronunciation: "ist" },
    wir: { answer: "sind", pronunciation: "zind" },
    ihr: { answer: "seid", pronunciation: "zaid" },
    Sie: { answer: "sind", pronunciation: "zind" },
    siePlural: { answer: "sind", pronunciation: "zind" },
  };
  const playAudio = (text, lang = "de-DE") => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
  
    const findVoice = () => {
      const voices = synth.getVoices();
      const germanVoice = voices.find((voice) => voice.lang === lang);
  
      if (germanVoice) {
        utterance.voice = germanVoice;
        utterance.lang = lang;
        synth.speak(utterance);
      } else {
        console.error("No se encontró una voz en alemán.");
      }
    };
  
    if (!synth.getVoices().length) {
      synth.onvoiceschanged = findVoice;
    } else {
      findVoice();
    }
  };
  
  return (
    <div className="german-practice-exercise">
      <h2>Práctica del Verbo "Sein" en Alemán</h2>
      <p>Completa la tabla con las formas correctas del verbo "sein":</p>

      <div className="exercise-container">
        <div className="questions">
          <div className="question-item">
            <label>Ich</label>
            <input
              type="text"
              name="ich"
              value={answers.ich}
              onChange={handleInputChange}
            />
            {results.ich !== null && <span>{results.ich ? "✔️" : "❌"}</span>}
            {showGermanPracticeAnswers && (<button onClick={() => fillCorrectAnswer("ich")}>
              {correctAnswers.ich}
            </button>)}
          </div>

          <div className="question-item">
            <label>Du</label>
            <input
              type="text"
              name="du"
              value={answers.du}
              onChange={handleInputChange}
            />
            {results.du !== null && <span>{results.du ? "✔️" : "❌"}</span>}
            {showGermanPracticeAnswers && (<button onClick={() => fillCorrectAnswer("du")}>
              {correctAnswers.du}
            </button>)}
          </div>

          <div className="question-item">
            <label>Er</label>
            <input
              type="text"
              name="er"
              value={answers.er}
              onChange={handleInputChange}
            />
            {results.er !== null && <span>{results.er ? "✔️" : "❌"}</span>}
            {showGermanPracticeAnswers && (<button onClick={() => fillCorrectAnswer("er")}>
              {correctAnswers.er}
            </button>)}
          </div>

          <div className="question-item">
            <label>Sie</label>
            <input
              type="text"
              name="sie"
              value={answers.sie}
              onChange={handleInputChange}
            />
            {results.sie !== null && <span>{results.sie ? "✔️" : "❌"}</span>}
            {showGermanPracticeAnswers && (
            <button onClick={() => fillCorrectAnswer("sie")}>
              {correctAnswers.sie}
            </button>)}
          </div>

          <div className="question-item">
            <label>Es</label>
            <input
              type="text"
              name="es"
              value={answers.es}
              onChange={handleInputChange}
            />
            {results.es !== null && <span>{results.es ? "✔️" : "❌"}</span>}
            {showGermanPracticeAnswers && (
            <button onClick={() => fillCorrectAnswer("es")}>
              {correctAnswers.es}
            </button>)}
          </div>

          <div className="question-item">
            <label>Wir</label>
            <input
              type="text"
              name="wir"
              value={answers.wir}
              onChange={handleInputChange}
            />
            {results.wir !== null && <span>{results.wir ? "✔️" : "❌"}</span>}
            {showGermanPracticeAnswers && (
            <button onClick={() => fillCorrectAnswer("wir")}>
              {correctAnswers.wir}
            </button>)}
          </div>

          <div className="question-item">
            <label>Ihr</label>
            <input
              type="text"
              name="ihr"
              value={answers.ihr}
              onChange={handleInputChange}
            />
            {results.ihr !== null && <span>{results.ihr ? "✔️" : "❌"}</span>}
            {showGermanPracticeAnswers && (<button onClick={() => fillCorrectAnswer("ihr")}>
              {correctAnswers.ihr}
            </button>)}
          </div>

          <div className="question-item">
            <label>Sie (formal)</label>
            <input
              type="text"
              name="Sie"
              value={answers.Sie}
              onChange={handleInputChange}
            />
            {results.Sie !== null && <span>{results.Sie ? "✔️" : "❌"}</span>}
            {showGermanPracticeAnswers && (
            <button onClick={() => fillCorrectAnswer("Sie")}>
              {correctAnswers.Sie}
            </button>)}
          </div>

          <div className="question-item">
            <label>sie (plural)</label>
            <input
              type="text"
              name="siePlural"
              value={answers.siePlural}
              onChange={handleInputChange}
            />
            {results.siePlural !== null && (
              <span>{results.siePlural ? "✔️" : "❌"}</span>
            )}
            {showGermanPracticeAnswers && (
              <button onClick={() => fillCorrectAnswer("siePlural")}>
                {correctAnswers.siePlural}
              </button>
            )}
          </div>
        </div>
        <div className="buttons">
          <button
            onClick={() =>
              setShowGermanPracticeAnswers(!showGermanPracticeAnswers)
            }
          >
            {showGermanPracticeAnswers
              ? "Ocultar Respuestas"
              : "Ver Respuestas"}
          </button>

          <div className="buttons">
            <button onClick={handleVerify}>Verificar Respuestas</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GermanPracticeExercise;
