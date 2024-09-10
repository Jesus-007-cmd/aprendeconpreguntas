import React, { useState } from "react";
import "./FrenchNumbersComponent.css";



const numberToFrenchWord = {
  1: { word: "un", pronunciation: "an" },
  2: { word: "deux", pronunciation: "de" },
  3: { word: "trois", pronunciation: "trua" },
  4: { word: "quatre", pronunciation: "catr" },
  5: { word: "cinq", pronunciation: "sank" },
  6: { word: "six", pronunciation: "sis" },
  7: { word: "sept", pronunciation: "set" },
  8: { word: "huit", pronunciation: "wuit" },
  9: { word: "neuf", pronunciation: "nof" },
  10: { word: "dix", pronunciation: "dis" },
  11: { word: "onze", pronunciation: "onz" },
  12: { word: "douze", pronunciation: "duz" },
  13: { word: "treize", pronunciation: "trez" },
  14: { word: "quatorze", pronunciation: "katorz" },
  15: { word: "quinze", pronunciation: "kanz" },
  16: { word: "seize", pronunciation: "sez" },
  17: { word: "dix-sept", pronunciation: "dis-set" },
  18: { word: "dix-huit", pronunciation: "dis-wuit" },
  19: { word: "dix-neuf", pronunciation: "dis-nof" },
  20: { word: "vingt", pronunciation: "van" },
  21: { word: "vingt et un", pronunciation: "van-te-an" },
  22: { word: "vingt-deux", pronunciation: "van-de" },
  23: { word: "vingt-trois", pronunciation: "van-trua" },
  24: { word: "vingt-quatre", pronunciation: "van-catr" },
  25: { word: "vingt-cinq", pronunciation: "van-sank" },
  26: { word: "vingt-six", pronunciation: "van-sis" },
  27: { word: "vingt-sept", pronunciation: "van-set" },
  28: { word: "vingt-huit", pronunciation: "van-wuit" },
  29: { word: "vingt-neuf", pronunciation: "van-nof" },
  30: { word: "trente", pronunciation: "tront" },
  31: { word: "trente et un", pronunciation: "tront-te-an" },
  32: { word: "trente-deux", pronunciation: "tront-de" },
  33: { word: "trente-trois", pronunciation: "tront-trua" },
  34: { word: "trente-quatre", pronunciation: "tront-catr" },
  35: { word: "trente-cinq", pronunciation: "tront-sank" },
  36: { word: "trente-six", pronunciation: "tront-sis" },
  37: { word: "trente-sept", pronunciation: "tront-set" },
  38: { word: "trente-huit", pronunciation: "tront-wuit" },
  39: { word: "trente-neuf", pronunciation: "tront-nof" },
  40: { word: "quarante", pronunciation: "ka-ront" },
  41: { word: "quarante et un", pronunciation: "ka-ront-te-an" },
  42: { word: "quarante-deux", pronunciation: "ka-ront-de" },
  43: { word: "quarante-trois", pronunciation: "ka-ront-trua" },
  44: { word: "quarante-quatre", pronunciation: "ka-ront-catr" },
  45: { word: "quarante-cinq", pronunciation: "ka-ront-sank" },
  46: { word: "quarante-six", pronunciation: "ka-ront-sis" },
  47: { word: "quarante-sept", pronunciation: "ka-ront-set" },
  48: { word: "quarante-huit", pronunciation: "ka-ront-wuit" },
  49: { word: "quarante-neuf", pronunciation: "ka-ront-nof" },
  50: { word: "cinquante", pronunciation: "san-kont" },
  51: { word: "cinquante et un", pronunciation: "san-kont-te-an" },
  52: { word: "cinquante-deux", pronunciation: "san-kont-de" },
  53: { word: "cinquante-trois", pronunciation: "san-kont-trua" },
  54: { word: "cinquante-quatre", pronunciation: "san-kont-catr" },
  55: { word: "cinquante-cinq", pronunciation: "san-kont-sank" },
  56: { word: "cinquante-six", pronunciation: "san-kont-sis" },
  57: { word: "cinquante-sept", pronunciation: "san-kont-set" },
  58: { word: "cinquante-huit", pronunciation: "san-kont-wuit" },
  59: { word: "cinquante-neuf", pronunciation: "san-kont-nof" },
  60: { word: "soixante", pronunciation: "swa-sont" },
  61: { word: "soixante et un", pronunciation: "swa-sont-te-an" },
  62: { word: "soixante-deux", pronunciation: "swa-sont-de" },
  63: { word: "soixante-trois", pronunciation: "swa-sont-trua" },
  64: { word: "soixante-quatre", pronunciation: "swa-sont-catr" },
  65: { word: "soixante-cinq", pronunciation: "swa-sont-sank" },
  66: { word: "soixante-six", pronunciation: "swa-sont-sis" },
  67: { word: "soixante-sept", pronunciation: "swa-sont-set" },
  68: { word: "soixante-huit", pronunciation: "swa-sont-wuit" },
  69: { word: "soixante-neuf", pronunciation: "swa-sont-nof" },
  70: { word: "soixante-dix", pronunciation: "swa-sont-dis" },
  71: { word: "soixante et onze", pronunciation: "swa-sont-te-onz" },
  72: { word: "soixante-douze", pronunciation: "swa-sont-duz" },
  73: { word: "soixante-treize", pronunciation: "swa-sont-trez" },
  74: { word: "soixante-quatorze", pronunciation: "swa-sont-katorz" },
  75: { word: "soixante-quinze", pronunciation: "swa-sont-kanz" },
  76: { word: "soixante-seize", pronunciation: "swa-sont-sez" },
  77: { word: "soixante-dix-sept", pronunciation: "swa-sont-dis-set" },
  78: { word: "soixante-dix-huit", pronunciation: "swa-sont-dis-wuit" },
  79: { word: "soixante-dix-neuf", pronunciation: "swa-sont-dis-nof" },
  80: { word: "quatre-vingts", pronunciation: "catr-van" },
  81: { word: "quatre-vingt-un", pronunciation: "catr-van-an" },
  82: { word: "quatre-vingt-deux", pronunciation: "catr-van-de" },
  83: { word: "quatre-vingt-trois", pronunciation: "catr-van-trua" },
  84: { word: "quatre-vingt-quatre", pronunciation: "catr-van-catr" },
  85: { word: "quatre-vingt-cinq", pronunciation: "catr-van-sank" },
  86: { word: "quatre-vingt-six", pronunciation: "catr-van-sis" },
  87: { word: "quatre-vingt-sept", pronunciation: "catr-van-set" },
  88: { word: "quatre-vingt-huit", pronunciation: "catr-van-wuit" },
  89: { word: "quatre-vingt-neuf", pronunciation: "catr-van-nof" },
  90: { word: "quatre-vingt-dix", pronunciation: "catr-van-dis" },
  91: { word: "quatre-vingt-onze", pronunciation: "catr-van-onz" },
  92: { word: "quatre-vingt-douze", pronunciation: "catr-van-duz" },
  93: { word: "quatre-vingt-treize", pronunciation: "catr-van-trez" },
  94: { word: "quatre-vingt-quatorze", pronunciation: "catr-van-katorz" },
  95: { word: "quatre-vingt-quinze", pronunciation: "catr-van-kanz" },
  96: { word: "quatre-vingt-seize", pronunciation: "catr-van-sez" },
  97: { word: "quatre-vingt-dix-sept", pronunciation: "catr-van-dis-set" },
  98: { word: "quatre-vingt-dix-huit", pronunciation: "catr-van-dis-wuit" },
  99: { word: "quatre-vingt-dix-neuf", pronunciation: "catr-van-dis-nof" },
  100: { word: "cent", pronunciation: "son" },
};

const FrenchNumbersComponent = () => {
  const [textToTranslate, setTextToTranslate] = useState("");
  const [frenchWord, setFrenchWord] = useState("");
  const [pronunciation, setPronunciation] = useState("");
  // Nuevos estados
  const [isPlaying, setIsPlaying] = useState(false); // Estado para saber si está en reproducción
  
  const [rangeStart, setRangeStart] = useState(""); // Número inicial
  const [rangeEnd, setRangeEnd] = useState(""); // Número final
  const [repeatCount, setRepeatCount] = useState(1); // Cantidad de repeticiones
  const [highlightedNumber, setHighlightedNumber] = useState(null); // Número actual en reproducción
  const [isRangeActive, setIsRangeActive] = useState(false); // Estado del checkbox
  const [dialect, setDialect] = useState("fr-FR"); // Estado para el dialecto seleccionado
// Función para manejar los cambios en el checkbox y los inputs
const handleRangeChange = () => {
  setIsRangeActive(!isRangeActive); // Alternar el estado del checkbox
};
const handleStartChange = (e) => {
  setRangeStart(e.target.value ? parseInt(e.target.value) : ""); // Convertir el valor a número o vacío
};

const handleEndChange = (e) => {
  setRangeEnd(e.target.value ? parseInt(e.target.value) : ""); // Convertir el valor a número o vacío
};
// Función para reproducir la pronunciación en francés
const playAudio = (text) => {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Lista todas las voces disponibles
  const findVoice = () => {
    const voices = synth.getVoices();
    const frenchVoice = voices.find((voice) => voice.lang === dialect);

    if (frenchVoice) {
      utterance.voice = frenchVoice; // Asigna la voz en francés
      utterance.lang = dialect; // Asegura que el idioma sea francés
      synth.speak(utterance);
      
    } else {
      console.error("No se encontró una voz en francés.");
    }
  };

  // Si las voces aún no están listas, esperar a que se carguen
  if (!synth.getVoices().length) {
    synth.onvoiceschanged = findVoice;
  } else {
    findVoice();
  }
};
// Filtra los números que estén dentro del rango seleccionado
const filteredNumbers = Object.entries(numberToFrenchWord).filter(([number]) => {
  return number >= rangeStart && number <= rangeEnd;
});
  // Función para buscar en el arreglo de números
  const translateNumberToFrenchWord = (number) => {
    return numberToFrenchWord[number] || { word: "", pronunciation: "" };
  };

  // Función para manejar la reproducción del audio
  const handlePlayAudio = () => {
    const number = parseInt(textToTranslate);
    
    
    // Verificar si es un número y está en el arreglo
    if (!isNaN(number) && numberToFrenchWord[number]) {
      const { word } = translateNumberToFrenchWord(number);
      playAudio(word); // Reproduce el número en francés desde el JSON
    } else {
      
      playAudio(textToTranslate); // Reproduce el texto directamente si no es un número
    }
  };

  // Función para manejar cambios en el cuadro de texto
  const handleInputChange = (e) => {
    const input = e.target.value.trim();
    setTextToTranslate(input); // Actualiza el estado con el texto del input
  
    const number = parseInt(input);
    if (!isNaN(number) && numberToFrenchWord[number]) {
      const { word, pronunciation } = translateNumberToFrenchWord(number);
      setFrenchWord(word); // Asigna la palabra en francés
      setPronunciation(pronunciation); // Asigna la pronunciación en español
    } else {
      setFrenchWord("");
      setPronunciation(""); // Si no es un número válido, limpiar los estados
    }
  };
  
  // Función para iniciar la reproducción de los números
  const handleStart = () => {
    const start = parseInt(rangeStart);
    const end = parseInt(rangeEnd);

    if (!isNaN(start) && !isNaN(end) && start <= end) {
      setIsPlaying(true);
      playNumberRange(start, end, repeatCount);
    }
  };

  // Función para detener la reproducción
  const handleStop = () => {
    setIsPlaying(false);
  };

  // Función para reproducir el rango de números
  const playNumberRange = (start, end, repeatCount) => {
    let currentNumber = start;
    let currentRepetition = 1;

    const intervalId = setInterval(() => {
      if (currentNumber > end) {
        currentNumber = start;
        currentRepetition++;

        if (currentRepetition > repeatCount) {
          clearInterval(intervalId); // Detiene cuando se han completado todas las repeticiones
          setIsPlaying(false);
          setHighlightedNumber(null);
          return;
        }
      }

      setHighlightedNumber(currentNumber); // Resalta el número actual
      const { word } = translateNumberToFrenchWord(currentNumber);
      playAudio(word); // Reproduce el número actual

      currentNumber++;
    }, 2000); // Cambiar el intervalo según el tiempo de reproducción de cada número
  };

  return (
    <div className="french-learning">
      <h2>Apprendre le Français</h2>
      <h3>Aprender francés</h3>

      {/* Tarjeta para escribir un número y escucharlo */}
      <div className="card">
        <h3>Escribe un número en francés para escucharlo</h3>
        <textarea
          value={textToTranslate}
          onChange={handleInputChange}
          
          rows="2"
          cols="20"
          placeholder="Escribe un número..."
        />
        <br />
        {/* Mostrar la palabra en francés si es un número */}
        {frenchWord && (
          <p>
            Se escribe en francés como: <strong>{frenchWord}</strong>
          </p>
        )}
        {/* Mostrar la pronunciación en español */}
        {pronunciation && (
          <p>
            Se pronuncia como: <strong>{pronunciation}</strong>
          </p>
        )}
   {/* Seleccionar el dialecto */}
   <label htmlFor="dialectSelect">Seleccionar Dialecto:</label>
        <select
          id="dialectSelect"
          value={dialect}
          onChange={(e) => setDialect(e.target.value)}
        >
          <option value="fr-FR">Francés de Francia (fr-FR)</option>
          <option value="fr-CA">Francés Canadiense (fr-CA)</option>
          {/* Agrega más dialectos si los hay disponibles */}
        </select>
        <br />
        <button onClick={handlePlayAudio}>Escuchar en Francés</button>
        <div className="checkbox-container">
        <input
          type="checkbox"
          id="rangeMode"
          checked={isRangeActive}
          onChange={handleRangeChange}
        />
        <label htmlFor="rangeMode">Mostrar un rango de números</label>
      </div>

      {isRangeActive && (
        <div className="range-controls">
          <label htmlFor="rangeStart">Número Inicial:</label>
          <input
            type="number"
            id="rangeStart"
            value={rangeStart}
            onChange={handleStartChange}
            min="1"
            max="100"
          />

          <label htmlFor="rangeEnd">Número Final:</label>
          <input
            type="number"
            id="rangeEnd"
            value={rangeEnd}
            onChange={handleEndChange}
            min="1"
            max="100"
          />
          <label htmlFor="repeatCount">Repetir:</label>
            <input
              type="number"
              id="repeatCount"
              value={repeatCount}
              onChange={(e) => setRepeatCount(e.target.value)}
              min="1"
              max="10"
            />
      

      

            
            <button onClick={isPlaying ? handleStop : handleStart}>
              {isPlaying ? "Detener" : "Empezar"}
            </button>
            <h3>Números en Francés con Pronunciación</h3>
            


            <ul className="french-numbers-list">
            {filteredNumbers.map(([number, { word, pronunciation }]) => (
                  <li
                    key={number}
                    style={{
                      color:
                        highlightedNumber === parseInt(number)
                          ? "red"
                          : "black",
                    }}
                  >
                    {number} - {word} ({pronunciation})
                  </li>
                )
              )}
            </ul>
          </div>
        )}

        {/* Números en francés */}
        <div className="french-numbers-container">
          <h3>Números en Francés con Pronunciación</h3>

          <ul className="french-numbers-list">
            {Object.entries(numberToFrenchWord).map(
              ([number, { word, pronunciation }]) => (
                <li
                  key={number}
                  style={{
                    color:
                      highlightedNumber === parseInt(number) ? "red" : "black",
                  }} // Cambia de color si es el número actual
                >
                  <button onClick={() => playAudio(word)}>
                    {number} - {word} ({pronunciation})
                  </button>
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FrenchNumbersComponent;
