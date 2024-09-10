import React, { useState, useEffect, useCallback } from "react";
import "./WordDisplay.css";
const languageNames = {
  "de-DE": "Alemán",
  "fr-FR": "Francés",
  "it-IT": "Italiano",
  "pt-BR": "Portugués",
  "ja-JP": "Japonés"
  // Puedes agregar más idiomas aquí
};

// Ejemplo de JSON con palabras por idioma
const wordList = {
  "de-DE": [
    {
      "word": "Ich",
      "pronunciation": "ij",
      "meaning": "yo"
    },
    {
      "word": "Du",
      "pronunciation": "du",
      "meaning": "tú"
    },
    {
      "word": "Er",
      "pronunciation": "eh-r",
      "meaning": "él"
    },
    {
      "word": "Sie",
      "pronunciation": "zee",
      "meaning": "ella"
    },
    {
      "word": "Es",
      "pronunciation": "es",
      "meaning": "neutro"
    },
    {
      "word": "Wir",
      "pronunciation": "veer",
      "meaning": "nosotros"
    },
    {
      "word": "Ihr",
      "pronunciation": "eer",
      "meaning": "ustedes"
    },
    {
      "word": "Sie",
      "pronunciation": "zee",
      "meaning": "ellos"
    },
    {
      "word": "Sie (formal)",
      "pronunciation": "zee",
      "meaning": "usted"
    },
    {
      "word": "Heute",
      "pronunciation": "hoi-te",
      "meaning": "Hoy"
    },
    {
      "word": "Ich bin",
      "pronunciation": "ij bin",
      "meaning": "Yo soy"
    },
    {
      "word": "Du bist",
      "pronunciation": "du bist",
      "meaning": "Tú eres"
    },
    {
      "word": "Er ist",
      "pronunciation": "eh-r ist",
      "meaning": "Él es"
    },
    {
      "word": "Sie ist",
      "pronunciation": "zee ist",
      "meaning": "Ella es"
    },
    {
      "word": "Es ist",
      "pronunciation": "es ist",
      "meaning": "Neutro es"
    },
    {
      "word": "Wir sind",
      "pronunciation": "veer zind",
      "meaning": "Nosotros somos"
    },
    {
      "word": "Ihr seid",
      "pronunciation": "eer zayd",
      "meaning": "Ustedes son"
    },
    {
      "word": "Sie sind",
      "pronunciation": "zee zind",
      "meaning": "Ellos/Ustedes son"
    }
  ],
  "fr-FR": [
    {
      "word": "Bonjour",
      "pronunciation": "bon-zhoor",
      "meaning": "Buenos días"
    },
    {
      "word": "Bonsoir",
      "pronunciation": "bon-suá",
      "meaning": "Buenas tardes"
    },
    {
      "word": "Salut",
      "pronunciation": "sa-lú",
      "meaning": "Hola"
    },
    {
      "word": "Enchanté(e)",
      "pronunciation": "ahn-shant-ay",
      "meaning": "Un placer conocerlo"
    },
    {
      "word": "Monsieur",
      "pronunciation": "meuh-sieur",
      "meaning": "Señor"
    },
    {
      "word": "Madame",
      "pronunciation": "ma-dam",
      "meaning": "Señora"
    },
    {
      "word": "Coucou",
      "pronunciation": "cu-cu",
      "meaning": "Hey"
    },
    {
      "word": "Comment vas-tu?",
      "pronunciation": "como-vah-tu",
      "meaning": "¿Cómo estás?"
    },
    {
      "word": "Ça va?",
      "pronunciation": "sah-vah",
      "meaning": "¿Cómo estás?"
    },
    {
      "word": "Bienvenue",
      "pronunciation": "bee-ehn-veh-nu",
      "meaning": "Bienvenido"
    },
    {
      "word": "Au revoir",
      "pronunciation": "oh-rev-wah",
      "meaning": "Adiós"
    },
    {
      "word": "Quoi de neuf?",
      "pronunciation": "kwah duh nœf",
      "meaning": "¿Qué hay de nuevo?"
    }
  ],
  "it-IT": [
    {
      "word": "Buongiorno",
      "pronunciation": "bwon-dzhor-no",
      "meaning": "Buenos días"
    },
    {
      "word": "Buona sera",
      "pronunciation": "bwona-seh-ra",
      "meaning": "Buenas tardes"
    },
    {
      "word": "Ciao",
      "pronunciation": "chao",
      "meaning": "Hola"
    },
    {
      "word": "Arrivederci",
      "pronunciation": "a-rri-ve-der-chi",
      "meaning": "Adiós"
    },
    {
      "word": "Grazie",
      "pronunciation": "gra-tzie",
      "meaning": "Gracias"
    },
    {
      "word": "Buon pomeriggio",
      "pronunciation": "bwon poh-meh-ri-djo",
      "meaning": "Buenas tardes"
    },
    {
      "word": "Buona notte",
      "pronunciation": "bwona no-te",
      "meaning": "Buenas noches"
    },
    {
      "word": "Arrivederla",
      "pronunciation": "a-rri-ve-der-la",
      "meaning": "Adiós (formal)"
    },
    {
      "word": "A domani",
      "pronunciation": "a do-ma-ni",
      "meaning": "Hasta mañana"
    },
    {
      "word": "Grazie mille",
      "pronunciation": "gra-tzie mille",
      "meaning": "Muchas gracias"
    },
    {
      "word": "Per favore",
      "pronunciation": "per fa-vo-re",
      "meaning": "Por favor"
    },
    {
      "word": "Scusa! / Scusi!",
      "pronunciation": "sku-sa / sku-si",
      "meaning": "Disculpa! / Disculpe!"
    },
    {
      "word": "Come stai?",
      "pronunciation": "ko-me stai",
      "meaning": "¿Cómo estás?"
    }
  ],
  "ja-JP": [
    {
      "word": "Kaki",
      "pronunciation": "ka-ki",
      "meaning": "Caqui"
    },
    {
      "word": "Kikai",
      "pronunciation": "ki-kai",
      "meaning": "Máquina"
    },
    {
      "word": "Kikoku",
      "pronunciation": "ki-ko-ku",
      "meaning": "Volver a casa"
    },
    {
      "word": "Kaku",
      "pronunciation": "ka-ku",
      "meaning": "Escribir"
    },
    {
      "word": "Ike",
      "pronunciation": "i-ke",
      "meaning": "Estanque"
    },
    {
      "word": "Koke",
      "pronunciation": "ko-ke",
      "meaning": "Musgo"
    },
    {
      "word": "Iku",
      "pronunciation": "i-ku",
      "meaning": "Ir"
    },
    {
      "word": "Kuki",
      "pronunciation": "ku-ki",
      "meaning": "Tallo"
    },
    {
      "word": "Ka",
      "pronunciation": "ka",
      "meaning": "Mosquito"
    },
    {
      "word": "Kai",
      "pronunciation": "kai",
      "meaning": "Reunión"
    },
    {
      "word": "Ki",
      "pronunciation": "ki",
      "meaning": "Árbol"
    }
  ],
  "pt-BR": [
    {
      "word": "Eu sou",
      "pronunciation": "eu sou",
      "meaning": "Yo soy"
    },
    {
      "word": "Você é",
      "pronunciation": "vo-sê eh",
      "meaning": "Tú eres"
    },
    {
      "word": "Ele é",
      "pronunciation": "eh-lee eh",
      "meaning": "Él es"
    },
    {
      "word": "Ela é",
      "pronunciation": "eh-la eh",
      "meaning": "Ella es"
    },
    {
      "word": "Nós somos",
      "pronunciation": "nós soh-mos",
      "meaning": "Nosotros somos"
    },
    {
      "word": "Eles são",
      "pronunciation": "eh-lehs são",
      "meaning": "Ellos son"
    },
    {
      "word": "Vocês são",
      "pronunciation": "vo-sês são",
      "meaning": "Ustedes son"
    },
    {
      "word": "Nossos amigos são",
      "pronunciation": "noh-sos a-mee-gos são",
      "meaning": "Nuestros amigos son"
    },
    {
      "word": "Ela é muito bonita",
      "pronunciation": "eh-la eh mui-to bo-ni-ta",
      "meaning": "Ella es muy bonita"
    },
    {
      "word": "Ele não é nosso amigo",
      "pronunciation": "eh-lee nao eh no-so a-mee-go",
      "meaning": "Él no es nuestro amigo"
    },
    {
      "word": "Esta firma é brasileira",
      "pronunciation": "es-ta fir-ma eh bra-zi-lei-ra",
      "meaning": "Esta firma es brasileña"
    }
  ]
}


// Función para reproducir la pronunciación en un idioma
const playAudio = (text, lang = "de-DE", onEndCallback = null) => {
  const synth = window.speechSynthesis;
  
  // Cancelar cualquier síntesis de voz en curso antes de reproducir una nueva
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const findVoice = () => {
    const voices = synth.getVoices();
    const selectedVoice = voices.find((voice) => voice.lang === lang);
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = lang;
      
      if (onEndCallback) {
        utterance.onend = onEndCallback;
      }
      
      synth.speak(utterance);
    } else {
      console.error("No se encontró una voz en el idioma especificado.");
    }
  };

  if (!synth.getVoices().length) {
    synth.onvoiceschanged = findVoice;
  } else {
    findVoice();
  }
};



const WordDisplay = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("de-DE");
  const [activeWords, setActiveWords] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [filteredWords, setFilteredWords] = useState([]);
  const [wordSpeed, setWordSpeed] = useState(1000); // Controla la velocidad de lectura
  const [switchSpeed, setSwitchSpeed] = useState(1000); // Controla el tiempo entre palabras
  const [wordRepeat, setWordRepeat] = useState(1);  // Controla las repeticiones por palabra
const [allRepeat, setAllRepeat] = useState(1);  // Controla las repeticiones de todas las palabras
const [currentWordRepeat, setCurrentWordRepeat] = useState(1);
const [currentAllRepeat, setCurrentAllRepeat] = useState(1);
// Nueva función para reproducir la traducción en español
const playSpanishTranslation = (text, onEndCallback = null) => {
  playAudio(text, "es-ES", onEndCallback);
  
};

  const combineAllWords = () => {
    return Object.values(wordList).flat().map((word) => ({ ...word, checked: true }));
  };

  // Actualiza la lista de palabras cuando cambia el idioma
  useEffect(() => {
    if (selectedLanguage === "all") {
      setActiveWords(combineAllWords());
    } else {
      setActiveWords(wordList[selectedLanguage].map((word) => ({ ...word, checked: true })));
    }
    setCurrentWordIndex(0); // Reiniciar al cambiar idioma
  }, [selectedLanguage]);

  // Filtra las palabras seleccionadas (checkbox activados)
  useEffect(() => {
    const selectedWords = activeWords.filter((word) => word.checked);
    setFilteredWords(selectedWords);
    if (selectedWords.length === 0) {
      setIsPlaying(false); // Detener la reproducción si no hay palabras seleccionadas
    }
  }, [activeWords]);

  // Función para avanzar al siguiente paso (repetición o siguiente palabra)
 // Manejar la transición a la siguiente palabra
 const handleNextStep = useCallback(() => {
  if (currentWordIndex < filteredWords.length - 1) {
    // Avanza a la siguiente palabra
    setCurrentWordIndex((prevIndex) => prevIndex + 1);
    setCurrentWordRepeat(1); // Reiniciar el contador de repeticiones 
  } else if (currentAllRepeat < allRepeat) {
    // Si alcanzamos el final de la lista y hay más ciclos por repetir
    setCurrentWordIndex(0); // Reinicia el índice de palabras
    setCurrentAllRepeat((prev) => prev + 1);
  } else {
    // Si se completaron todas las repeticiones
    setIsPlaying(false);
    exitFullScreen(); // Salir de pantalla completa si está activada
  }
}, [currentWordIndex, filteredWords.length, currentAllRepeat, allRepeat]);
  
useEffect(() => {
  if (isPlaying && filteredWords.length > 0) {
    const currentWord = filteredWords[currentWordIndex];
    const lang = selectedLanguage === "all" ? getLanguageFromWord(currentWord.word) : selectedLanguage;

    // Función que reproduce la palabra en el idioma original
    const playOriginalWord = () => {
      playAudio(currentWord.word, lang, () => {
        // Aquí verificamos si aún se necesita repetir la palabra
        if (currentWordRepeat < wordRepeat) {
          setCurrentWordRepeat((prev) => prev + 1);
        } else {
          // Si se completaron las repeticiones, reproducimos la traducción en español
          
          playSpanishTranslation(currentWord.meaning, handleNextStep); // Reproduce la traducción y avanza a la siguiente palabra
          
        }
      });
    };

    playOriginalWord(); // Inicia la reproducción de la palabra en el idioma original
  }
}, [isPlaying, currentWordIndex, filteredWords, selectedLanguage, currentWordRepeat, wordRepeat, handleNextStep]);
  


  const getLanguageFromWord = (word) => {
    for (const lang in wordList) {
      if (wordList[lang].some((w) => w.word === word)) {
        return lang;
      }
    }
    return "de-DE"; // Valor predeterminado
  };

  const handleStartStop = () => {
    if (!isPlaying && filteredWords.length > 0) {
      setIsPlaying(true);
      setCurrentWordIndex(0); // Reinicia al principio de la lista de palabras
      setCurrentWordRepeat(1); // Reinicia el contador de repeticiones de la palabra
      setCurrentAllRepeat(1); // Reinicia las repeticiones generales
      enterFullScreen();
    } else {
      setIsPlaying(false);
      exitFullScreen();
    }
  };
  

  const enterFullScreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  };

  const exitFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  const handleCheckboxChange = (word, checked) => {
    setActiveWords((prev) => prev.map((w) => (w.word === word.word ? { ...w, checked: checked } : w)));
  };

  return (
    <div className="word-display-container">
      {!isPlaying ? (
        <div className="word-selection">
          <h1>Selecciona el idioma, las palabras y configura las repeticiones:</h1>
          <div className="language-selector">
            <label>Selecciona el idioma: </label>
            <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
              <option value="all">Todos los idiomas</option>
              <option value="de-DE">Alemán</option>
              <option value="fr-FR">Francés</option>
              {/* Añade más idiomas aquí */}
            </select>
          </div>
          {activeWords.map((word, index) => (
            <div key={index} className="word-item">
              <input
                type="checkbox"
                checked={word.checked}
                onChange={(e) => handleCheckboxChange(word, e.target.checked)}
              />
              <label>{word.word}</label>
            </div>
          ))}

          {/* Controles de velocidad */}
          <div className="settings">
            <label>
              Velocidad de lectura (milisegundos):
              <input type="number" value={wordSpeed} onChange={(e) => setWordSpeed(Number(e.target.value))} />
            </label>
            <label>
              Tiempo entre palabras (milisegundos):
              <input type="number" value={switchSpeed} onChange={(e) => setSwitchSpeed(Number(e.target.value))} />
            </label>
          </div>
       

<div className="settings">
<label>
    Repeticiones por palabra:
    <input
      type="number"
      value={wordRepeat}
      onChange={(e) => setWordRepeat(Number(e.target.value))}
      min="1"
    />
  </label>
  
  <label>
    Velocidad entre repeticiones de la misma palabra (milisegundos):
    <input
      type="number"
      value={wordSpeed}
      onChange={(e) => setWordSpeed(Number(e.target.value))}
      min="1000"
    />
  </label>

  <label>
    Velocidad entre cambio de palabras (milisegundos):
    <input
      type="number"
      value={switchSpeed}
      onChange={(e) => setSwitchSpeed(Number(e.target.value))}
      min="1000"
    />
  </label>
  
  <label>
    Repeticiones de todas las palabras:
    <input
      type="number"
      value={allRepeat}
      onChange={(e) => setAllRepeat(Number(e.target.value))}
      min="1"
    />
  </label>
</div>

          <button className="start-button" onClick={handleStartStop}>
            Iniciar Reproducción
          </button>
        </div>
      ) : (
        <div className="fullscreen-display">
          {filteredWords.length > 0 && (
            <div className="word-content">
              <div className="idiom">
                {selectedLanguage === "all"
                  ? languageNames[getLanguageFromWord(filteredWords[currentWordIndex]?.word)]
                  : languageNames[selectedLanguage]}
              </div>
              <div className="word">{filteredWords[currentWordIndex]?.word}</div>
              <div className="pronunciation">({filteredWords[currentWordIndex]?.pronunciation})</div>
              <div className="meaning">Significado: {filteredWords[currentWordIndex]?.meaning}</div>
              <button className="stop-button" onClick={handleStartStop}>
                Detener Reproducción
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WordDisplay;