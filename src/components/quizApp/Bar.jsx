import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

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
      <div className="flex space-x-2 p-4 bg-gray-800 rounded shadow-md">
        {incorrectQuestions.map((question, index) => (
          <div
            key={index}
            className="cursor-pointer text-xl hover:text-gray-300"
            onClick={() => openModal(question)}
          >
            ❓
          </div>
        ))}
      </div>
      {selectedQuestion && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Pregunta Incorrecta"
          className="bg-gray-800 text-white p-6 rounded shadow-lg max-w-lg mx-auto mt-20"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <h2 className="text-xl font-semibold mb-4">{selectedQuestion["Question Text"]}</h2>
          <ul className="list-disc list-inside mb-4">
            {selectedQuestion["options"].map((option, index) => (
              <li key={index}>{option}</li>
            ))}
          </ul>
          <button
            onClick={closeModal}
            className="bg-red-600 hover:bg-red-700 py-2 px-4 rounded"
          >
            Cerrar
          </button>
        </Modal>
      )}
    </div>
  );
};

export default Bar;