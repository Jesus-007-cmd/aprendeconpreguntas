import React, { useState } from "react";
import QuizCarousel3D from "./components/QuizCarousel3D";
import quizData from "./data/react_fundamentals.json";
import quizDatappsmovs from "./data/aplicaciones_moviles_clases.json";
import quizLearingEnglish from "./data/phrasesToLearn.json";
import desarrolloWebFrameworksQuiz from "./data/desarrollo-web-frameworks-quiz.json";
import desarrolloWebMarcosDeTrabajo from "./data/desarrollo-web-marcos-de-trabajo.json";
import desarrolloWebMarcosDeTrabajomicrotest from "./data/microtest-desarrollo-web-marcos-de-trabajo.json";

export default function InterviewQuiz3D() {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [isJsonSelected, setIsJsonSelected] = useState(false);
  const [questions, setQuestions] = useState([]);

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const handleJsonSelection = (jsonFile) => {
    const language = selectedLanguage;

    const adaptedQuestions = jsonFile.Questions.map((question) => {
      const rndmQuestion = Math.floor(
        Math.random() * question["Question Text"][language].length
      );
      const randomQuestionVariant = question["Question Text"][language][rndmQuestion];

      const options = shuffleArray([...question.Options[language]]);
      const correctAnswer = question["Correct Answer"][language];
      
      return {
        word: randomQuestionVariant,
        options,
        correctAnswer: options.indexOf(correctAnswer) + 1,
      };
    });

    setQuestions(adaptedQuestions);
    setIsJsonSelected(true);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white px-4 py-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold text-center mb-6">
        Quiz 3D - Estilo Carrusel
      </h1>

      {!selectedLanguage ? (
        <div className="flex flex-col items-center gap-4 mb-10">
          <h2 className="text-xl font-semibold mb-2">
            Seleccione el idioma del quiz:
          </h2>
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
      ) : !isJsonSelected ? (
        <div className="flex flex-col items-center gap-4 mb-10">
          <h2 className="text-xl font-semibold mb-2">Seleccione el quiz:</h2>
          <button onClick={() => handleJsonSelection(quizData)} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded shadow">
            {quizData["Quiz Title"]}
          </button>
          <button onClick={() => handleJsonSelection(quizDatappsmovs)} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded shadow">
            {quizDatappsmovs["Quiz Title"]}
          </button>
          <button onClick={() => handleJsonSelection(quizLearingEnglish)} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded shadow">
            {quizLearingEnglish["Quiz Title"]}
          </button>
          <button onClick={() => handleJsonSelection(desarrolloWebFrameworksQuiz)} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded shadow">
            {desarrolloWebFrameworksQuiz["Quiz Title"]}
          </button>
          <button onClick={() => handleJsonSelection(desarrolloWebMarcosDeTrabajo)} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded shadow">
            {desarrolloWebMarcosDeTrabajo["Quiz Title"]}
          </button>
          <button onClick={() => handleJsonSelection(desarrolloWebMarcosDeTrabajomicrotest)} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded shadow">
            {desarrolloWebMarcosDeTrabajomicrotest["Quiz Title"]}
          </button>
        </div>
      ) : (
        <QuizCarousel3D questions={questions} />
      )}
    </div>
  );
}
