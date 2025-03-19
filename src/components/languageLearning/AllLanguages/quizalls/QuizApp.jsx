import React, { useState, useEffect, useRef, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import "./QuizApp.css";
import germanSpanishQuestions from "./questions/german-spanish-questions.json";
import spanishGermanQuestions from "./questions/spanish-german.questions.json";
import spanishFrenchQuestions from "./questions/spanish-french.questions.json";
import spanishJapaneseQuestions from "./questions/spanish-japanese.questions.json";
import spanishItalianQuestions from "./questions/spanish-italian.questions.json";
import spanishPortugueseQuestions from "./questions/spanish-portuguese.questions.json";

import germanSpanishQuestions190 from "./questions/German-Spanish.json";
import spanishGermanQuestions190 from "./questions/Articles-Spanish-to-German.json";
import spanishFrenchQuestions190 from "./questions/Articles-Spanish-to-French.json";
import spanishJapaneseQuestions190 from "./questions/Japanese-Spanish.json";
import spanishItalianQuestions190 from "./questions/Articles-Spanish-to-Italian.json";
import spanishPortugueseQuestions190 from "./questions/Articles-Spanish-to-Portuguese.json";
import englishSpanishQuestions190 from "./questions/Articles-Spanish-to-English.json";
import frenchSpanishQuestions190 from "./questions/Articles-French-Spanish.json";

import italianSpanishQuestions190 from "./questions/Italian-Spanish.json";
import expanded_plural_singular_italian_quiz from "./questions/expanded_plural_singular_italian_quiz.json"

import portugueseSpanishQuestions190 from "./questions/Articles-Portuguese-Spanish.json";
import portuguese_phrases_questions from "./questions/portuguese_phrases_questions_final.json";
import portuguese_verbs_full_questions from "./questions/portuguese_verbs_full_questions.json";

import chineseSpanishQuestions190 from "./questions/Chinese-Spanish.json"; // Si es necesario

import articlesGermanSpanish190 from "./questions/Articles-German-Spanish.json";
import articlesPortugueseSpanish190 from "./questions/Articles-Portuguese-Spanish.json";
import articlesEnglishSpanish190 from "./questions/Articles-English-Spanish.json";
import articlesFrenchSpanish190 from "./questions/Articles-French-Spanish.json";
import articlesItalianSpanish190 from "./questions/Articles-Italian-Spanish.json";

// De Español a otros idiomas (Artículos)
import articlesSpanishGerman190 from "./questions/Articles-Spanish-to-German.json";
import articlesSpanishPortuguese190 from "./questions/Articles-Spanish-to-Portuguese.json";
import articlesSpanishEnglish190 from "./questions/Articles-Spanish-to-English.json";
import articlesSpanishFrench190 from "./questions/Articles-Spanish-to-French.json";
import articlesSpanishItalian190 from "./questions/Articles-Spanish-to-Italian.json";

import notificationSound from "../../../audio/correctanswer.mp3";

function QuizApp() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showCorrect, setShowCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isJsonSelected, setIsJsonSelected] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false); // Para detectar el estado de pantalla completa
  const [lastKeyPressTime, setLastKeyPressTime] = useState(0); // Tiempo de la última pulsación de tecla
  const quizContainerRef = useRef(null);
  const [responseMode, setResponseMode] = useState(true);
  const [questionLanguage, setQuestionLanguage] = useState("");
  const [responseLanguage, setResponseLanguage] = useState("");
  const [selectedQuestionVoice, setSelectedQuestionVoice] = useState(null); // Guardará la voz para las preguntas
  const [selectedAnswerVoice, setSelectedAnswerVoice] = useState(null); // Guardará la voz para las respuestas
  const [showAnswer, setShowAnswer] = useState(false);

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  // Función para reproducir el audio de la pregunta
  const playQuestionAudio = useCallback(
    (text) => {
      if (!text || !selectedQuestionVoice) return; // Evitar errores si el texto o la voz no están disponibles

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = selectedQuestionVoice; // Usar la voz global seleccionada para preguntas
      utterance.lang = questionLanguage; // Usar el idioma de la voz seleccionada
      window.speechSynthesis.speak(utterance);
    },
    [selectedQuestionVoice, questionLanguage] // Dependencia en la voz seleccionada para las preguntas
  );

  // Función para reproducir el audio de la respuesta
  const playAnswerAudio = useCallback(
    (text) => {
      if (!text || !selectedAnswerVoice) return; // Evitar errores si el texto o la voz no están disponibles

      if (responseLanguage !== "es-US") {
        // Reproduce primero a velocidad lenta
        const slowUtterance = new SpeechSynthesisUtterance(text);
        slowUtterance.voice = selectedAnswerVoice;
        slowUtterance.lang = questionLanguage;
        slowUtterance.rate = 0.7; // Velocidad lenta
        window.speechSynthesis.speak(slowUtterance);
      } else {
        // Comportamiento normal para otros idiomas

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = selectedAnswerVoice;
        utterance.lang = questionLanguage;
        utterance.rate = 1; // Velocidad ajustada
        window.speechSynthesis.speak(utterance);
      }
    },
    [selectedAnswerVoice, responseLanguage, questionLanguage] // Dependencia en la voz seleccionada para las respuestas
  );

  // Efecto para cargar las voces disponibles y asegurarnos de que están cargadas antes de seleccionarlas
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) {
        console.log("Esperando que se carguen las voces...");
        return;
      }
      console.log("Voces cargadas:", voices);
    };

    // Cargar voces cuando cambian
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Cargar voces al inicio
    loadVoices();
  }, []);

  const handleAnswerSelect = useCallback(
    (selectedOption) => {
      const currentQuestion = questions[currentQuestionIndex];
      const correctAnswer =
        currentQuestion.options[currentQuestion.correctAnswer - 1];

      if (selectedOption === correctAnswer) {
        setScore(score + 1);
        setShowCorrect(true);
        playKeyPressSound();
        playAnswerAudio(correctAnswer); // Usar la voz seleccionada globalmente para respuestas
        setTimeout(() => {
          setShowCorrect(false);
          if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
          } else {
            setShowResult(true);
          }
        }, 1000);
      } else {
        setSelectedAnswer(selectedOption);
        playAnswerAudio(selectedOption); // Usar la voz seleccionada globalmente para respuestas
      }
    },
    [questions, currentQuestionIndex, score, playAnswerAudio]
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      const now = Date.now();
      if (now - lastKeyPressTime < 300) {
        return;
      }
      setLastKeyPressTime(now);

      const currentQuestion = questions[currentQuestionIndex];

      if (
        !currentQuestion ||
        !currentQuestion.options ||
        currentQuestion.options.length === 0
      ) {
        return;
      }

      // Presionar 'Enter' para repetir la pregunta
      if (event.key === "Enter" || event.key === "NumpadEnter") {
        playQuestionAudio(currentQuestion.word); // Reproducir el audio de la pregunta
        return;
      }
      if (event.key === "*") {
        handleShowAnswer();

        // Obtener la respuesta correcta
        const correctAnswer =
          currentQuestion.options[currentQuestion.correctAnswer - 1];

        // Reproducir el audio de la respuesta correcta
        playAnswerAudio(correctAnswer);
      }
        // Aquí agregamos la lógica para presionar el 'menos (-)' del teclado numérico
    if (event.key === "-") {
      const correctAnswer =
        currentQuestion.options[currentQuestion.correctAnswer - 1];

      // Selecciona automáticamente la respuesta correcta
      handleAnswerSelect(correctAnswer);
    }
      // Presionar '0' activa el modo de respuesta
      if (event.key === "0") {
        setResponseMode(!responseMode); // Cambiar el modo de respuesta
        playKeyPressSound(); // Reproducir sonido cuando se presione '0'
        return;
      }

      // Si se ha activado el modo de respuesta, permitir seleccionar con '1' a '4'
      if (responseMode && event.key >= "1" && event.key <= "4") {
        const answerIndex = parseInt(event.key) - 1;
        if (answerIndex >= 0 && answerIndex < currentQuestion.options.length) {
          handleAnswerSelect(currentQuestion.options[answerIndex]);
        }
      }

      // Si no se ha activado el modo de respuesta, simplemente reproducir el audio de la opción sin seleccionarla
      if (!responseMode && event.key >= "1" && event.key <= "4") {
        const answerIndex = parseInt(event.key) - 1;
        if (answerIndex >= 0 && answerIndex < currentQuestion.options.length) {
          playAnswerAudio(currentQuestion.options[answerIndex]); // Reproducir el audio de la respuesta
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    questions,
    currentQuestionIndex,
    responseMode,
    handleAnswerSelect,
    playQuestionAudio,
    playAnswerAudio,
    lastKeyPressTime,
  ]);

  // Función para reproducir sonido
  const playKeyPressSound = () => {
    const audio = new Audio(notificationSound);
    audio.volume = 0.5; // Volumen al 50%
    audio.play();
  };

  // Efecto para leer la pregunta cuando cambia la pregunta actual
  useEffect(() => {
    if (questions.length > 0) {
      playQuestionAudio(questions[currentQuestionIndex]?.word); // Reproducir el audio de la pregunta
    }
  }, [currentQuestionIndex, questions, playQuestionAudio]);

  useEffect(() => {
    const handleFullScreenChange = () => {
      if (document.fullscreenElement) {
        setIsFullScreen(true);
      } else {
        setIsFullScreen(false);
      }
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const enterFullScreen = () => {
    if (quizContainerRef.current.requestFullscreen) {
      quizContainerRef.current.requestFullscreen();
    } else if (quizContainerRef.current.webkitRequestFullscreen) {
      quizContainerRef.current.webkitRequestFullscreen();
    } else if (quizContainerRef.current.msRequestFullscreen) {
      quizContainerRef.current.msRequestFullscreen();
    }
  };

  const handleJsonSelection = (jsonFile) => {
    let selectedQuestions = [];
    let selectedQuestionLanguage = "";
    let selectedResponseLanguage = "";
    let questionVoiceToLoad = "";
    let answerVoiceToLoad = "";

    selectedQuestions = jsonFile.questions;
    selectedQuestionLanguage = jsonFile.questionLanguage;
    selectedResponseLanguage = jsonFile.responseLanguage;

    questionVoiceToLoad = selectedQuestionLanguage; // Preguntas en español
    answerVoiceToLoad = selectedResponseLanguage; // Respuestas en alemán

    // Cargar y seleccionar la voz adecuada para preguntas
    const voices = window.speechSynthesis.getVoices();
    const questionVoice = voices.find(
      (voice) => voice.lang === questionVoiceToLoad
    );
    const answerVoice = voices.find(
      (voice) => voice.lang === answerVoiceToLoad
    );

    if (questionVoice && answerVoice) {
      setSelectedQuestionVoice(questionVoice); // Guardar la voz para preguntas
      setSelectedAnswerVoice(answerVoice); // Guardar la voz para respuestas
    } else {
      console.error("No se encontraron voces para los idiomas seleccionados.");
    }

    setQuestions(shuffleArray(selectedQuestions)); // Establecer las preguntas
    setQuestionLanguage(selectedQuestionLanguage); // Establecer el idioma de las preguntas
    setResponseLanguage(selectedResponseLanguage); // Establecer el idioma de las respuestas
    setIsJsonSelected(true); // Marcar que el JSON fue seleccionado
  };

  return (
    <div ref={quizContainerRef} className="quiz-container">
      {!isJsonSelected ? (
        // Pantalla de selección de JSON
        <div className="json-selection">
          <h2>Seleccione el tipo de quiz:</h2>
          <button onClick={() => handleJsonSelection(germanSpanishQuestions)}>
            Alemán a Español
          </button>
          <button onClick={() => handleJsonSelection(spanishGermanQuestions)}>
            Español a Alemán
          </button>
          <button onClick={() => handleJsonSelection(spanishFrenchQuestions)}>
            Español a Francés
          </button>
          <button onClick={() => handleJsonSelection(spanishJapaneseQuestions)}>
            Español a Japones
          </button>
          <button onClick={() => handleJsonSelection(spanishItalianQuestions)}>
            Español a Italiano
          </button>
          <button
            onClick={() => handleJsonSelection(spanishPortugueseQuestions)}
          >
            Español a Portuges
          </button>
          <button
            onClick={() => handleJsonSelection(germanSpanishQuestions190)}
          >
            Alemán a Español (190 preguntas)
          </button>
          <button
            onClick={() => handleJsonSelection(spanishGermanQuestions190)}
          >
            Español a Alemán (190 preguntas)
          </button>
          <button
            onClick={() => handleJsonSelection(spanishFrenchQuestions190)}
          >
            Español a Francés (190 preguntas)
          </button>
          <button
            onClick={() => handleJsonSelection(spanishJapaneseQuestions190)}
          >
            Español a Japonés (190 preguntas)
          </button>
          <button
            onClick={() => handleJsonSelection(spanishItalianQuestions190)}
          >
            Español a Italiano (190 preguntas)
          </button>
          <button
            onClick={() => handleJsonSelection(spanishPortugueseQuestions190)}
          >
            Español a Portugués (190 preguntas)
          </button>
          <button
            onClick={() => handleJsonSelection(englishSpanishQuestions190)}
          >
            Inglés a Español (190 preguntas)
          </button>
          <button
            onClick={() => handleJsonSelection(frenchSpanishQuestions190)}
          >
            Francés a Español (190 preguntas)
          </button>
          <button
            onClick={() => handleJsonSelection(italianSpanishQuestions190)}
          >
            Italiano a Español (190 preguntas)
          </button>
          <button
            onClick={() => handleJsonSelection(expanded_plural_singular_italian_quiz)}
          >
            Italiano a Español (190 preguntas)
          </button>
          
          <button
            onClick={() => handleJsonSelection(portugueseSpanishQuestions190)}
          >
            Portugués a Español (190 preguntas)
          </button>

          {/* Artículos: De otros idiomas a Español */}
          <button onClick={() => handleJsonSelection(articlesGermanSpanish190)}>
            Artículos Alemán a Español (190 preguntas)
          </button>
          <button
            onClick={() => handleJsonSelection(articlesPortugueseSpanish190)}
          >
            Artículos Portugués a Español (190 preguntas)
          </button>
          <button
            onClick={() => handleJsonSelection(articlesEnglishSpanish190)}
          >
            Artículos Inglés a Español (190 preguntas)
          </button>
          <button onClick={() => handleJsonSelection(articlesFrenchSpanish190)}>
            Artículos Francés a Español (190 preguntas)
          </button>
          <button
            onClick={() => handleJsonSelection(articlesItalianSpanish190)}
          >
            Artículos Italiano a Español (190 preguntas)
          </button>

          {/* Artículos: De Español a otros idiomas */}
          <button onClick={() => handleJsonSelection(articlesSpanishGerman190)}>
            Artículos Español a Alemán (190 preguntas)
          </button>
          <button
            onClick={() => handleJsonSelection(articlesSpanishPortuguese190)}
          >
            Artículos Español a Portugués (190 preguntas)
          </button>
          <button
            onClick={() => handleJsonSelection(articlesSpanishEnglish190)}
          >
            Artículos Español a Inglés (190 preguntas)
          </button>
          <button onClick={() => handleJsonSelection(articlesSpanishFrench190)}>
            Artículos Español a Francés (190 preguntas)
          </button>
          <button
            onClick={() => handleJsonSelection(articlesSpanishItalian190)}
          >
            Artículos Español a Italiano (190 preguntas)
          </button>

          <button
            onClick={() => handleJsonSelection(portuguese_phrases_questions)}
          >
            Frases de portugues (clase viernes 27 de septiembre)
          </button>
          <button
            onClick={() => handleJsonSelection(portuguese_verbs_full_questions)}
          >
            Verbos de portugues(español portugues) (clase viernes 27 de septiembre)
          </button>

        </div>




      ) : !showResult && questions.length > 0 ? (
        <div className="question-container">
          <h2>{questions[currentQuestionIndex]?.word}</h2>

          {/* Mostrar la calificación actual */}
          <div className="score">
            Calificación: {score}/{questions.length}
          </div>

          <div className="options-container">
            {questions[currentQuestionIndex]?.options?.map((option, index) => (
              <button
                key={uuidv4()}
                onClick={() => handleAnswerSelect(option)}
                className={selectedAnswer === option ? "selected" : ""}
              >
                {index + 1}. {option}
              </button>
            ))}
          </div>

          {showCorrect && <div className="correct">¡Correcto!</div>}

          {/* Botón para entrar en pantalla completa, solo si no estamos ya en pantalla completa */}
          {!isFullScreen && (
            <button onClick={enterFullScreen} style={{ marginTop: "20px" }}>
              Entrar en pantalla completa
            </button>
          )}
        </div>
      ) : (
        <div className="result-container">
          <h1>Resultado Final</h1>
          <p>
            Tu puntaje es {score}/{questions.length}
          </p>
        </div>
      )}
      <div className="help-container">
        {showAnswer && (
          <div>
            La respuesta correcta es:{" "}
            {
              questions[currentQuestionIndex].options[
                questions[currentQuestionIndex].correctAnswer - 1
              ]
            }
          </div>
        )}

        <h3>Instrucciones</h3>
        <p>
          <div
            className={responseMode ? "response-active" : "response-inactive"}
          >
            {" "}
            {responseMode
              ? "Se ha activado el modo de respuesta"
              : "Presiona 0 para activar el modo de respuesta."}
          </div>
        </p>
        <p>
          Presiona <strong>Enter</strong> para repetir la pregunta.
        </p>
        <p>
          Presiona <strong>*</strong> para mostrar la respuesta de la pregunta.
        </p>
        <p>
          Presiona <strong>-</strong> para contestar la pregunta y pasar a la siguiente.
        </p>
        {/* Botón que alterna entre mostrar y ocultar la respuesta */}
        <button onClick={() => setShowAnswer(!showAnswer)}>
          {showAnswer ? "Ocultar respuesta" : "Mostrar respuesta"}
        </button>
      </div>
    </div>
  );
}

export default QuizApp;
