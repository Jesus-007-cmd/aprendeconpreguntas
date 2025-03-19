import React, { useState } from "react";

import { Tooltip } from "react-tooltip"; // Importa Tooltip en lugar de ReactTooltip
import "./ItalianArticlesTrainer.css";
// JSON para el quiz con preguntas y respuestas
const quizData = [
  {
    id: 1,
    question: "¿Qué artículo va con 'gatto' (gato)?",
    determined: "il",
    undetermined: "un",
  },
  {
    id: 2,
    question: "¿Qué artículo va con 'casa' (casa)?",
    determined: "la",
    undetermined: "una",
  },
  {
    id: 3,
    question: "¿Qué artículo va con 'ragazzi' (chicos)?",
    determined: "i",
    undetermined: "dei",
  },
  {
    id: 4,
    question: "¿Qué artículo va con 'amici' (amigos)?",
    determined: "gli",
    undetermined: "degli",
  },
  {
    id: 5,
    question: "¿Qué artículo va con 'libro' (libro)?",
    determined: "il",
    undetermined: "un",
  },
  {
    id: 6,
    question: "¿Qué artículo va con 'mela' (manzana)?",
    determined: "la",
    undetermined: "una",
  },
  {
    id: 7,
    question: "¿Qué artículo va con 'studente' (estudiante)?",
    determined: "lo",
    undetermined: "uno",
  },
  {
    id: 8,
    question: "¿Qué artículo va con 'automobile' (automóvil)?",
    determined: "l'",
    undetermined: "un'",
  },
  {
    id: 9,
    question: "¿Qué artículo va con 'zaino' (mochila)?",
    determined: "lo",
    undetermined: "uno",
  },
  {
    id: 10,
    question: "¿Qué artículo va con 'giornale' (periódico)?",
    determined: "il",
    undetermined: "un",
  },
  {
    id: 11,
    question: "¿Qué artículo va con 'bambini' (niños)?",
    determined: "i",
    undetermined: "dei",
  },
  {
    id: 12,
    question: "¿Qué artículo va con 'donne' (mujeres)?",
    determined: "le",
    undetermined: "delle",
  },
  {
    id: 13,
    question: "¿Qué artículo va con 'notte' (noche)?",
    determined: "la",
    undetermined: "una",
  },
  {
    id: 14,
    question: "¿Qué artículo va con 'professore' (profesor)?",
    determined: "il",
    undetermined: "un",
  },
  {
    id: 15,
    question: "¿Qué artículo va con 'università' (universidad)?",
    determined: "l'",
    undetermined: "un'",
  },
  {
    id: 16,
    question: "¿Qué artículo va con 'bicicletta' (bicicleta)?",
    determined: "la",
    undetermined: "una",
  },
  {
    id: 17,
    question: "¿Qué artículo va con 'frutta' (fruta)?",
    determined: "la",
    undetermined: "una",
  },
  {
    id: 18,
    question: "¿Qué artículo va con 'vino' (vino)?",
    determined: "il",
    undetermined: "un",
  },
  {
    id: 19,
    question: "¿Qué artículo va con 'macchina' (coche)?",
    determined: "la",
    undetermined: "una",
  },
  {
    id: 20,
    question: "¿Qué artículo va con 'stazione' (estación)?",
    determined: "la",
    undetermined: "una",
  },
  {
    id: 21,
    question: "¿Qué artículo va con 'finestra' (ventana)?",
    determined: "la",
    undetermined: "una",
  },
  {
    id: 22,
    question: "¿Qué artículo va con 'cane' (perro)?",
    determined: "il",
    undetermined: "un",
  },
  {
    id: 23,
    question: "¿Qué artículo va con 'amico' (amigo)?",
    determined: "l'",
    undetermined: "un",
  },
  {
    id: 24,
    question: "¿Qué artículo va con 'professoressa' (profesora)?",
    determined: "la",
    undetermined: "una",
  },
  {
    id: 25,
    question: "¿Qué artículo va con 'idea' (idea)?",
    determined: "l'",
    undetermined: "un'",
  },
  {
    id: 26,
    question: "¿Qué artículo va con 'telefono' (teléfono)?",
    determined: "il",
    undetermined: "un",
  },
  {
    id: 27,
    question: "¿Qué artículo va con 'quaderno' (cuaderno)?",
    determined: "il",
    undetermined: "un",
  },
  {
    id: 28,
    question: "¿Qué artículo va con 'esame' (examen)?",
    determined: "l'",
    undetermined: "un",
  },
  {
    id: 29,
    question: "¿Qué artículo va con 'sedia' (silla)?",
    determined: "la",
    undetermined: "una",
  },
  {
    id: 30,
    question: "¿Qué artículo va con 'ombrello' (paraguas)?",
    determined: "l'",
    undetermined: "un",
  },
  {
    id: 31,
    question: "¿Qué artículo va con 'pane' (pan)?",
    determined: "il",
    undetermined: "un",
  },
  {
    id: 32,
    question: "¿Qué artículo va con 'fiume' (río)?",
    determined: "il",
    undetermined: "un",
  },
  {
    id: 33,
    question: "¿Qué artículo va con 'penna' (pluma)?",
    determined: "la",
    undetermined: "una",
  },
  {
    id: 34,
    question: "¿Qué artículo va con 'profumo' (perfume)?",
    determined: "il",
    undetermined: "un",
  },
  {
    id: 35,
    question: "¿Qué artículo va con 'tempo' (tiempo)?",
    determined: "il",
    undetermined: "un",
  },
  {
    id: 36,
    question: "¿Qué artículo va con 'occhiali' (gafas)?",
    determined: "gli",
    undetermined: "degli",
  },
  {
    id: 37,
    question: "¿Qué artículo va con 'chiavi' (llaves)?",
    determined: "le",
    undetermined: "delle",
  },
  {
    id: 38,
    question: "¿Qué artículo va con 'luce' (luz)?",
    determined: "la",
    undetermined: "una",
  },
  {
    id: 39,
    question: "¿Qué artículo va con 'strada' (calle)?",
    determined: "la",
    undetermined: "una",
  },
  {
    id: 40,
    question: "¿Qué artículo va con 'pioggia' (lluvia)?",
    determined: "la",
    undetermined: "una",
  },
  {
    id: 41,
    question: "¿Qué artículo va con 'sole' (sol)?",
    determined: "il",
    undetermined: "un",
  },
  {
    id: 42,
    question: "¿Qué artículo va con 'giorni' (días)?",
    determined: "i",
    undetermined: "dei",
  },
  {
    id: 43,
    question: "¿Qué artículo va con 'amiche' (amigas)?",
    determined: "le",
    undetermined: "delle",
  },
  {
    id: 44,
    question: "¿Qué artículo va con 'libri' (libros)?",
    determined: "i",
    undetermined: "dei",
  },
  {
    id: 45,
    question: "¿Qué artículo va con 'vacanze' (vacaciones)?",
    determined: "le",
    undetermined: "delle",
  },
  {
    id: 46,
    question: "¿Qué artículo va con 'scuola' (escuela)?",
    determined: "la",
    undetermined: "una",
  },
  {
    id: 47,
    question: "¿Qué artículo va con 'spiaggia' (playa)?",
    determined: "la",
    undetermined: "una",
  },
  {
    id: 48,
    question: "¿Qué artículo va con 'storia' (historia)?",
    determined: "la",
    undetermined: "una",
  },
  {
    id: 49,
    question: "¿Qué artículo va con 'studenti' (estudiantes)?",
    determined: "gli",
    undetermined: "degli",
  },
  {
    id: 50,
    question: "¿Qué artículo va con 'treno' (tren)?",
    determined: "il",
    undetermined: "un",
  },
];

// Lista de artículos en italiano
const articlesData = [
  {
    id: 1,
    article: "il",
    type: "Determinado",
    gender: "Masculino",
    number: "Singular",
    usage:
      "Se usa con sustantivos masculinos singulares que comienzan con consonante.",
    examples: "il gatto (el gato), il libro (el libro)",
  },
  {
    id: 2,
    article: "lo",
    type: "Determinado",
    gender: "Masculino",
    number: "Singular",
    usage:
      "Se usa con sustantivos masculinos singulares que comienzan con s+consonante, z, ps, gn, x.",
    examples: "lo zaino (la mochila), lo studente (el estudiante)",
  },
  {
    id: 3,
    article: "la",
    type: "Determinado",
    gender: "Femenino",
    number: "Singular",
    usage:
      "Se usa con sustantivos femeninos singulares que comienzan con consonante.",
    examples: "la casa (la casa), la macchina (el coche)",
  },
  {
    id: 4,
    article: "l'",
    type: "Determinado",
    gender: "Masculino/Femenino",
    number: "Singular",
    usage: "Se usa con sustantivos que comienzan con vocal.",
    examples: "l'amico (el amigo), l'acqua (el agua)",
  },
  {
    id: 5,
    article: "i",
    type: "Determinado",
    gender: "Masculino",
    number: "Plural",
    usage:
      "Se usa con sustantivos masculinos plurales que comienzan con consonante.",
    examples: "i ragazzi (los chicos), i libri (los libros)",
  },
  {
    id: 6,
    article: "gli",
    type: "Determinado",
    gender: "Masculino",
    number: "Plural",
    usage:
      "Se usa con sustantivos masculinos plurales que comienzan con vocal, s+consonante, z, ps, gn, x.",
    examples: "gli amici (los amigos), gli zaini (las mochilas)",
  },
  {
    id: 7,
    article: "le",
    type: "Determinado",
    gender: "Femenino",
    number: "Plural",
    usage:
      "Se usa con sustantivos femeninos plurales, independientemente de la letra inicial.",
    examples: "le ragazze (las chicas), le case (las casas)",
  },
  {
    id: 8,
    article: "un",
    type: "Indeterminado",
    gender: "Masculino",
    number: "Singular",
    usage:
      "Se usa con sustantivos masculinos singulares que comienzan con consonante.",
    examples: "un gatto (un gato), un libro (un libro)",
  },
  {
    id: 9,
    article: "uno",
    type: "Indeterminado",
    gender: "Masculino",
    number: "Singular",
    usage:
      "Se usa con sustantivos masculinos singulares que comienzan con s+consonante, z, ps, gn, x.",
    examples: "uno zaino (una mochila), uno studente (un estudiante)",
  },
  {
    id: 10,
    article: "una",
    type: "Indeterminado",
    gender: "Femenino",
    number: "Singular",
    usage:
      "Se usa con sustantivos femeninos singulares que comienzan con consonante.",
    examples: "una casa (una casa), una macchina (un coche)",
  },
  {
    id: 11,
    article: "un'",
    type: "Indeterminado",
    gender: "Femenino",
    number: "Singular",
    usage: "Se usa con sustantivos femeninos que comienzan con vocal.",
    examples: "un'amica (una amiga), un'idea (una idea)",
  },
  {
    id: 12,
    article: "degli",
    type: "Indeterminado",
    gender: "Masculino",
    number: "Plural",
    usage:
      "Se usa con sustantivos masculinos plurales que comienzan con vocal, s+consonante, z, ps, gn, x.",
    examples: "degli amici (unos amigos), degli studenti (unos estudiantes)",
  },
  {
    id: 13,
    article: "delle",
    type: "Indeterminado",
    gender: "Femenino",
    number: "Plural",
    usage: "Se usa con sustantivos femeninos plurales.",
    examples: "delle ragazze (unas chicas), delle case (unas casas)",
  },
  {
    id: 14,
    article: "dei",
    type: "Indeterminado",
    gender: "Masculino",
    number: "Plural",
    usage:
      "Se usa con sustantivos masculinos plurales que comienzan con consonante.",
    examples: "dei ragazzi (unos chicos), dei libri (unos libros)",
  },
];

// Función para sintetizar voz usando la Web Speech API
const handleSpeech = (text) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "it-IT"; // Configura el idioma a italiano
  speechSynthesis.speak(utterance);
};

const ItalianArticlesTrainer = ({ onExit }) => {
  // Estado para almacenar las respuestas ingresadas por el usuario
  const [userAnswers, setUserAnswers] = useState(
    quizData.map(() => ({ determined: "", undetermined: "" }))
  );

  // Estado para almacenar los resultados de la validación
  const [results, setResults] = useState([]);

  // Función para manejar el cambio en los campos de texto
  const handleInputChange = (index, type, value) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[index][type] = value;
    setUserAnswers(updatedAnswers);
  };

  // Función para validar las respuestas del usuario
  const validateAnswers = () => {
    const results = quizData.map((item, index) => {
      const determinedCorrect =
        userAnswers[index].determined.toLowerCase() === item.determined;
      const undeterminedCorrect =
        userAnswers[index].undetermined.toLowerCase() === item.undetermined;
      return {
        question: item.question,
        determinedCorrect,
        undeterminedCorrect,
        correctDetermined: item.determined,
        correctUndetermined: item.undetermined,
      };
    });

    // Actualizamos el estado de resultados
    setResults(results);
  };
  const extractWord = (text) => {
    const match = text.match(/'([^']+)'/); // Expresión regular para encontrar las palabras entre ''
    return match ? match[1] : null;
  };

  return (
    <div className="principal-container">
      <h2>Artículos en Italiano</h2>
      <table className="articles-table">
        <thead>
          <tr>
            <th>Artículo</th>
            <th>Tipo</th>
            <th>Género</th>
            <th>Número</th>
            <th>Uso</th>
            <th>Ejemplos</th>
          </tr>
        </thead>
        <tbody>
          {articlesData.map((item) => (
            <tr key={item.id}>
              <td
                className="article"
                onClick={() => handleSpeech(item.article)}
              >
                {item.article}
              </td>
              <td>{item.type}</td>
              <td>{item.gender}</td>
              <td>{item.number}</td>
              <td>{item.usage}</td>
              <td>{item.examples}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Sección de quiz */}
      <div className="mini-quiz">
        <h1>Mini Quiz</h1>

        <table className="quiz-table">
          <thead>
            <tr>
              <th>Pregunta</th>
              <th>Artículo Determinado</th>
              <th>Artículo Indeterminado</th>
            </tr>
          </thead>
          <tbody>
            {quizData.map((item, index) => {
              const determinedArticleInfo = articlesData.find(
                (article) => article.article === item.determined
              );
              const undeterminedArticleInfo = articlesData.find(
                (article) => article.article === item.undetermined
              );
            //  const wordToSpeak = extractWord(item.question); // Extraer la palabra en italiano
              return (
                <tr key={item.id}>
                  {/* Columna con la pregunta */}
                  <td>
                    {/* Si se encuentra la palabra entre comillas simples, agrega el evento onClick para leerla */}
                    <label
                      onClick={() => {
                        const wordToSpeak = extractWord(item.question); // Extraer palabra en comillas simples
                        if (wordToSpeak) {
                          handleSpeech(wordToSpeak); // Leer la palabra en italiano
                        }
                      }}
                    >
                      {item.question}
                    </label>
                    <span
                      id={`tooltip-${item.id}`}
                      className="tooltip-icon"
                      data-tooltip-content={
                        determinedArticleInfo
                          ? `Artículo determinado: ${determinedArticleInfo.article}, Uso: ${determinedArticleInfo.usage}, Ejemplos: ${determinedArticleInfo.examples}`
                          : "No hay información disponible"
                      }
                    >
                      ❔
                    </span>
                    <Tooltip
                      anchorId={`tooltip-${item.id}`}
                      place="top"
                      effect="solid"
                    />
                    {/* Tooltip para el artículo indeterminado */}
                    {undeterminedArticleInfo && (
                      <span
                        id={`tooltip-undetermined-${item.id}`}
                        className="tooltip-icon"
                        data-tooltip-content={`Artículo indeterminado: ${undeterminedArticleInfo.article}, Uso: ${undeterminedArticleInfo.usage}, Ejemplos: ${undeterminedArticleInfo.examples}`}
                      >
                        ❔
                      </span>
                    )}
                    <Tooltip
                      anchorId={`tooltip-undetermined-${item.id}`}
                      place="top"
                      effect="solid"
                    />
                  </td>

                  {/* Columna con el campo de texto para el artículo determinado */}
                  <td>
                    <input
                      type="text"
                      value={userAnswers[index].determined}
                      onChange={(e) =>
                        handleInputChange(index, "determined", e.target.value)
                      }
                    />
                  </td>

                  {/* Columna con el campo de texto para el artículo indeterminado */}
                  <td>
                    <input
                      type="text"
                      value={userAnswers[index].undetermined}
                      onChange={(e) =>
                        handleInputChange(index, "undetermined", e.target.value)
                      }
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="quiz-buttons">
          <button
            onClick={() =>
              setUserAnswers(
                quizData.map(() => ({ determined: "", undetermined: "" }))
              )
            }
          >
            Borrar Respuestas
          </button>
          <button onClick={validateAnswers}>Calificar</button>
        </div>

        {/* Mostrar los resultados después de calificar */}
        {results.length > 0 && (
          <div className="results-section">
            <h2>Resultados:</h2>
            <ul>
              {results.map((result, index) => (
                <li key={index}>
                  {result.question}:
                  {/* Mostrar palomita o tacha para determinado */}
                  {result.determinedCorrect
                    ? " ✔️"
                    : ` ❌ (Correcto: ${result.correctDetermined})`}
                  -{/* Mostrar palomita o tacha para indeterminado */}
                  {result.undeterminedCorrect
                    ? " ✔️"
                    : ` ❌ (Correcto: ${result.correctUndetermined})`}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Botón para salir */}
      <button onClick={onExit} className="exit-button">
        Regresar al Menú
      </button>
    </div>
  );
};

export default ItalianArticlesTrainer;
