import React, { useState } from "react";
import "./FrenchPracticeExercise.css";

// Función para reproducir la pronunciación en francés
const playAudio = (text, lang = "fr-FR") => {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);

  const findVoice = () => {
    const voices = synth.getVoices();
    const frenchVoice = voices.find((voice) => voice.lang === lang);

    if (frenchVoice) {
      utterance.voice = frenchVoice;
      utterance.lang = lang;
      synth.speak(utterance);
    } else {
      console.error("No se encontró una voz en francés.");
    }
  };

  if (!synth.getVoices().length) {
    synth.onvoiceschanged = findVoice;
  } else {
    findVoice();
  }
};

const FrenchPracticeExercise = () => {
  const [answers, setAnswers] = useState({
    hello: "",
    goodMorning: "",
    goodAfternoon: "",
    goodNight: "",
    goodbye: "",
    howAreYou: "",
  });

  const [showCorrectAnswers, setShowCorrectAnswers] = useState(false);
  const [verifyLabel, setVerifyLabel] = useState("Verificar Respuestas");
  const [results, setResults] = useState({
    hello: null,
    goodMorning: null,
    goodAfternoon: null,
    goodNight: null,
    goodbye: null,
    howAreYou: null,
  });
  const [showAccentHelp, setShowAccentHelp] = useState(false); // Estado para mostrar/ocultar la ayuda de acentos

  const [selectedDialect, setSelectedDialect] = useState("fr-FR"); // Dialecto seleccionado

  const correctAnswers = {
    hello: "Bonjour",
    goodMorning: "Bonjour",
    goodAfternoon: "Bon après-midi",
    goodNight: "Bonne nuit",
    goodbye: "Au revoir",
    howAreYou: "Comment ça va?",
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [name]: value,
    }));
  };

  // Verifica las respuestas
  const handleVerify = () => {
    if (verifyLabel === "Eliminar") {
      setAnswers({
        hello: "",
        goodMorning: "",
        goodAfternoon: "",
        goodNight: "",
        goodbye: "",
        howAreYou: "",
      });
      setResults({
        hello: null,
        goodMorning: null,
        goodAfternoon: null,
        goodNight: null,
        goodbye: null,
        howAreYou: null,
      });
      setVerifyLabel("Verificar Respuestas");
    } else {
      const newResults = {};
      Object.keys(answers).forEach((key) => {
        newResults[key] =
          answers[key].trim().toLowerCase() ===
          correctAnswers[key].toLowerCase();
      });
      setResults(newResults);
      setVerifyLabel("Eliminar");
    }
  };

  const handleShowCorrectAnswers = () => {
    setShowCorrectAnswers(!showCorrectAnswers);
  };

  const handlePlayAudio = (text) => {
    playAudio(text, selectedDialect);
  };

  const handleDialectChange = (e) => {
    setSelectedDialect(e.target.value);
  };

  return (
    <div className="french-practice-exercise">
      <h2>Práctica de Frases en Francés</h2>
      <div className="accent-help-container">
        {/* Checkbox para mostrar/ocultar la ayuda de acentos */}
        <div className="checkbox-container">
          <input
            type="checkbox"
            id="accentHelpCheckbox"
            checked={showAccentHelp}
            onChange={(e) => setShowAccentHelp(e.target.checked)}
          />
          <label htmlFor="accentHelpCheckbox">Ayuda con acentos</label>
        </div>

        {/* Mostrar la ayuda de acentos si el checkbox está activado */}
        {showAccentHelp && (
          <div className="accent-instructions">
            <p>
              <strong>
                Instrucciones para escribir caracteres con acento en francés:
              </strong>
            </p>
            
              <p >
                Para escribir la letra "é": presiona <kbd>Alt</kbd> +{" "}
                <kbd>130</kbd> o <kbd>Alt</kbd> + <kbd>0233</kbd> (en teclado
                numérico).
              </p>
              <p>
                Para escribir la letra "è": presiona <kbd>Alt</kbd> +{" "}
                <kbd>138</kbd> o <kbd>Alt</kbd> + <kbd>0232</kbd>.
              </p>
              <p>
                Para escribir la letra "ê": presiona <kbd>Alt</kbd> +{" "}
                <kbd>136</kbd> o <kbd>Alt</kbd> + <kbd>0234</kbd>.
              </p>
              <p>
                Para escribir la letra "ç": presiona <kbd>Alt</kbd> +{" "}
                <kbd>135</kbd> o <kbd>Alt</kbd> + <kbd>0231</kbd>.
              </p>
              <p>
                Para escribir la letra "à": presiona <kbd>Alt</kbd> +{" "}
                <kbd>133</kbd> o <kbd>Alt</kbd> + <kbd>0224</kbd>.
              </p>
            
            <p>
              En teclados Mac, usa la combinación <kbd>Option</kbd> +{" "}
              <kbd>e</kbd> para los acentos agudos (´), <kbd>Option</kbd> +{" "}
              <kbd>u</kbd> para la diéresis (¨), o <kbd>Option</kbd> +{" "}
              <kbd>c</kbd> para "ç".
            </p>
          </div>
        )}
      </div>
      <p>Escribe en francés las siguientes frases:</p>

      <div className="dialect-selector">
        <label>Selecciona el dialecto:</label>
        <select value={selectedDialect} onChange={handleDialectChange}>
          <option value="fr-FR">Francés (Francia)</option>
          <option value="fr-CA">Francés (Canadiense)</option>
        </select>
      </div>

      <div className="exercise-container">
        <div className="questions">
          <div className="question-item">
            <label>Hola</label>
            <input
              type="text"
              name="hello"
              value={answers.hello}
              onChange={handleInputChange}
            />
            {results.hello !== null && (
              <span>{results.hello ? "✔️" : "❌"}</span>
            )}
          </div>

          <div className="question-item">
            <label>Buenos Días</label>
            <input
              type="text"
              name="goodMorning"
              value={answers.goodMorning}
              onChange={handleInputChange}
            />
            {results.goodMorning !== null && (
              <span>{results.goodMorning ? "✔️" : "❌"}</span>
            )}
          </div>

          <div className="question-item">
            <label>Buenas Tardes</label>
            <input
              type="text"
              name="goodAfternoon"
              value={answers.goodAfternoon}
              onChange={handleInputChange}
            />
            {results.goodAfternoon !== null && (
              <span>{results.goodAfternoon ? "✔️" : "❌"}</span>
            )}
          </div>

          <div className="question-item">
            <label>Buenas Noches</label>
            <input
              type="text"
              name="goodNight"
              value={answers.goodNight}
              onChange={handleInputChange}
            />
            {results.goodNight !== null && (
              <span>{results.goodNight ? "✔️" : "❌"}</span>
            )}
          </div>

          <div className="question-item">
            <label>Adiós</label>
            <input
              type="text"
              name="goodbye"
              value={answers.goodbye}
              onChange={handleInputChange}
            />
            {results.goodbye !== null && (
              <span>{results.goodbye ? "✔️" : "❌"}</span>
            )}
          </div>

          <div className="question-item">
            <label>¿Cómo Estás?</label>
            <input
              type="text"
              name="howAreYou"
              value={answers.howAreYou}
              onChange={handleInputChange}
            />
            {results.howAreYou !== null && (
              <span>{results.howAreYou ? "✔️" : "❌"}</span>
            )}
          </div>
        </div>
        <div className="buttons">
          <button onClick={handleVerify}>{verifyLabel}</button>
          <button onClick={handleShowCorrectAnswers}>
            {showCorrectAnswers ? "Ocultar Respuestas" : "Ver Respuestas"}
          </button>
        </div>
        {/* Mostrar respuestas correctas con pronunciación */}
        {showCorrectAnswers && (
          <div className="answers">
            <h3>Respuestas Correctas:</h3>
            <p>
              Hola: {correctAnswers.hello} (Pronunciación: bon-zhoor)
              <button onClick={() => handlePlayAudio(correctAnswers.hello)}>
                🔊
              </button>
            </p>
            <p>
              Buenos días: {correctAnswers.goodMorning} (Pronunciación:
              bon-zhoor)
              <button
                onClick={() => handlePlayAudio(correctAnswers.goodMorning)}
              >
                🔊
              </button>
            </p>
            <p>
              Buenas tardes: {correctAnswers.goodAfternoon} (Pronunciación: bon
              ap-reh-mee-dee)
              <button
                onClick={() => handlePlayAudio(correctAnswers.goodAfternoon)}
              >
                🔊
              </button>
            </p>
            <p>
              Buenas noches: {correctAnswers.goodNight} (Pronunciación:
              bon-nwee)
              <button onClick={() => handlePlayAudio(correctAnswers.goodNight)}>
                🔊
              </button>
            </p>
            <p>
              Adiós: {correctAnswers.goodbye} (Pronunciación: o ruh-vwar)
              <button onClick={() => handlePlayAudio(correctAnswers.goodbye)}>
                🔊
              </button>
            </p>
            <p>
              ¿Cómo estás?: {correctAnswers.howAreYou} (Pronunciación: koh-mon
              sah vah)
              <button onClick={() => handlePlayAudio(correctAnswers.howAreYou)}>
                🔊
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FrenchPracticeExercise;
