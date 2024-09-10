import React, { useState } from 'react';

// Función para reproducir la pronunciación

const playAudio = (text, lang = 'de-DE') => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Lista todas las voces disponibles
    const voices = synth.getVoices();
  
    // Busca la voz que soporte el idioma alemán
    const germanVoice = voices.find(voice => voice.lang === lang);
  
    if (germanVoice) {
      utterance.voice = germanVoice; // Asigna la voz en alemán
    } else {
      console.error('No se encontró una voz en alemán.');
    }
  
    utterance.lang = lang;  // Asegura que el idioma sea alemán
    synth.speak(utterance);
  };
  

const GermanNumbersComponent = () => {
  const [activeNumber, setActiveNumber] = useState(null); // Estado para el número que se está leyendo
  const [isReadingAll, setIsReadingAll] = useState(false); // Estado para saber si está leyendo todos

  // Lista de números con su pronunciación en sílabas españolas
  const numbers = [
    { number: 1, german: 'Eins', spanishPronunciation: 'Ains' },
    { number: 2, german: 'Zwei', spanishPronunciation: 'Ts-vai' },
    { number: 3, german: 'Drei', spanishPronunciation: 'Drai' },
    { number: 4, german: 'Vier', spanishPronunciation: 'Fi-er' },
    { number: 5, german: 'Fünf', spanishPronunciation: 'Fünf' },
    { number: 6, german: 'Sechs', spanishPronunciation: 'Zeks' },
    { number: 7, german: 'Sieben', spanishPronunciation: 'Zi-ben' },
    { number: 8, german: 'Acht', spanishPronunciation: 'Ajt' },
    { number: 9, german: 'Neun', spanishPronunciation: 'Noin' },
    { number: 10, german: 'Zehn', spanishPronunciation: 'Tsein' },
    { number: 11, german: 'Elf', spanishPronunciation: 'El-f' },
    { number: 12, german: 'Zwölf', spanishPronunciation: 'Tsvölf' },
    { number: 13, german: 'Dreizehn', spanishPronunciation: 'Drai-tsen' },
    { number: 14, german: 'Vierzehn', spanishPronunciation: 'Fi-er-tsen' },
    { number: 15, german: 'Fünfzehn', spanishPronunciation: 'Fünf-tsen' },
    { number: 16, german: 'Sechzehn', spanishPronunciation: 'Zek-tsen' },
    { number: 17, german: 'Siebzehn', spanishPronunciation: 'Zi-b-tsen' },
    { number: 18, german: 'Achtzehn', spanishPronunciation: 'Ajt-tsen' },
    { number: 19, german: 'Neunzehn', spanishPronunciation: 'Noin-tsen' },
    { number: 20, german: 'Zwanzig', spanishPronunciation: 'Tsvan-tsig' },
    { number: 30, german: 'Dreißig', spanishPronunciation: 'Drai-sig' },
    { number: 40, german: 'Vierzig', spanishPronunciation: 'Fi-er-tsig' },
    { number: 50, german: 'Fünfzig', spanishPronunciation: 'Fünf-tsig' },
    { number: 60, german: 'Sechzig', spanishPronunciation: 'Zek-tsig' },
    { number: 70, german: 'Siebzig', spanishPronunciation: 'Zi-b-tsig' },
    { number: 80, german: 'Achtzig', spanishPronunciation: 'Ajt-tsig' },
    { number: 90, german: 'Neunzig', spanishPronunciation: 'Noin-tsig' },
    { number: 100, german: 'Hundert', spanishPronunciation: 'Hun-dert' }
  ];

  // Función para leer todos los números uno por uno
  const readAllNumbers = (index = 0) => {
    if (index >= numbers.length) {
      setIsReadingAll(false);
      setActiveNumber(null);
      return;  // Termina de leer todos
    }

    const currentNumber = numbers[index];

    setActiveNumber(currentNumber.number);  // Cambiar el número activo

    playAudio(currentNumber.german, 'de-DE', () => {
      // Al terminar de leer, pasar al siguiente número
      readAllNumbers(index + 1);
    });
  };

  const handleReadAll = () => {
    setIsReadingAll(true);
    readAllNumbers();
  };

  return (
    <div className="german-numbers-container">
      <h3>Números en Alemán con Pronunciación</h3>
      
      <button 
        className="read-all-button" 
        onClick={handleReadAll}
        disabled={isReadingAll} // Desactivar el botón mientras está leyendo todos
      >
        Leer todos los números
      </button>
      
      <ul className="german-numbers-list">
        {numbers.map(({ number, german, spanishPronunciation }) => (
          <li 
            key={number}
            style={{ color: activeNumber === number ? 'red' : 'black' }} // Cambiar el color si es el número activo
          >
            <button 
              onClick={() => playAudio(german, 'de-DE', () => setActiveNumber(null))}
            >
              {number} - {german} ({spanishPronunciation})
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GermanNumbersComponent;
