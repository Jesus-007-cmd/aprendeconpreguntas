import React, { useState, useEffect, useRef, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

import quizData from "./data/react_fundamentals.json";
import quizDatappsmovs from "./data/aplicaciones_moviles_clases.json";
import quizLearingEnglish from "./data/phrasesToLearn.json";
import desarrolloWebFrameworksQuiz from "./data/desarrollo-web-frameworks-quiz.json";
import desarrolloWebMarcosDeTrabajo from "./data/microtest-desarrollo-web-marcos-de-trabajo.json";
import aplicacionesmovilesmultiplataforma from "./data/microtest-aplicaciones_moviles_multiplataforma.json";
import microtestmetodologiasagilesweb from "./data/microtest-metodologias-agiles-web.json";
import guiametodologiasagilesweb from "./data/guia-metodologias-agiles.json";
import notificationSound from "../audio/correctanswer.mp3";

export default function InterviewQuiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showCorrect, setShowCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isJsonSelected, setIsJsonSelected] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [lastKeyPressTime, setLastKeyPressTime] = useState(0);
  const quizContainerRef = useRef(null);
  const [responseMode, setResponseMode] = useState(true);
  const [questionLanguage, setQuestionLanguage] = useState("");
  
  const [selectedQuestionVoice, setSelectedQuestionVoice] = useState(null);
  const [selectedAnswerVoice, setSelectedAnswerVoice] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showSpanishTranslation, setShowSpanishTranslation] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [readQuestionsAloud, setReadQuestionsAloud] = useState(true);

  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [grade, setGrade] = useState(0);

  useEffect(() => {
    const total = correctCount + incorrectCount;
    const pct = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    setGrade(pct);
  }, [correctCount, incorrectCount]);

  const handleShowAnswer = () => setShowAnswer(true);

  // 🔊 Pregunta
  const playQuestionAudio = useCallback(
    (text) => {
      if (!text || !selectedQuestionVoice) return;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = selectedQuestionVoice;
      utterance.lang = questionLanguage;
      window.speechSynthesis.speak(utterance);
    },
    [selectedQuestionVoice, questionLanguage]
  );

  // 🔊 Respuesta
  const playAnswerAudio = useCallback(
    (text) => {
      if (!text || !selectedAnswerVoice || !readQuestionsAloud) return;
      const u = new SpeechSynthesisUtterance(text);
      u.voice = selectedAnswerVoice;
      u.lang = questionLanguage;
      u.rate = 1;
      window.speechSynthesis.speak(u);
    },
    [selectedAnswerVoice, questionLanguage, readQuestionsAloud]
  );

  // Voces disponibles
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) return;
      // console.log("Voces cargadas", voices);
    };
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    loadVoices();
  }, []);

  const handleAnswerSelect = useCallback(
    (selectedOption) => {
      const currentQuestion = questions[currentQuestionIndex];
      const correctAnswer = currentQuestion.options[currentQuestion.correctAnswer - 1];

      if (selectedOption === correctAnswer) {
        setCorrectCount((c) => c + 1);
        setScore((s) => s + 1);
        setShowCorrect(true);
        playKeyPressSound();
        playAnswerAudio(correctAnswer);
        setTimeout(() => {
          setShowCorrect(false);
          setSelectedAnswer(null);
          if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((i) => i + 1);
          } else {
            setShowResult(true);
          }
        }, 1000);
      } else {
        setSelectedAnswer(selectedOption);
        setIncorrectCount((c) => c + 1);
        playAnswerAudio(selectedOption);
      }
    },
    [questions, currentQuestionIndex, playAnswerAudio]
  );

  useEffect(() => setSelectedAnswer(null), [currentQuestionIndex]);

  // ⌨️ Atajos de teclado
  useEffect(() => {
    const handleKeyDown = (event) => {
      const now = Date.now();
      if (now - lastKeyPressTime < 300) return;
      setLastKeyPressTime(now);

      const currentQuestion = questions[currentQuestionIndex];
      if (!currentQuestion || !currentQuestion.options || currentQuestion.options.length === 0) return;

      if (event.key === "Enter" || event.key === "NumpadEnter") {
        playQuestionAudio(currentQuestion.word);
        return;
      }
      if (event.key === "*") {
        handleShowAnswer();
        const correctAnswer = currentQuestion.options[currentQuestion.correctAnswer - 1];
        playAnswerAudio(correctAnswer);
      }
      if (event.key === "-") {
        const correctAnswer = currentQuestion.options[currentQuestion.correctAnswer - 1];
        handleAnswerSelect(correctAnswer);
      }
      if (event.key === "0") {
        setResponseMode((m) => !m);
        playKeyPressSound();
        return;
      }
      if (event.key >= "1" && event.key <= "4") {
        const idx = parseInt(event.key) - 1;
        if (idx < 0 || idx >= currentQuestion.options.length) return;
        if (responseMode) {
          handleAnswerSelect(currentQuestion.options[idx]);
        } else {
          playAnswerAudio(currentQuestion.options[idx]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [questions, currentQuestionIndex, responseMode, handleAnswerSelect, playQuestionAudio, playAnswerAudio, lastKeyPressTime]);

  const playKeyPressSound = () => {
    const audio = new Audio(notificationSound);
    audio.volume = 0.5;
    audio.play();
  };

  // Leer pregunta al cambiar
  useEffect(() => {
    if (questions.length > 0 && readQuestionsAloud) {
      playQuestionAudio(questions[currentQuestionIndex]?.word);
    }
  }, [currentQuestionIndex, questions, playQuestionAudio, readQuestionsAloud]);

  // Fullscreen
  useEffect(() => {
    const handleFullScreenChange = () => setIsFullScreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullScreenChange);
  }, []);

  const enterFullScreen = () => {
    if (!quizContainerRef.current) return;
    const el = quizContainerRef.current;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if (el.msRequestFullscreen) el.msRequestFullscreen();
  };

  const shuffleArray = (array) => array.slice().sort(() => Math.random() - 0.5);

  // Carga/adapta JSON
  const handleJsonSelection = (jsonFile) => {
    const language = selectedLanguage;
    const adapted = jsonFile.Questions.map((q) => {
      const rnd = Math.floor(Math.random() * q["Question Text"][language].length);
      const questionVariant = q["Question Text"][language][rnd];
      const options = shuffleArray([...q.Options[language]]);
      const correctAnswer = q["Correct Answer"][language];
      const explanation = q["Explanation"][language];
      const category = q.Category;
      return {
        word: questionVariant,
        options,
        correctAnswer: options.indexOf(correctAnswer) + 1,
        explanation,
        category,
        // Español paralelo
        word_es: q["Question Text"]["es-MX"]?.[rnd] ?? "Sin traducción",
        options_es: q["Options"]["es-MX"] ?? [],
        explanation_es: q["Explanation"]["es-MX"] ?? [],
      };
    });

    setQuestions(adapted);
    setQuestionLanguage(language);
    setSelectedAnswerVoice(language);
    setIsJsonSelected(true);

    // voces
    const voices = window.speechSynthesis.getVoices();
    const pick = (lang) =>
      voices.find((v) => v.lang === lang && v.name.includes("Google")) ||
      voices.find((v) => v.lang === lang) || null;

    setSelectedQuestionVoice(pick(language));
    setSelectedAnswerVoice(pick(language));
  };

  const speakExplanation = (arr) => {
    if (!arr || !selectedAnswerVoice) return;
    arr.forEach((item) => {
      if (item.type === "text" || item.type === "title-h2") {
        const u = new SpeechSynthesisUtterance(item.content);
        u.voice = selectedAnswerVoice;
        u.lang = questionLanguage;
        u.rate = 1;
        window.speechSynthesis.speak(u);
      }
    });
  };

  // 🧠 Número de paneles activos y clases de grid
  const activePanels = 1 + (showExplanation ? 1 : 0) + (showSpanishTranslation ? 1 : 0);
  const gridColsClass = activePanels === 1
    ? "md:grid-cols-1"
    : activePanels === 2
    ? "md:grid-cols-2"
    : "md:grid-cols-3"; // 3

  return (
    <div ref={quizContainerRef} className="min-h-screen bg-[#121212] text-white px-4 py-6 flex flex-col items-center">
      {/* Idioma */}
      {!selectedLanguage ? (
        <div className="flex flex-col items-center gap-4 mb-10">
          <h2 className="text-xl font-semibold mb-2">Seleccione el idioma del quiz:</h2>
          <button onClick={() => setSelectedLanguage("en-US")} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded shadow">Inglés</button>
          <button onClick={() => setSelectedLanguage("es-MX")} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded shadow">Español</button>
        </div>
      ) : !isJsonSelected ? (
        // Selección de JSON
        <div className="flex flex-col items-center gap-4 mb-10">
          <h2 className="text-xl font-semibold mb-2">Seleccione el tipo de quiz:</h2>
          <button onClick={() => handleJsonSelection(quizData)} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded shadow">{quizData["Quiz Title"]}</button>
          <button onClick={() => handleJsonSelection(quizDatappsmovs)} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded shadow">{quizDatappsmovs["Quiz Title"]}</button>
          <button onClick={() => handleJsonSelection(quizLearingEnglish)} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded shadow">{quizLearingEnglish["Quiz Title"]}</button>
          <button onClick={() => handleJsonSelection(desarrolloWebFrameworksQuiz)} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded shadow">{desarrolloWebFrameworksQuiz["Quiz Title"]}</button>
          <button onClick={() => handleJsonSelection(desarrolloWebMarcosDeTrabajo)} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded shadow">{desarrolloWebMarcosDeTrabajo["Quiz Title"]}</button>
          <button onClick={() => handleJsonSelection(aplicacionesmovilesmultiplataforma)} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded shadow">{aplicacionesmovilesmultiplataforma["Quiz Title"]}</button>
          <button onClick={() => handleJsonSelection(microtestmetodologiasagilesweb)} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded shadow">{microtestmetodologiasagilesweb["Quiz Title"]}</button>
          <button onClick={() => handleJsonSelection(guiametodologiasagilesweb)} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded shadow">{guiametodologiasagilesweb["Quiz Title"]}</button>

          
        </div>
      ) : !showResult && questions.length > 0 ? (
        <>
          {/* 🔳 GRID en 1/2/3 columnas a ancho máximo */}
          <div className={`grid grid-cols-1 ${gridColsClass} gap-4 w-full max-w-screen-2xl mx-auto`}>
            {/* Panel 1: Pregunta + opciones */}
            <section className="bg-[#1e1e1e] p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-4">{questions[currentQuestionIndex]?.word}</h2>
              <div className="text-sm mb-4 flex flex-col gap-1">
                <div>
                  <span className="text-gray-300">Pregunta:</span> {currentQuestionIndex + 1} / {questions.length}
                </div>
                <div>
                  <span className="text-gray-300">Correctas:</span> {correctCount}
                  <span className="text-gray-300 ml-4">Incorrectas:</span> {incorrectCount}
                </div>
                <div>
                  <span className="text-gray-300">Calificación:</span> {grade}%
                </div>
              </div>
              <div className="flex flex-col items-center gap-3">
                {questions[currentQuestionIndex]?.options?.map((option, index) => (
                  <button
                    key={`${index}-${uuidv4()}`}
                    onClick={() => handleAnswerSelect(option)}
                    className={`w-full max-w-md py-2 px-4 rounded text-white text-lg shadow transition-all ${selectedAnswer === option ? "bg-orange-600" : "bg-blue-600 hover:bg-blue-700"}`}
                  >
                    {index + 1}. {option}
                  </button>
                ))}
              </div>
              {showCorrect && <div className="mt-4 text-green-400 font-bold text-xl">¡Correcto!</div>}
            </section>

            {/* Panel 2: Explicación */}
            {showExplanation && (
              <section className="bg-[#1e1e1e] p-4 rounded shadow">
                <h3 className="font-bold text-lg mb-2">Explicación</h3>
                <div className="space-y-2 text-left text-gray-200">
                  {questions[currentQuestionIndex]?.explanation?.map((item, index) => {
                    if (item.type === "text") return <p key={index}>{item.content}</p>;
                    if (item.type === "title-h2") return <h2 key={index} className="text-xl font-bold text-white">{item.content}</h2>;
                    if (item.type === "link") return (
                      <a key={index} href={item.content} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">{item.content}</a>
                    );
                    if (item.type === "code") return (
                      <pre key={index} className="bg-black text-green-400 p-3 rounded overflow-x-auto text-sm"><code>{item.content}</code></pre>
                    );
                    if (item.type === "ul") return (
                      <ul key={index} className="list-disc list-inside">{item.items.map((li, i) => <li key={i}>{li}</li>)}</ul>
                    );
                    if (item.type === "ol") return (
                      <ol key={index} className="list-decimal list-inside">{item.items.map((li, i) => <li key={i}>{li}</li>)}</ol>
                    );
                    if (item.type === "image") return (
                      <img key={index} src={item.src} alt={item.alt || "image"} className="rounded-md border border-gray-700 shadow-md max-w-full" />
                    );
                    if (item.type === "divider") return <hr key={index} className="border-gray-600 my-4" />;
                    return null;
                  })}
                </div>
                <button onClick={() => speakExplanation(questions[currentQuestionIndex]?.explanation)} className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition">🔊 Leer explicación</button>
              </section>
            )}

            {/* Panel 3: Español */}
            {showSpanishTranslation && (
              <section className="bg-[#1e1e1e] p-4 rounded shadow">
                <h2 className="text-lg font-bold text-white mb-2">Pregunta en Español</h2>
                <p className="mb-2 text-gray-300">{questions[currentQuestionIndex]?.word_es ?? "Sin traducción"}</p>
                <h3 className="text-md font-bold text-white mb-2">Opciones</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  {questions[currentQuestionIndex]?.options_es?.map((opt, idx) => (
                    <li key={idx}>{opt}</li>
                  ))}
                </ul>
                <h3 className="text-md font-bold text-white mt-4 mb-2">Explicación</h3>
                <div className="text-gray-300 space-y-2">
                  {Array.isArray(questions[currentQuestionIndex]?.explanation_es) &&
                    questions[currentQuestionIndex].explanation_es.map((item, index) => {
                      if (item.type === "text") return <p key={index}>{item.content}</p>;
                      if (item.type === "title-h2") return <h2 key={index} className="text-xl font-bold text-white">{item.content}</h2>;
                      if (item.type === "link") return (
                        <a key={index} href={item.content} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">{item.content}</a>
                      );
                      if (item.type === "code") return (
                        <pre key={index} className="bg-black text-green-400 p-3 rounded overflow-x-auto text-sm"><code>{item.content}</code></pre>
                      );
                      if (item.type === "ul") return (
                        <ul key={index} className="list-disc list-inside">{item.items.map((li, i) => <li key={i}>{li}</li>)}</ul>
                      );
                      if (item.type === "ol") return (
                        <ol key={index} className="list-decimal list-inside">{item.items.map((li, i) => <li key={i}>{li}</li>)}</ol>
                      );
                      if (item.type === "image") return (
                        <img key={index} src={item.src} alt={item.alt || "image"} className="rounded-md border border-gray-700 shadow-md max-w-full" />
                      );
                      if (item.type === "divider") return <hr key={index} className="border-gray-600 my-4" />;
                      return null;
                    })}
                </div>
              </section>
            )}
          </div>

          {/* Toolbar secundaria (pantalla completa) */}
          {!isFullScreen && (
            <div className="w-full max-w-screen-2xl mt-4 flex justify-end">
              <button onClick={enterFullScreen} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">Entrar en pantalla completa</button>
            </div>
          )}
        </>
      ) : (
        <div className="bg-[#1e1e1e] p-6 rounded-lg shadow-md w-full max-w-2xl text-center">
          <h1 className="text-2xl font-bold mb-4">Resultado Final</h1>
          <p className="text-lg">Tu puntaje es {score}/{questions.length}</p>
        </div>
      )}

      {/* Instrucciones y controles */}
      <div className="mt-10 bg-[#1a1a1a] p-6 rounded-lg shadow-md w-full max-w-2xl text-sm">
        {showAnswer && (
          <div className="mb-4 text-green-400">
            La respuesta correcta es: <strong>{questions[currentQuestionIndex]?.options?.[questions[currentQuestionIndex]?.correctAnswer - 1]}</strong>
          </div>
        )}
        <h3 className="text-lg font-bold mb-2 text-center">Instrucciones</h3>
        <div className={`mb-2 text-center font-medium ${responseMode ? "text-green-400" : "text-yellow-300"}`}>
          {responseMode ? "Presione 0 para desactivar modo de respuesta" : "Presiona 0 para activar el modo de respuesta."}
        </div>
        <ul className="list-disc list-inside space-y-1 text-gray-300">
          <li>Presiona <strong>Enter</strong> para repetir la pregunta.</li>
          <li>Presiona <strong>*</strong> para mostrar la respuesta de la pregunta.</li>
          <li>Presiona <strong>-</strong> para contestar la pregunta y pasar a la siguiente.</li>
        </ul>
        <div className="text-center mt-4 flex flex-wrap gap-2 justify-center">
          <button onClick={() => setReadQuestionsAloud((v) => !v)} className={`px-4 py-2 rounded ${readQuestionsAloud ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}>
            {readQuestionsAloud ? "🔊 Leer preguntas activado" : "🔇 Leer preguntas desactivado"}
          </button>
          <button onClick={() => setShowExplanation((v) => !v)} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition">{showExplanation ? "Ocultar explicación" : "Explicación"}</button>
          <button onClick={() => setShowAnswer((v) => !v)} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded">{showAnswer ? "Ocultar respuesta" : "Mostrar respuesta"}</button>
          <button onClick={() => setShowSpanishTranslation((v) => !v)} className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded transition">{showSpanishTranslation ? "Ocultar traducción" : "Mostrar traducción en español"}</button>
        </div>
      </div>

      {/* Ir a pregunta específica */}
      <div className="mt-6 bg-[#1a1a1a] p-4 rounded w-full max-w-md text-center">
        <h3 className="text-white font-semibold mb-2">Ir a una pregunta específica</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const value = e.currentTarget.pregunta.value;
            const index = parseInt(value);
            if (!isNaN(index) && index >= 1 && index <= questions.length) {
              setCurrentQuestionIndex(index - 1);
              setSelectedAnswer(null);
              setShowAnswer(false);
              setShowCorrect(false);
              playQuestionAudio(questions[index - 1]?.word);
            }
          }}
        >
          <input type="number" name="pregunta" min="1" max={questions.length} className="w-full mb-2 px-3 py-2 rounded text-black" placeholder={`Número entre 1 y ${questions.length}`} />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">Ir a la pregunta</button>
        </form>
      </div>
    </div>
  );
}
