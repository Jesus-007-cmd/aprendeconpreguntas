import React, { useState } from 'react';
import './App.css';
import QuizApp from './components/quizApp/QuizApp'; // Ruta corregida del QuizApp
import Modal from 'react-modal';
import Menu from './components/Menu'; // Importamos el componente Menu

import GermanComponent from './components/languageLearning/German/GermanLearningComponent';
import FrenchComponent from './components/languageLearning/French/FrenchComponent';
import JapaneseComponent from './components/languageLearning/Japanese/JapaneseComponent';
import PortugueseComponent from './components/languageLearning/Portuguese/PortugueseComponent';
import ItalianComponent from './components/languageLearning/Italian/ItalianComponent';
import EnglishComponent from './components/languageLearning/English/EnglishComponent';
import QuizAllLanguagesComponent from './components/languageLearning/AllLanguages/Quiz';
import WordDisplayAllLanguagesComponent from './components/languageLearning/AllLanguages/WordDisplay';




Modal.setAppElement('#root');

function App() {
  const [selectedOption, setSelectedOption] = useState('quiz'); // Estado para cambiar entre opciones

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

  return (
    <div className="App">
      <header className="App-header">
        <Menu onSelectOption={handleSelectOption} /> {/* Renderizamos el menú */}

        {selectedOption === 'quiz' && <QuizApp />} {/* Mostramos el cuestionario */}

        {selectedOption === 'german' && <GermanComponent />} {/* Componente para Alemán */}
        {selectedOption === 'french' && <FrenchComponent />} {/* Componente para Francés */}
        {selectedOption === 'japanese' && <JapaneseComponent />} {/* Componente para Japonés */}
        {selectedOption === 'portuguese' && <PortugueseComponent />} {/* Componente para Portugués */}
        {selectedOption === 'italian' && <ItalianComponent />} {/* Componente para Italiano */}
        {selectedOption === 'english' && <EnglishComponent />} {/* Componente para Inglés */}
        {selectedOption === 'QuizAllLanguages' && <QuizAllLanguagesComponent />} {/* Componente para Inglés */}
        {selectedOption === 'WordDisplayAllLanguagesComponent' && <WordDisplayAllLanguagesComponent />} {/* Componente para Inglés */}
        
      </header>
    </div>
  );
}

export default App;
