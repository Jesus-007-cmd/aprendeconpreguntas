import React, { useState } from "react";

const Menu = ({ onSelectOption }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <nav className="bg-gray-800 p-4 shadow-lg">
      <ul className="flex space-x-4 justify-center items-center">
        <li>
          <button
            className="text-white hover:text-yellow-400 transition duration-300"
            onClick={() => onSelectOption("quiz")}
          >
            Cuestionario
          </button>
        </li>
        <li>
          <button
            className="text-white hover:text-yellow-400 transition duration-300"
            onClick={() => onSelectOption("LearningEnglishWithQuestions")}
          >
            Learning English with Phrases
          </button>
        </li>

        <li>
          <button
            className="text-white hover:text-yellow-400 transition duration-300"
            onClick={() => onSelectOption("CombineCSVFiles")}
          >
            Herramientas
          </button>
        </li>
        <li>
          <div
            className="menu-item"
            onClick={() => onSelectOption("interviewQuiz")}
          >
            Cuestionario V2 (Entrevistas)
          </div>
        </li>

        <li className="relative">
          <button
            className="text-white hover:text-yellow-400 transition duration-300 flex items-center"
            onClick={toggleDropdown}
          >
            Pronunciación
            <span className="ml-1">{isDropdownOpen ? "▲" : "▼"}</span>
          </button>

          {isDropdownOpen && (
            <ul className="absolute top-full left-0 bg-gray-700 text-white shadow-xl rounded-lg overflow-hidden mt-2 z-10 w-56">
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
                    className="block w-full text-left px-4 py-2 hover:bg-gray-600 transition duration-200"
                    onClick={() => {
                      onSelectOption(item.option);
                      setIsDropdownOpen(false); // cierra dropdown después de elegir opción
                    }}
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
