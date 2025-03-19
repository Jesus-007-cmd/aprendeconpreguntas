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
    playPronunciation(option); // Reproducir audio al seleccionar el idioma
  };

  const playPronunciation = (option) => {
    let textInSpanish = "Hola, ¿cómo estás?";
    let textInForeign = "";
    let lang = "";

    switch (option) {
      case 'german':
        textInForeign = "Guten Tag";
        lang = "de-DE";
        break;
      case 'french':
        textInForeign = "Bonjour, comment ça va?";
        lang = "fr-FR";
        break;
      case 'japanese':
        textInForeign = "こんにちは";
        lang = "ja-JP";
        break;
      case 'portuguese':
        textInForeign = "Olá, como vai?";
        lang = "pt-PT";
        break;
      case 'italian':
        textInForeign = "Ciao, come stai?";
        lang = "it-IT";
        break;
      case 'english':
        textInForeign = "Hello, how are you?";
        lang = "en-US";
        break;
      default:
        return;
    }

    const spanishSpeech = new SpeechSynthesisUtterance(textInSpanish);
    spanishSpeech.lang = 'es-ES';
    
    const foreignSpeech = new SpeechSynthesisUtterance(textInForeign);
    foreignSpeech.lang = lang;

    window.speechSynthesis.speak(spanishSpeech);
    spanishSpeech.onend = () => {
      window.speechSynthesis.speak(foreignSpeech);
    };
  };
  const hideQuizApp = () => {
    setSelectedOption(''); // Cambia el estado para ocultar el QuizApp
  };
  return (
    <div className="App">
      <header className="App-header">
        <Menu onSelectOption={handleSelectOption} /> {/* Renderizamos el menú */}

        {selectedOption === 'quiz' && <QuizApp />} {/* Mostramos el cuestionario */}
        {selectedOption === 'CombineCSVFiles' && <CombineCSVFiles />} {/* Mostramos el cuestionario */}

        {selectedOption === 'german' && <GermanComponent />} {/* Componente para Alemán */}
        {selectedOption === 'french' && <FrenchComponent />} {/* Componente para Francés */}
        {selectedOption === 'japanese' && <JapaneseComponent />} {/* Componente para Japonés */}
        {selectedOption === 'portuguese' && <PortugueseComponent />} {/* Componente para Portugués */}
        {selectedOption === 'italian' && <ItalianComponent />} {/* Componente para Italiano */}
        {selectedOption === 'english' && <EnglishComponent />} {/* Componente para Inglés */}
        {selectedOption === 'QuizAllLanguages' && <QuizAllLanguagesComponent />} {/* Componente para Inglés */}
        {selectedOption === 'WordDisplayAllLanguagesComponent' && <WordDisplayAllLanguagesComponent />} {/* Componente para Inglés */}
        {selectedOption === 'SpacedRepetition' && <SpacedRepetition />} {/* Componente para Inglés */}
        {selectedOption === 'QuizAppAllLanguages' && <QuizAppAllLanguages />}
        {selectedOption === 'QuizAppAllLanguages2' && <QuizAppAllLanguages2 />}
        
      </header>
      <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
   {(selectedOption && <button
    onClick={hideQuizApp}
    style={{
      background: 'transparent',
      border: 'none',
      fontSize: '36px', // Aumentamos el tamaño de la flecha para hacerla más gruesa
      cursor: 'pointer',
      position: 'relative',
      color: '#fff', // Hacemos la flecha blanca
      fontWeight: 'bold', // Hacemos la flecha más gruesa
    }}
  >
    {/* Flecha hacia atrás */}
    &#8592;  {/* Código HTML para la flecha hacia la izquierda */}
    {/* Tooltip */}
    <span style={{
      visibility: 'hidden',
      backgroundColor: '#3399ff', // Color azul más claro para el fondo del tooltip
      color: '#fff', // Color del texto del tooltip
      textAlign: 'center',
      borderRadius: '6px',
      padding: '5px',
      position: 'absolute',
      zIndex: '1',
      bottom: '125%',
      left: '50%',
      marginLeft: '-60px',
      opacity: 0,
      transition: 'opacity 0.3s',
      width: '120px',
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', // Sombra suave
    }}
      className="tooltip-text"
    >
      Regresar al menú
    </span>
  </button>)}
</div>

    </div>
  );
}

export default App;
