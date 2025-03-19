import React, { useState } from 'react';

const Menu = ({ onSelectOption }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="menu">
      <div className="menu-item" onClick={() => onSelectOption('quiz')}>
        Cuestionario
      </div>
      <div className="menu-item" onClick={() => onSelectOption('CombineCSVFiles')}>
        Herramientas
      </div>
      <div className="menu-item" onClick={handleDropdownToggle}>
        Pronunciación {isDropdownOpen ? '▲' : '▼'}
      </div>
      {isDropdownOpen && (
        <div className="dropdown">
          <div className="dropdown-item" onClick={() => onSelectOption('german')}>
            Alemán
          </div>
          <div className="dropdown-item" onClick={() => onSelectOption('french')}>
            Francés
          </div>
          <div className="dropdown-item" onClick={() => onSelectOption('japanese')}>
            Japonés
          </div>
          <div className="dropdown-item" onClick={() => onSelectOption('portuguese')}>
            Portugués
          </div>
          <div className="dropdown-item" onClick={() => onSelectOption('italian')}>
            Italiano
          </div>
          <div className="dropdown-item" onClick={() => onSelectOption('english')}>
            Inglés
          </div>
          <div className="dropdown-item" onClick={() => onSelectOption('QuizAllLanguages')}>
            Quiz All Languages
          </div>
          <div className="dropdown-item" onClick={() => onSelectOption('WordDisplayAllLanguagesComponent')}>
            Word Display All Languages
          </div>
          <div className="dropdown-item" onClick={() => onSelectOption('SpacedRepetition')}>
          Spaced Repetition
          </div>
          <div className="dropdown-item" onClick={() => onSelectOption('QuizAppAllLanguages')}>
          Quiz Audio
          </div>
          <div className="dropdown-item" onClick={() => onSelectOption('QuizAppAllLanguages2')}>
          Quiz Audio 190
          </div>
          
        </div>
      )}
    </div>
  );
};

export default Menu;
