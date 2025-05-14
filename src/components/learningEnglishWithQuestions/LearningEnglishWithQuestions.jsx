import React, { useState, useEffect, useRef, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

import quizLearingEnglish from "./data/phrasesToLearn.json";
import notificationSound from "../audio/correctanswer.mp3";
export default function LearningEnglishWithQuestions() {
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
  const [showExplanation, setShowExplanation] = useState(false);
  const [showSpanishTranslation, setShowSpanishTranslation] = useState(false);

  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [readQuestionsAloud, setReadQuestionsAloud] = useState(true);

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
      if (!text || !selectedAnswerVoice || !readQuestionsAloud) return; // Evitar errores si el texto o la voz no están disponibles

      if (responseLanguage !== "es-US") {
        
        const slowUtterance = new SpeechSynthesisUtterance(text);
        slowUtterance.voice = selectedAnswerVoice;
        slowUtterance.lang = questionLanguage;
        slowUtterance.rate = 1; // Velocidad normal, si se requiere mas lenta menos de uno poner decimales si se requiere mas rapida mas de 1
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
    [selectedAnswerVoice, responseLanguage, questionLanguage, readQuestionsAloud] // Dependencia en la voz seleccionada para las respuestas
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
      if (event.key === "Enter" || event.key === "NumpadEnter" ) {
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
    if (questions.length > 0 && readQuestionsAloud) {
      playQuestionAudio(questions[currentQuestionIndex]?.word); // Reproducir el audio de la pregunta
    }
  }, [currentQuestionIndex, questions, playQuestionAudio, readQuestionsAloud]);

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

  // Función que maneja la carga y adaptación del JSON para preguntas técnicas (nuevo formato)
  const handleJsonSelection = (jsonFile) => {
    const language = selectedLanguage; 
    
    const adaptedQuestions = jsonFile.Questions.map((question) => {
      const lang = selectedLanguage;
      const altLang = lang === "en-US" ? "es-MX" : "en-US";
    
      const rndmQuestion = Math.floor(Math.random() * question["Question Text"][lang].length);
      const questionText = question["Question Text"][lang][rndmQuestion];
      const answerOptions = shuffleArray([...question.Options[altLang]]);
      const correctAnswer = question["Correct Answer"][altLang];
      const explanation = question["Explanation"][altLang];
    
      return {
        word: questionText,
        options: answerOptions,
        correctAnswer: answerOptions.indexOf(correctAnswer) + 1,
        explanation,
        category: question.Category,
        word_es: question["Question Text"]["es-MX"]?.[rndmQuestion] ?? "Sin traducción",
        options_es: question["Options"]["es-MX"] ?? [],
        explanation_es: question["Explanation"]["es-MX"] ?? []
      };
    });
    

    setQuestions(adaptedQuestions);
    setQuestionLanguage(language);
    setResponseLanguage(selectedLanguage === "en-US" ? "es-MX" : "en-US"); 
    setIsJsonSelected(true);

    // 🔊 Aquí seleccionamos las voces según el idioma elegido:
    const voices = window.speechSynthesis.getVoices();

    const questionVoice =
    voices.find((v) => v.lang === language && v.name.includes("Google")) ||
    voices.find((v) => v.lang === language);
  const answerVoice =
    voices.find((v) => v.lang === language && v.name.includes("Google")) ||
    voices.find((v) => v.lang === language);

    setSelectedQuestionVoice(questionVoice);
    setSelectedAnswerVoice(answerVoice);
  };
  const speakExplanation = (explanationArray) => {
    if (!explanationArray || !selectedAnswerVoice) return;

    explanationArray.forEach((item) => {
      if (item.type === "text" || item.type === "title-h2") {
        const utterance = new SpeechSynthesisUtterance(item.content);
        utterance.voice = selectedAnswerVoice;
        utterance.lang = questionLanguage;
        utterance.rate = 1;
        window.speechSynthesis.speak(utterance);
      }
    });
  };

  return (
    
    <div ref={quizContainerRef} className="min-h-screen bg-[#121212] text-white px-4 py-6 flex flex-col items-center">




      <h1 className="text-2xl font-bold text-center mb-6">
        
      </h1>
      {!selectedLanguage ? (
<div className="flex flex-col items-center gap-4 mb-10">
  <h2 className="text-xl font-semibold mb-2">Seleccione el idioma del quiz:</h2>
  <button
    onClick={() => setSelectedLanguage("en-US")}
    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded shadow"
  >
    Inglés
  </button>
  <button
    onClick={() => setSelectedLanguage("es-MX")}
    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded shadow"
  >
    Español
  </button>
</div>
      ) :!isJsonSelected ? (
        // Pantalla de selección de JSON
        <div className="flex flex-col items-center gap-4 mb-10">
          <h2 className="text-xl font-semibold mb-2">
            Seleccione el tipo de quiz:
          </h2>
        
          <button
            onClick={() => handleJsonSelection(quizLearingEnglish)}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded shadow"
          >
           {quizLearingEnglish["Quiz Title"]}
          </button>
          
        </div>
      ) : !showResult && questions.length > 0 ? (
        
       
<div className="flex flex-col  justify-between gap-6 w-full max-w-10xl">
          {/* 🟦 Sección original en inglés */}
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 w-full max-w-7xl mx-auto">

          <div
  className={`bg-[#1e1e1e] p-4 rounded shadow transition-all duration-300  ${
      !showExplanation && !showSpanishTranslation
        ? 'md:col-span-7'
        : showExplanation && !showSpanishTranslation
        ? 'md:col-span-3'
        : !showExplanation && showSpanishTranslation
        ? 'md:col-span-3'
        : 'md:col-span-2'
    }`}
>



               
            <h2 className="text-xl font-semibold mb-4">
              {questions[currentQuestionIndex]?.word}
            </h2>

            <div className="text-sm mb-4">
              <span className="text-gray-300">Calificación:</span> {score}/
              {questions.length}
            </div>

            <div className="flex flex-col items-center gap-3">
              {questions[currentQuestionIndex]?.options?.map(
                (option, index) => (
                  <button
                    key={uuidv4()}
                    onClick={() => handleAnswerSelect(option)}
                    className={`w-full max-w-md py-2 px-4 rounded text-white text-lg shadow transition-all ${
                      selectedAnswer === option
                        ? "bg-orange-600"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {index + 1}. {option}
                  </button>
                )
              )}
            </div>
            </div>
            <div className={`bg-[#1e1e1e] p-4 rounded shadow transition-all duration-300 ${showExplanation ? 'md:col-span-2' : 'md:col-span-0 hidden'}`}>


            {showExplanation && (
               <div
               className={`bg-[#1e1e1e] p-4 rounded shadow transition-all duration-300 ${
                 showSpanishTranslation ? 'md:col-span-2' : 'md:col-span-4'
               }`}
             >
                <h3 className="font-bold text-lg mb-2">Explicación:</h3>
                <div className="space-y-2 text-left text-gray-200">
                  {questions[currentQuestionIndex]?.explanation?.map(
                    (item, index) => {
                      if (item.type === "text") {
                        return <p key={index}>{item.content}</p>;
                      } else if (item.type === "title-h2") {
                        return (
                          <h2
                            key={index}
                            className="text-xl font-bold text-white"
                          >
                            {item.content}
                          </h2>
                        );
                      } else if (item.type === "link") {
                        return (
                          <a
                            key={index}
                            href={item.content}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 underline"
                          >
                            {item.content}
                          </a>
                        );
                      } else if (item.type === "code") {
                        return (
                          <pre
                            key={index}
                            className="bg-black text-green-400 p-3 rounded overflow-x-auto text-sm"
                          >
                            <code>{item.content}</code>
                          </pre>
                        );
                      } else if (item.type === "ul") {
                        return (
                          <ul key={index} className="list-disc list-inside">
                            {item.items.map((li, i) => (
                              <li key={i}>{li}</li>
                            ))}
                          </ul>
                        );
                      } else if (item.type === "ol") {
                        return (
                          <ol key={index} className="list-decimal list-inside">
                            {item.items.map((li, i) => (
                              <li key={i}>{li}</li>
                            ))}
                          </ol>
                        );
                      } else if (item.type === "image") {
                        return (
                          <img
                            key={index}
                            src={item.src}
                            alt={item.alt || "image"}
                            className="rounded-md border border-gray-700 shadow-md max-w-full"
                          />
                        );
                      } else if (item.type === "divider") {
                        return (
                          <hr key={index} className="border-gray-600 my-4" />
                        );
                      }

                      return null;
                    }
                  )}
                </div>

                <button
                  onClick={() =>
                    speakExplanation(
                      questions[currentQuestionIndex]?.explanation
                    )
                  }
                  className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition duration-300"
                >
                  🔊 Leer explicación en voz alta
                </button>
              </div>
            )}
          
            {showCorrect && (
              <div className="mt-4 text-green-400 font-bold text-xl">
                ¡Correcto!
              </div>
            )}

            {!isFullScreen && (
              <button
                onClick={enterFullScreen}
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
              >
                Entrar en pantalla completa
              </button>
            )}
            </div>
            
            <div className={`bg-[#1e1e1e] p-4 rounded shadow transition-all duration-300 ${showSpanishTranslation ? 'md:col-span-3' : 'md:col-span-0 hidden'}`}>

              {/* 📌 Traducción en español a la derecha */}
          {showSpanishTranslation && (
            <div
            className={`bg-[#1e1e1e] p-4 rounded shadow transition-all duration-300 ${
              showExplanation ? 'md:col-span-3' : 'md:col-span-4'
            }`}
          >
              <h2 className="text-lg font-bold text-white mb-2">
                Pregunta en Español:
              </h2>
              <p className="mb-2 text-gray-300">
                {questions[currentQuestionIndex]?.word_es ?? "Sin traducción"}
              </p>

              <h3 className="text-md font-bold text-white mb-2">Opciones:</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                {questions[currentQuestionIndex]?.options_es?.map(
                  (opt, idx) => (
                    <li key={idx}>{opt}</li>
                  )
                )}
              </ul>

              <h3 className="text-md font-bold text-white mt-4 mb-2">
                Explicación:
              </h3>
              <div className="text-gray-300 space-y-2">
                {Array.isArray(
                  questions[currentQuestionIndex]?.explanation_es
                ) &&
                  questions[currentQuestionIndex].explanation_es.map(
                    (item, index) => {
                      if (item.type === "text") {
                        return <p key={index}>{item.content}</p>;
                      } else if (item.type === "title-h2") {
                        return (
                          <h2
                            key={index}
                            className="text-xl font-bold text-white"
                          >
                            {item.content}
                          </h2>
                        );
                      } else if (item.type === "link") {
                        return (
                          <a
                            key={index}
                            href={item.content}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 underline"
                          >
                            {item.content}
                          </a>
                        );
                      } else if (item.type === "code") {
                        return (
                          <pre
                            key={index}
                            className="bg-black text-green-400 p-3 rounded overflow-x-auto text-sm"
                          >
                            <code>{item.content}</code>
                          </pre>
                        );
                      } else if (item.type === "ul") {
                        return (
                          <ul key={index} className="list-disc list-inside">
                            {item.items.map((li, i) => (
                              <li key={i}>{li}</li>
                            ))}
                          </ul>
                        );
                      } else if (item.type === "ol") {
                        return (
                          <ol key={index} className="list-decimal list-inside">
                            {item.items.map((li, i) => (
                              <li key={i}>{li}</li>
                            ))}
                          </ol>
                        );
                      } else if (item.type === "image") {
                        return (
                          <img
                            key={index}
                            src={item.src}
                            alt={item.alt || "image"}
                            className="rounded-md border border-gray-700 shadow-md max-w-full"
                          />
                        );
                      } else if (item.type === "divider") {
                        return (
                          <hr key={index} className="border-gray-600 my-4" />
                        );
                      }

                      return null;
                    }
                  )}
              </div>
            </div>
          )}
          </div>
          </div>

        
        </div>
      ) : (
        <div className="bg-[#1e1e1e] p-6 rounded-lg shadow-md w-full max-w-2xl text-center">
          <h1 className="text-2xl font-bold mb-4">Resultado Final</h1>
          <p className="text-lg">
            Tu puntaje es {score}/{questions.length}
          </p>
        </div>
      )}

      {/* Instrucciones y respuesta */}
      <div className="mt-10 bg-[#1a1a1a] p-6 rounded-lg shadow-md w-full max-w-2xl text-sm">
        {showAnswer && (
          <div className="mb-4 text-green-400">
            La respuesta correcta es:{" "}
            <strong>
              {
                questions[currentQuestionIndex].options[
                  questions[currentQuestionIndex].correctAnswer - 1
                ]
              }
            </strong>
          </div>
        )}

        <h3 className="text-lg font-bold mb-2 text-center">Instrucciones</h3>
        <div
          className={`mb-2 text-center font-medium ${
            responseMode ? "text-green-400" : "text-yellow-300"
          }`}
        >
          {responseMode
            ? "Presione 0 para desactivar modo de respuesta"
            : "Presiona 0 para activar el modo de respuesta."}
        </div>

        <ul className="list-disc list-inside space-y-1 text-gray-300">
          <li>
            Presiona <strong>Enter</strong> para repetir la pregunta.
          </li>
          <li>
            Presiona <strong>*</strong> para mostrar la respuesta de la
            pregunta.
          </li>
          <li>
            Presiona <strong>-</strong> para contestar la pregunta y pasar a la
            siguiente.
          </li>
        </ul>

        <div className="text-center mt-4">
        <button
  onClick={() => setReadQuestionsAloud(!readQuestionsAloud)}
  className={`mt-4 px-4 py-2 rounded ${
    readQuestionsAloud ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
  }`}
>
  {readQuestionsAloud ? "🔊 Leer preguntas activado" : "🔇 Leer preguntas desactivado"}
</button>
        <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition duration-300"
            >
              {showExplanation ? "Ocultar explicación" : "Explicación"}
            </button>
          <button
            onClick={() => setShowAnswer(!showAnswer)}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded"
          >
            {showAnswer ? "Ocultar respuesta" : "Mostrar respuesta"}
          </button>
          <button
            onClick={() => setShowSpanishTranslation(!showSpanishTranslation)}
            className="mt-4 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded transition duration-300"
          >
            {showSpanishTranslation
              ? "Ocultar traducción"
              : "Mostrar traducción en español"}
          </button>
        </div>
      </div>
    </div>
  );
}
