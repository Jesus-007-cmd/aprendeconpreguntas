import React, { useState } from 'react';
import './GermanLearningComponent.css';
import GermanNumbersComponent from './GermanNumbersComponent';
import SeinExercise from './GermanComponents/SeinExercise';
import GermanPracticeExercise from './GermanComponents/GermanPracticeExercise';


// Función para reproducir la pronunciación

const playAudio = (text, lang = 'de-DE', callback) => {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Lista todas las voces disponibles
  const findVoice = () => {
      const voices = synth.getVoices();
      const germanVoice = voices.find(voice => voice.lang === lang);

      if (germanVoice) {
          utterance.voice = germanVoice; // Asigna la voz en alemán
          utterance.lang = lang;  // Asegura que el idioma sea alemán
          synth.speak(utterance);

          // Llama al callback cuando termina la pronunciación
          utterance.onend = () => {
              if (callback) callback();
          };
      } else {
          console.error('No se encontró una voz en alemán.');
      }
  };

  // Si las voces aún no están listas, esperar a que se carguen
  if (!synth.getVoices().length) {
      synth.onvoiceschanged = findVoice;
  } else {
      findVoice();
  }
};

// Función para traducir usando Google Translate API o similar (requiere configuración)
const translateText = async (text, setTranslation) => {
  const translatedText = "Traducción al español aquí"; // Simulación de traducción
  setTranslation(translatedText);
};
// Mapa de números en alemán
// Mapa de números en alemán (1 al 100)
const numberToGermanWord = {
  1: { word: "eins", pronunciation: "ains" },
  2: { word: "zwei", pronunciation: "tsvai" },
  3: { word: "drei", pronunciation: "drai" },
  4: { word: "vier", pronunciation: "fía" },
  5: { word: "fünf", pronunciation: "fünf" },
  6: { word: "sechs", pronunciation: "zeks" },
  7: { word: "sieben", pronunciation: "zíben" },
  8: { word: "acht", pronunciation: "ajt" },
  9: { word: "neun", pronunciation: "nóin" },
  10: { word: "zehn", pronunciation: "tsein" },
  11: { word: "elf", pronunciation: "elf" },
  12: { word: "zwölf", pronunciation: "tsvölf" },
  13: { word: "dreizehn", pronunciation: "draitsen" },
  14: { word: "vierzehn", pronunciation: "fiartsen" },
  15: { word: "fünfzehn", pronunciation: "fünftsen" },
  16: { word: "sechzehn", pronunciation: "zektsen" },
  17: { word: "siebzehn", pronunciation: "zíptsen" },
  18: { word: "achtzehn", pronunciation: "ajtsen" },
  19: { word: "neunzehn", pronunciation: "nóintsen" },
  20: { word: "zwanzig", pronunciation: "tsván-tsig" },
  21: { word: "einundzwanzig", pronunciation: "áin-unt-tsván-tsig" },
  22: { word: "zweiundzwanzig", pronunciation: "tsvai-unt-tsván-tsig" },
  23: { word: "dreiundzwanzig", pronunciation: "drai-unt-tsván-tsig" },
  24: { word: "vierundzwanzig", pronunciation: "fía-unt-tsván-tsig" },
  25: { word: "fünfundzwanzig", pronunciation: "fünf-unt-tsván-tsig" },
  26: { word: "sechsundzwanzig", pronunciation: "zeks-unt-tsván-tsig" },
  27: { word: "siebenundzwanzig", pronunciation: "zíben-unt-tsván-tsig" },
  28: { word: "achtundzwanzig", pronunciation: "ajt-unt-tsván-tsig" },
  29: { word: "neunundzwanzig", pronunciation: "nóin-unt-tsván-tsig" },
  30: { word: "dreißig", pronunciation: "draísig" },
  31: { word: "einunddreißig", pronunciation: "áin-unt-draísig" },
  32: { word: "zweiunddreißig", pronunciation: "tsvai-unt-draísig" },
  33: { word: "dreiunddreißig", pronunciation: "drai-unt-draísig" },
  34: { word: "vierunddreißig", pronunciation: "fía-unt-draísig" },
  35: { word: "fünfunddreißig", pronunciation: "fünf-unt-draísig" },
  36: { word: "sechsunddreißig", pronunciation: "zeks-unt-draísig" },
  37: { word: "siebenunddreißig", pronunciation: "zíben-unt-draísig" },
  38: { word: "achtunddreißig", pronunciation: "ajt-unt-draísig" },
  39: { word: "neununddreißig", pronunciation: "nóin-unt-draísig" },
  40: { word: "vierzig", pronunciation: "fíatsig" },
  41: { word: "einundvierzig", pronunciation: "áin-unt-fíatsig" },
  42: { word: "zweiundvierzig", pronunciation: "tsvai-unt-fíatsig" },
  43: { word: "dreiundvierzig", pronunciation: "drai-unt-fíatsig" },
  44: { word: "vierundvierzig", pronunciation: "fía-unt-fíatsig" },
  45: { word: "fünfundvierzig", pronunciation: "fünf-unt-fíatsig" },
  46: { word: "sechsundvierzig", pronunciation: "zeks-unt-fíatsig" },
  47: { word: "siebenundvierzig", pronunciation: "zíben-unt-fíatsig" },
  48: { word: "achtundvierzig", pronunciation: "ajt-unt-fíatsig" },
  49: { word: "neunundvierzig", pronunciation: "nóin-unt-fíatsig" },
  50: { word: "fünfzig", pronunciation: "fünftsíj" },
  51: { word: "einundfünfzig", pronunciation: "áin-unt-fünftsíj" },
  52: { word: "zweiundfünfzig", pronunciation: "tsvai-unt-fünftsíj" },
  53: { word: "dreiundfünfzig", pronunciation: "drai-unt-fünftsíj" },
  54: { word: "vierundfünfzig", pronunciation: "fía-unt-fünftsíj" },
  55: { word: "fünfundfünfzig", pronunciation: "fünf-unt-fünftsíj" },
  56: { word: "sechsundfünfzig", pronunciation: "zeks-unt-fünftsíj" },
  57: { word: "siebenundfünfzig", pronunciation: "zíben-unt-fünftsíj" },
  58: { word: "achtundfünfzig", pronunciation: "ajt-unt-fünftsíj" },
  59: { word: "neunundfünfzig", pronunciation: "nóin-unt-fünftsíj" },
  60: { word: "sechzig", pronunciation: "zektsíj" },
  61: { word: "einundsechzig", pronunciation: "áin-unt-zektsíj" },
  62: { word: "zweiundsechzig", pronunciation: "tsvai-unt-zektsíj" },
  63: { word: "dreiundsechzig", pronunciation: "drai-unt-zektsíj" },
  64: { word: "vierundsechzig", pronunciation: "fía-unt-zektsíj" },
  65: { word: "fünfundsechzig", pronunciation: "fünf-unt-zektsíj" },
  66: { word: "sechsundsechzig", pronunciation: "zeks-unt-zektsíj" },
  67: { word: "siebenundsechzig", pronunciation: "zíben-unt-zektsíj" },
  68: { word: "achtundsechzig", pronunciation: "ajt-unt-zektsíj" },
  69: { word: "neunundsechzig", pronunciation: "nóin-unt-zektsíj" },
  70: { word: "siebzig", pronunciation: "zíptsíj" },
  71: { word: "einundsiebzig", pronunciation: "áin-unt-zíptsíj" },
  72: { word: "zweiundsiebzig", pronunciation: "tsvai-unt-zíptsíj" },
  73: { word: "dreiundsiebzig", pronunciation: "drai-unt-zíptsíj" },
  74: { word: "vierundsiebzig", pronunciation: "fía-unt-zíptsíj" },
  75: { word: "fünfundsiebzig", pronunciation: "fünf-unt-zíptsíj" },
  76: { word: "sechsundsiebzig", pronunciation: "zeks-unt-zíptsíj" },
  77: { word: "siebenundsiebzig", pronunciation: "zíben-unt-zíptsíj" },
  78: { word: "achtundsiebzig", pronunciation: "ajt-unt-zíptsíj" },
  79: { word: "neunundsiebzig", pronunciation: "nóin-unt-zíptsíj" },
  80: { word: "achtzig", pronunciation: "ajtsíj" },
  81: { word: "einundachtzig", pronunciation: "áin-unt-ajtsíj" },
  82: { word: "zweiundachtzig", pronunciation: "tsvai-unt-ajtsíj" },
  83: { word: "dreiundachtzig", pronunciation: "drai-unt-ajtsíj" },
  84: { word: "vierundachtzig", pronunciation: "fía-unt-ajtsíj" },
  85: { word: "fünfundachtzig", pronunciation: "fünf-unt-ajtsíj" },
  86: { word: "sechsundachtzig", pronunciation: "zeks-unt-ajtsíj" },
  87: { word: "siebenundachtzig", pronunciation: "zíben-unt-ajtsíj" },
  88: { word: "achtundachtzig", pronunciation: "ajt-unt-ajtsíj" },
  89: { word: "neunundachtzig", pronunciation: "nóin-unt-ajtsíj" },
  90: { word: "neunzig", pronunciation: "nóintsíj" },
  91: { word: "einundneunzig", pronunciation: "áin-unt-nóintsíj" },
  92: { word: "zweiundneunzig", pronunciation: "tsvai-unt-nóintsíj" },
  93: { word: "dreiundneunzig", pronunciation: "drai-unt-nóintsíj" },
  94: { word: "vierundneunzig", pronunciation: "fía-unt-nóintsíj" },
  95: { word: "fünfundneunzig", pronunciation: "fünf-unt-nóintsíj" },
  96: { word: "sechsundneunzig", pronunciation: "zeks-unt-nóintsíj" },
  97: { word: "siebenundneunzig", pronunciation: "zíben-unt-nóintsíj" },
  98: { word: "achtundneunzig", pronunciation: "ajt-unt-nóintsíj" },
  99: { word: "neunundneunzig", pronunciation: "nóin-unt-nóintsíj" },
  100: { word: "hundert", pronunciation: "húndert" }
};


const GermanLearningComponent = () => {
  const [textToTranslate, setTextToTranslate] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [showNumbers, setShowNumbers] = useState(false); 
  const [showSeinExercise, setShowSeinExercise] = useState(false); 
  const [showGermanPracticeExercise, setGermanPracticeExercise] = useState(false); 

  const [germanWord, setGermanWord] = useState(""); 
  const [pronunciation, setPronunciation] = useState("");
  const [showLegend, setShowLegend] = useState(false);

  // Función para manejar el checkbox de la leyenda
  const handleLegendToggle = (e) => {
    setShowLegend(e.target.checked); // Actualiza el estado cuando el checkbox es clicado
  };

  // Función para traducir el texto
  const handleTranslate = () => {
    translateText(textToTranslate, setTranslatedText);
  };

  // Función para buscar en el arreglo de números
  const translateNumberToGermanWord = (number) => {
    return numberToGermanWord[number] || { word: "", pronunciation: "" };
  };

  // Función para manejar la reproducción del audio
  const handlePlayAudio = () => {
    const number = parseInt(textToTranslate);

    // Verificar si es un número y está en el arreglo
    if (!isNaN(number) && numberToGermanWord[number]) {
      const { word } = translateNumberToGermanWord(number);
      playAudio(word, 'de-DE'); // Reproduce el número en alemán desde el JSON
    } else {
      playAudio(textToTranslate, 'de-DE'); // Reproduce el texto directamente si no es un número
    }
  };

  // Función para manejar cambios en el cuadro de texto
  const handleInputChange = (e) => {
    const input = e.target.value;
    setTextToTranslate(input);

    const number = parseInt(input);
    if (!isNaN(number)) {
      const { word, pronunciation } = translateNumberToGermanWord(number);
      setGermanWord(word);
      setPronunciation(pronunciation);
    } else {
      setGermanWord("");
      setPronunciation("");
    }
  };

  return (
    <div className="german-learning">
      <h2>Aprende Alemán</h2>

      {/* Tarjeta de conjugación del verbo sein */}
      <div className="card">
        <h3>Conjugación del Verbo Sein (ser/estar)</h3>
        <ul>
          <li><strong>Ich bin</strong> - Yo soy/estoy</li>
          <li><strong>Du bist</strong> - Tú eres/estás</li>
          <li><strong>Er/sie/es ist</strong> - Él/Ella/Neutro es/está</li>
          <li><strong>Wir sind</strong> - Nosotros somos/estamos</li>
          <li><strong>Ihr seid</strong> - Ustedes son/están</li>
          <li><strong>Sie sind</strong> - Ellos/Ellas son/están</li>
        </ul>
      </div>

      {/* Checkbox para mostrar/ocultar números */}
      <div className="checkbox-container">
        <input
          type="checkbox"
          id="showNumbers"
          checked={showNumbers}
          onChange={(e) => setShowNumbers(e.target.checked)}
        />
        <label htmlFor="showNumbers">Mostrar Números en Alemán</label>
      </div>
      <div className="checkbox-container">
        <input
          type="checkbox"
          id="showClass1"
          checked={showSeinExercise}
          onChange={(e) => setShowSeinExercise(e.target.checked)}
        />
        <label htmlFor="showClass1">Sein Excercise</label>
      </div>
        
       <div className="checkbox-container">
        <input
          type="checkbox"
          id="showClass2"
          checked={showGermanPracticeExercise}
          onChange={(e) => setGermanPracticeExercise(e.target.checked)}
        />
        <label htmlFor="showClass2">German Practice Excercise</label>
      </div>

      {/* Mostrar el componente de números si el checkbox está marcado */}
      {showNumbers && <GermanNumbersComponent />}
      {showSeinExercise && <SeinExercise />}
      {showGermanPracticeExercise && <GermanPracticeExercise />}
      {/* Tarjeta para escribir texto y traducirlo */}
      <div className="card">
        <h3>Escribe una frase en alemán para traducirla y escucharla</h3>
        <textarea
          value={textToTranslate}
          onChange={handleInputChange}
          rows="4"
          cols="50"
          placeholder="Escribe una frase en alemán o número..."
        />
        <br />
        {/* Mostrar la palabra en alemán si es un número */}
        {germanWord && (
          <p>Se escribe en alemán como: <strong>{germanWord}</strong></p>
        )}
        {/* Mostrar la pronunciación en español */}
        {pronunciation && (
          <p>Se pronuncia como: <strong>{pronunciation}</strong></p>
        )}

        {/* Checkbox para mostrar/ocultar la leyenda */}
        <div className="checkbox-container">
          <input 
            type="checkbox" 
            id="showLegend" 
            checked={showLegend}
            onChange={handleLegendToggle} 
          />
          <label htmlFor="showLegend">Ayuda sobre lectura de números</label>
        </div>

        {/* Mostrar la leyenda si el checkbox está marcado */}
        {showLegend && (
          <div className="legend">
            <h4>¿Cómo se leen los números en alemán?</h4>
            <p>
              En alemán, los números a partir del 21 se leen de manera inversa
              en comparación con el español e inglés. Mientras que en español
              diríamos "veintiuno" y en inglés "twenty-one", en alemán se dice{" "}
              <strong>einundzwanzig</strong>, que literalmente significa "uno y
              veinte".
            </p>
            <p>
              Este patrón continúa para los números siguientes. Por ejemplo:
              <ul>
                <li><strong>22:</strong> zweiundzwanzig (dos y veinte)</li>
                <li><strong>23:</strong> dreiundzwanzig (tres y veinte)</li>
                <li><strong>24:</strong> vierundzwanzig (cuatro y veinte)</li>
                <li>...y así sucesivamente hasta el 99.</li>
              </ul>
              La parte de las decenas ("zwanzig", "dreißig", etc.) aparece al
              final, y la unidad (1, 2, 3, etc.) aparece al principio,
              conectados por "und" (y).
            </p>
            <p>El número 100 es <strong>hundert</strong>.</p>
          </div>
        )}

        <button onClick={handlePlayAudio}>
          Escuchar en Alemán
        </button>
        <button onClick={handleTranslate}>Traducir al Español</button>
        {translatedText && (
          <div>
            <h4>Traducción:</h4>
            <p>{translatedText}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GermanLearningComponent;