import React, { useState } from 'react';
import './App.css';
import QuizApp from './components/quizApp/QuizApp'; // Ruta corregida del QuizApp
import Modal from 'react-modal';
import Menu from './components/Menu'; // Importamos el componente Menu

import CombineCSVFiles  from './components/CombineCSVFiles'; // Ruta corregida del QuizApp
import GermanComponent from './components/languageLearning/German/GermanLearningComponent';
import FrenchComponent from './components/languageLearning/French/FrenchComponent';
import JapaneseComponent from './components/languageLearning/Japanese/JapaneseComponent';
import PortugueseComponent from './components/languageLearning/Portuguese/PortugueseComponent';
import ItalianComponent from './components/languageLearning/Italian/ItalianComponent';
import EnglishComponent from './components/languageLearning/English/EnglishComponent';
import QuizAllLanguagesComponent from './components/languageLearning/AllLanguages/Quiz';
import WordDisplayAllLanguagesComponent from './components/languageLearning/AllLanguages/WordDisplay';
import SpacedRepetition from './components/languageLearning/AllLanguages/SpacedRepetition';
import QuizAppAllLanguages from './components/languageLearning/AllLanguages/quizalls/QuizApp';
import QuizAppAllLanguages2 from './components/languageLearning/AllLanguages/quizalls190/QuizApp190';

Modal.setAppElement('#root');

function App() {
  const [selectedOption, setSelectedOption] = useState(''); // Estado para cambiar entre opciones

  const handleSelectOption = (option) => {
    setSelectedOption(option); // Cambiar entre cuestionario y los diferentes idiomas
  };

  const hideQuizApp = () => {
    setSelectedOption(''); // Cambia el estado para ocultar el QuizApp
  };

  return (
    <div className="App">
      <header className="App-header">
        <Menu onSelectOption={handleSelectOption} /> {/* Renderizamos el menú */}
      </header>

      <div className="content-container">
        {selectedOption === 'quiz' && <QuizApp />}
        {selectedOption === 'CombineCSVFiles' && <CombineCSVFiles />}

        {selectedOption === 'german' && <GermanComponent />}
        {selectedOption === 'french' && <FrenchComponent />}
        {selectedOption === 'japanese' && <JapaneseComponent />}
        {selectedOption === 'portuguese' && <PortugueseComponent />}
        {selectedOption === 'italian' && <ItalianComponent />}
        {selectedOption === 'english' && <EnglishComponent />}
        {selectedOption === 'QuizAllLanguages' && <QuizAllLanguagesComponent />}
        {selectedOption === 'WordDisplayAllLanguagesComponent' && <WordDisplayAllLanguagesComponent />}
        {selectedOption === 'SpacedRepetition' && <SpacedRepetition />}
        {selectedOption === 'QuizAppAllLanguages' && <QuizAppAllLanguages />}
        {selectedOption === 'QuizAppAllLanguages2' && <QuizAppAllLanguages2 />}
      </div>

      <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
        {selectedOption && (
          <button
            onClick={hideQuizApp}
            className="back-button"
          >
            &#8592; {/* Flecha hacia atrás */}
            <span className="tooltip-text">Regresar al menú</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
