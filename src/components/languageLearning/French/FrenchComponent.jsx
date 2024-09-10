import React, { useState } from "react";
import FrenchNumbersComponent from "./FrenchComponents/FrenchNumbersComponent"; // Importamos el componente de números en francés
import FrenchPracticeExercise from "./FrenchComponents/FrenchPracticeExercise"; // Importamos el componente de ejercicios
import FrenchPhraseExercise from "./FrenchComponents/FrenchPhraseExercise"; // Importamos el componente de frases

import "./FrenchComponent.css";

const FrenchComponent = () => {
  const [showFrenchNumbers, setShowFrenchNumbers] = useState(false); // Estado para mostrar/ocultar los números en francés
  const [showPracticeExercise, setShowPracticeExercise] = useState(false); // Estado para mostrar/ocultar el ejercicio de práctica
  const [showPhraseExercise, setShowPhraseExercise] = useState(false); // Estado para mostrar/ocultar el ejercicio de frases
  return (
    <div className="french-learning">
      <h2>Apprendre le Français</h2>

      {/* Checkbox para mostrar/ocultar números en francés */}
      <div className="checkbox-container">
        <input
          type="checkbox"
          id="showFrenchNumbers"
          checked={showFrenchNumbers}
          onChange={(e) => setShowFrenchNumbers(e.target.checked)}
        />
        <label htmlFor="showFrenchNumbers">Mostrar Números en Francés</label>
      </div>

      {/* Checkbox para mostrar/ocultar el ejercicio de práctica */}
      <div className="checkbox-container">
        <input
          type="checkbox"
          id="showPracticeExercise"
          checked={showPracticeExercise}
          onChange={(e) => setShowPracticeExercise(e.target.checked)}
        />
        <label htmlFor="showPracticeExercise">
          Ejercicio de Práctica de Francés
        </label>
      </div>
      {/* Checkbox para mostrar/ocultar el ejercicio de frases en francés */}
      <div className="checkbox-container">
        <input
          type="checkbox"
          id="showPhraseExercise"
          checked={showPhraseExercise}
          onChange={(e) => setShowPhraseExercise(e.target.checked)}
        />
        <label htmlFor="showPhraseExercise">Mostrar Ejercicio de Frases</label>
      </div>
      {/* Mostrar el componente de números si el checkbox está marcado */}
      {showFrenchNumbers && <FrenchNumbersComponent />}
      {/* Mostrar el componente de frases si el checkbox está marcado */}
      {showPhraseExercise && <FrenchPhraseExercise />}

      {/* Mostrar el componente de ejercicio de práctica si el checkbox está marcado */}
      {showPracticeExercise && <FrenchPracticeExercise />}
    </div>
  );
};

export default FrenchComponent;
