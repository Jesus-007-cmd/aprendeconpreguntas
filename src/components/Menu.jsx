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
            Quiz All Languages
          </div>
          
        </div>
      )}
    </div>
  );
};

export default Menu;
