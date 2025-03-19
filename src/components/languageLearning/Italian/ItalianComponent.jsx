import React, { useState } from 'react';
import ItalianArticlesTrainer from './learningItalian/ItalianArticlesTrainer';
import './ItalianComponent.css';

const ItalianComponent = () => {
  const [selectedComponent, setSelectedComponent] = useState(null);

  // Función para manejar la selección del componente
  const handleSelectComponent = (component) => {
    setSelectedComponent(component);
  };

  // Función para regresar al menú
  const handleExit = () => {
    setSelectedComponent(null);
  };

  return (
    <div className="italian-menu">
      <h1>Learn Italian</h1>
      {!selectedComponent && (
        <div className="menu-buttons">
          <button onClick={() => handleSelectComponent('articles')}>
            Learn Italian Articles
          </button>
          {/* Puedes agregar más botones para otros componentes */}
          <button onClick={() => handleSelectComponent('vocabulary')}>
            Learn Italian Vocabulary
          </button>
        </div>
      )}

      {/* Renderiza el componente seleccionado */}
      {selectedComponent === 'articles' && <ItalianArticlesTrainer onExit={handleExit} />}
      {/* Aquí puedes agregar más condiciones para otros componentes, como 'vocabulary' */}
    </div>
  );
};

export default ItalianComponent;
