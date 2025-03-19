import React, { useState, useEffect } from "react";

// Lista de palabras para aprender con pronunciación
const words = [
    { "word": "Auto", "translation": "car", "lan": "de", "pronunciation": "auto", "language": "German" },
    { "word": "chien", "translation": "dog", "lan": "fr", "pronunciation": "shián", "language": "French" },
    { "word": "cachorro", "translation": "dog", "lan": "pt", "pronunciation": "kachorro", "language": "Portuguese" },
    { "word": "gatto", "translation": "cat", "lan": "it", "pronunciation": "gato", "language": "Italian" },
    { "word": "猫 (ねこ)", "translation": "cat", "lan": "ja", "pronunciation": "neko", "language": "Japanese" },
    { "word": "猫 (māo)", "translation": "cat", "lan": "zh", "pronunciation": "mao", "language": "Mandarin" },
    
    { "word": "Haus", "translation": "house", "lan": "de", "pronunciation": "haus", "language": "German" },
    { "word": "maison", "translation": "house", "lan": "fr", "pronunciation": "mesón", "language": "French" },
    { "word": "casa", "translation": "house", "lan": "pt", "pronunciation": "kasa", "language": "Portuguese" },
    { "word": "casa", "translation": "house", "lan": "it", "pronunciation": "kasa", "language": "Italian" },
    { "word": "家 (いえ)", "translation": "house", "lan": "ja", "pronunciation": "ie", "language": "Japanese" },
    { "word": "家 (jiā)", "translation": "house", "lan": "zh", "pronunciation": "jia", "language": "Mandarin" },
    
    { "word": "Brot", "translation": "bread", "lan": "de", "pronunciation": "brot", "language": "German" },
    { "word": "pain", "translation": "bread", "lan": "fr", "pronunciation": "pa", "language": "French" },
    { "word": "pão", "translation": "bread", "lan": "pt", "pronunciation": "páu", "language": "Portuguese" },
    { "word": "pane", "translation": "bread", "lan": "it", "pronunciation": "pane", "language": "Italian" },
    { "word": "パン (ぱん)", "translation": "bread", "lan": "ja", "pronunciation": "pan", "language": "Japanese" },
    { "word": "面包 (miànbāo)", "translation": "bread", "lan": "zh", "pronunciation": "mienbao", "language": "Mandarin" },
    
    { "word": "Wasser", "translation": "water", "lan": "de", "pronunciation": "vása", "language": "German" },
    { "word": "eau", "translation": "water", "lan": "fr", "pronunciation": "ó", "language": "French" },
    { "word": "água", "translation": "water", "lan": "pt", "pronunciation": "água", "language": "Portuguese" },
    { "word": "acqua", "translation": "water", "lan": "it", "pronunciation": "ákua", "language": "Italian" },
    { "word": "水 (みず)", "translation": "water", "lan": "ja", "pronunciation": "mizu", "language": "Japanese" },
    { "word": "水 (shuǐ)", "translation": "water", "lan": "zh", "pronunciation": "shuei", "language": "Mandarin" }
  ];

const SpacedRepetition = () => {
  const [index, setIndex] = useState(0); // Para seleccionar la palabra actual
  const [rememberedWords, setRememberedWords] = useState([]);
  const [forgottenWords, setForgottenWords] = useState([]);

  // Función para avanzar a la siguiente palabra
  const nextWord = (remembered) => {
    if (remembered) {
      setRememberedWords([...rememberedWords, words[index]]);
    } else {
      setForgottenWords([...forgottenWords, words[index]]);
    }

    const newIndex = (index + 1) % words.length; // Rotar las palabras
    setIndex(newIndex);
  };

  // Efecto para reintroducir palabras olvidadas después de un tiempo
  useEffect(() => {
    if (forgottenWords.length > 0) {
      const timer = setTimeout(() => {
        setIndex(words.indexOf(forgottenWords[0]));
        setForgottenWords(forgottenWords.slice(1));
      }, 5000); // Reintroducir palabra olvidada cada 5 segundos
      return () => clearTimeout(timer);
    }
  }, [forgottenWords]);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial", textAlign: "center" }}>
      <h2>Spaced Repetition for Language Learning</h2>
      <h3>{words[index].language} ({words[index].lan})</h3>
      <p style={{ fontSize: "24px" }}>
        {words[index].word} - {words[index].translation} <br />
        <em>Pronunciation: {words[index].pronunciation}</em>
      </p>
      <div>
        <button onClick={() => nextWord(true)} style={{ marginRight: "10px" }}>
          I remembered
        </button>
        <button onClick={() => nextWord(false)}>I forgot</button>
      </div>
      <div style={{ marginTop: "20px" }}>
        <h4>Remembered Words: {rememberedWords.length}</h4>
        <h4>Forgotten Words: {forgottenWords.length}</h4>
      </div>
    </div>
  );
};

export default SpacedRepetition;
