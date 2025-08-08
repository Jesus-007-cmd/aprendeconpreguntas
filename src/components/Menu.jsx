import React, { useState } from "react";

const Menu = ({ onSelectOption }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleSelect = (option) => {
    onSelectOption(option);
    setIsDropdownOpen(false);
  };

  return (
    <nav className="bg-gray-900 text-white px-4 py-3 shadow-md w-full z-50">
      <ul className="flex flex-wrap justify-center gap-4 items-center">
        <li>
          <button
            onClick={() => handleSelect("quiz")}
            className="hover:text-yellow-400 transition duration-300"
          >
            Cuestionario
          </button>
        </li>
        <li>
          <button
            onClick={() => handleSelect("LearningEnglishWithQuestions")}
            className="hover:text-yellow-400 transition duration-300"
          >
            Learning English with Phrases
          </button>
        </li>
        <li>
          <button
            onClick={() => handleSelect("CombineCSVFiles")}
            className="hover:text-yellow-400 transition duration-300"
          >
            Herramientas
          </button>
        </li>
        <li>
          <button
            onClick={() => handleSelect("interviewQuiz")}
            className="hover:text-yellow-400 transition duration-300"
          >
            Cuestionario V2 (Entrevistas)
          </button>
        </li>
        <li>
          <button
            onClick={() => handleSelect("interviewQuiz3D")}
            className="hover:text-yellow-400 transition duration-300"
          >
            Quiz 3D Carrusel
          </button>
        </li>
        <li className="relative">
          <button
            onClick={toggleDropdown}
            className="hover:text-yellow-400 transition duration-300 flex items-center"
          >
            Pronunciación
            <span className="ml-1">{isDropdownOpen ? "▲" : "▼"}</span>
          </button>
          {isDropdownOpen && (
            <ul className="absolute top-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white rounded-md shadow-lg mt-2 z-50 min-w-[200px] w-max text-center">
              {[
                { label: "Alemán", option: "german" },
                { label: "Francés", option: "french" },
                { label: "Japonés", option: "japanese" },
                { label: "Portugués", option: "portuguese" },
                { label: "Italiano", option: "italian" },
                { label: "Inglés", option: "english" },
                { label: "Quiz All Languages", option: "QuizAllLanguages" },
                {
                  label: "Word Display All Languages",
                  option: "WordDisplayAllLanguagesComponent",
                },
                { label: "Spaced Repetition", option: "SpacedRepetition" },
                { label: "Quiz Audio", option: "QuizAppAllLanguages" },
                { label: "Quiz Audio 190", option: "QuizAppAllLanguages2" },
              ].map((item) => (
                <li key={item.option}>
                  <button
                    onClick={() => handleSelect(item.option)}
                    className="w-full px-4 py-2 hover:bg-gray-600 transition duration-200"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Menu;
