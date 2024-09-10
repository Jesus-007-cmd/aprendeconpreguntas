// Bar.js
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './Bar.css';

const Bar = ({ incorrectQuestions }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  useEffect(() => {
    localStorage.setItem('incorrectQuestions', JSON.stringify(incorrectQuestions));
  }, [incorrectQuestions]);

  const openModal = (question) => {
    setSelectedQuestion(question);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedQuestion(null);
  };

  return (
    <div>
      <div className="bar">
        {incorrectQuestions.map((question, index) => (
          <div key={index} className="icon" onClick={() => openModal(question)}>
            ❓
          </div>
        ))}
      </div>
      {selectedQuestion && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Pregunta Incorrecta"
        >
          <h2>{selectedQuestion["Question Text"]}</h2>
          <ul>
            {selectedQuestion["options"].map((option, index) => (
              <li key={index}>{option}</li>
            ))}
          </ul>
          <button onClick={closeModal}>Cerrar</button>
        </Modal>
      )}
    </div>
  );
};

export default Bar;
