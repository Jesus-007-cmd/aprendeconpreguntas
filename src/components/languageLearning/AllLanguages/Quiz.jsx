import React, { useState } from 'react';

import './Quiz.css';  

const questions = [
  {
    question: "Portugués.- estoy aprendiendo portugués",
    options: [
      { answer: "Eu esta aprendendo português", isCorrect: false },
      { answer: "Eu estou aprendendo português", isCorrect: true }
    ]
  },
  {
    question: "Italiano.- disculpa",
    options: [
      { answer: "Scusi!", isCorrect: false },
      { answer: "Scusa!", isCorrect: true }
    ]
  },
  {
    question: "Italiano.- Hola",
    options: [
      { answer: "A domani", isCorrect: false },
      { answer: "Ciao", isCorrect: true }
    ]
  },
  {
    question: "Japonés.- equipo",
    options: [
      { answer: "きき", isCorrect: true },  // Respuesta correcta: "equipo" (kiki)
      { answer: "いく", isCorrect: false }
    ]
  },
  {
    question: "Francés.- Muy bien",
    options: [
      { answer: "Très bien", isCorrect: true },
      { answer: "bien", isCorrect: false }
    ]
  },
  {
    question: "Francés.- ¿cómo estás? ¿estás bien?",
    options: [
      { answer: "Comme est tu ?", isCorrect: false },
      { answer: "Ça va ?", isCorrect: true }
    ]
  },
  {
    question: "Deutsch.- tú eres/estás",
    options: [
      { answer: "Ich bin", isCorrect: false },
      { answer: "Du bist", isCorrect: true }
    ]
  },
  {
    question: "Deutsch.- todos somos buenas personas",
    options: [
      { answer: "Wir sind alle guten Menschen", isCorrect: true },
      { answer: "Wir bin alle guten Menschen", isCorrect: false }
    ]
  },
  {
    question: "Portugués.- Ella es muy bonita",
    options: [
      { answer: "Ela é muito bonita", isCorrect: true },
      { answer: "Elas são muito bonitas", isCorrect: false }
    ]
  },
  {
    question: "Portugués.- nuestros amigos son brasileños",
    options: [
      { answer: "Nossos amigos são brasileiros", isCorrect: true },
      { answer: "Nossos amigos son brasileiros", isCorrect: false }
    ]
  },
  {
    question: "Japonés.- Escribir",
    options: [
      { answer: "かく", isCorrect: true },  // "Escribir" (kaku)
      { answer: "きき", isCorrect: false }
    ]
  },
  {
    question: "Deutsch.- Nosotros somos amigos",
    options: [
      { answer: "Wir sind Freunde", isCorrect: true },
      { answer: "er ist Freunde", isCorrect: false }
    ]
  },
  {
    question: "Italiano.- Ciao (despedida)",
    options: [
      { answer: "Hola / Tchau!", isCorrect: true },
      { answer: "Adiós", isCorrect: false }
    ]
  },
  {
    question: "Italiano.- Buongiorno",
    options: [
      { answer: "Buenos días", isCorrect: true },
      { answer: "Buenas noches", isCorrect: false }
    ]
  },
  {
    question: "Japonés.- Escribir (かく)",
    options: [
      { answer: "かく (書く) [kaku]", isCorrect: true },  // Correcto
      { answer: "きき (機器) [kiki]", isCorrect: false }
    ]
  },
  {
    question: "Japonés.- Volver a casa",
    options: [
      { answer: "きこく (帰国) [kikoku]", isCorrect: true },  // Correcto
      { answer: "いく (行く) [iku]", isCorrect: false }
    ]
  },
  {
    question: "Deutsch.- tú eres/estás",
    options: [
      { answer: "Ich bin", isCorrect: false },
      { answer: "Du bist", isCorrect: true }
    ]
  },
  {
    question: "Deutsch.- todos somos buenas personas",
    options: [
      { answer: "Wir sind alle guten Menschen", isCorrect: true },
      { answer: "Wir bin alle guten Menschen", isCorrect: false }
    ]
  },
  {
    question: "Portugués.- Ella es muy bonita",
    options: [
      { answer: "Ela é muito bonita", isCorrect: true },
      { answer: "Elas são muito bonitas", isCorrect: false }
    ]
  }
];

// Lista de palabras con su romaji y audios
const pronunciationList = [
    // Japonés
    { kana: "きき", romaji: "kiki", lang: "ja-JP" },    // equipo
    { kana: "かく", romaji: "kaku", lang: "ja-JP" },    // escribir
    { kana: "いく", romaji: "iku", lang: "ja-JP" },     // ir
    { kana: "チーム", romaji: "chiimu", lang: "ja-JP" }, // equipo (grupo)
    { kana: "きこく", romaji: "kikoku", lang: "ja-JP" }, // volver a casa
    { kana: "かき", romaji: "kaki", lang: "ja-JP" },    // caqui (fruto)
    { kana: "きかい", romaji: "kikai", lang: "ja-JP" }, // máquina
    { kana: "いけ", romaji: "ike", lang: "ja-JP" },     // estanque
    { kana: "こけ", romaji: "koke", lang: "ja-JP" },    // musgo
    { kana: "くき", romaji: "kuki", lang: "ja-JP" },    // tallo
    { kana: "か", romaji: "ka", lang: "ja-JP" },        // mosquito
    { kana: "かい", romaji: "kai", lang: "ja-JP" },     // reunión
    { kana: "き", romaji: "ki", lang: "ja-JP" },        // árbol
  
    // Francés
    { kana: "Ça va", romaji: "sa va", lang: "fr-FR" },  // ¿cómo estás?
    { kana: "Très bien", romaji: "tre bien", lang: "fr-FR" },  // muy bien
  
    // Italiano
    { kana: "Ciao", romaji: "chao", lang: "it-IT" },    // Hola/Adiós
    { kana: "Buongiorno", romaji: "bwon-zhor-no", lang: "it-IT" }, // Buenos días
    { kana: "Buonasera", romaji: "bwona-seh-ra", lang: "it-IT" },  // Buenas tardes/noches
    { kana: "Buonanotte", romaji: "bwona-not-te", lang: "it-IT" }, // Buenas noches (despedida)
    { kana: "Arrivederci", romaji: "a-ree-veh-der-chee", lang: "it-IT" },  // Adiós
    { kana: "Grazie", romaji: "gratz-ye", lang: "it-IT" },  // Gracias
    { kana: "Per favore", romaji: "per fa-vo-re", lang: "it-IT" }, // Por favor
    { kana: "Come stai?", romaji: "co-me sta-i", lang: "it-IT" }, // ¿Cómo estás?
  
    // Alemán
    { kana: "Du bist", romaji: "du bist", lang: "de-DE" },  // Tú eres/estás
    { kana: "Wir sind", romaji: "veer zind", lang: "de-DE" }, // Nosotros somos/estamos
    { kana: "Freunde", romaji: "froyn-de", lang: "de-DE" }   // amigos
  ];
  

// Función para reproducir la pronunciación
const playAudio = (text, lang) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    if(lang==="ja-JP")
        utterance.volume =1.0; 
    
    else
    utterance.volume = 0.5 ; 
    const findVoice = () => {
      const voices = synth.getVoices();
      const selectedVoice = voices.find((voice) => voice.lang === lang);
  
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        utterance.lang = lang;
        synth.speak(utterance);
      } else {
        console.error("No se encontró una voz para el idioma especificado.");
      }
    };
  
    if (!synth.getVoices().length) {
      synth.onvoiceschanged = findVoice;
    } else {
      findVoice();
    }
  };
  
  
  const Quiz = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
  
    const handleAnswerButtonClick = (isCorrect) => {
      if (isCorrect) {
        setScore(score + 1);
      }
  
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
      } else {
        setShowScore(true);
      }
    };
  
    return (
      <div className="container">
        <h1>Aprender Idiomas</h1>
        {showScore ? (
          <div>
            <div className="score-section">
              Has obtenido {score} de {questions.length} respuestas correctas.
            </div>
            {/* Sección de pronunciaciones */}
            <div className="pronunciation-section">
              <h3>Lista de pronunciación:</h3>
              <ul>
                {pronunciationList.map((item, index) => (
                  <li key={index}>
                    <strong className="text">{item.kana} ({item.romaji})</strong>
                    {/* Ahora pasamos el idioma correcto */}
                    <button onClick={() => playAudio(item.romaji, item.lang)}>Escuchar</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="question-section">
              <div className="question-count">
                <span>Pregunta {currentQuestion + 1}</span>/{questions.length}
              </div>
              <div className="question-text">{questions[currentQuestion].question}</div>
            </div>
            <div className="answer-section">
              {questions[currentQuestion].options.map((option, index) => (
                <button key={index} onClick={() => handleAnswerButtonClick(option.isCorrect)}>
                  {option.answer}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default Quiz;