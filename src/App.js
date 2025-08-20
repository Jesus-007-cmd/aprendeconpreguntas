import React, { useState } from 'react';
import Menu from './components/Menu';

import QuizApp from './components/quizApp/QuizApp';
import CombineCSVFiles from './components/CombineCSVFiles';
import InterviewQuiz from './components/interview/InterviewQuiz';
import InterviewQuiz3D from './components/interview/InterviewQuiz3D';
import LearningEnglishWithQuestions from './components/learningEnglishWithQuestions/LearningEnglishWithQuestions';

// 👉 IMPORTA tus herramientas nuevas (ajusta rutas según tu estructura)
import AnalisisUnivariado from './AnalisisUnivariado/AnalisisUnivariado.jsx';
// Si tienes el conversor de Excel a JSON en otra carpeta, usa la que corresponda:
import ExcelToJsonConverter from './components/ExcelToJsonConverter.jsx';
// // o si lo tienes en /Herramientas:
// import ExcelToJsonConverter from './components/Herramientas/ExcelToJsonConverter.jsx';

function App() {
  const [selectedOption, setSelectedOption] = useState('');

  const hideQuizApp = () => setSelectedOption('');

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="sticky top-0 z-20">
        <Menu onSelectOption={setSelectedOption} />
      </header>

      <main className="container mx-auto py-8 px-4 relative">
        {selectedOption === 'quiz' && <QuizApp />}
        {selectedOption === 'CombineCSVFiles' && <CombineCSVFiles />}
        {selectedOption === 'interviewQuiz' && <InterviewQuiz />}
        {selectedOption === 'interviewQuiz3D' && <InterviewQuiz3D />}
        {selectedOption === 'LearningEnglishWithQuestions' && <LearningEnglishWithQuestions />}

        {/* ✅ NUEVO: opciones del submenú Herramientas */}
        {selectedOption === 'AnalisisUnivariado' && <AnalisisUnivariado />}
        {selectedOption === 'ExcelToJsonConverter' && <ExcelToJsonConverter />}

        {/* opcional: pantalla por defecto */}
        {!selectedOption && <div className="text-white/80">Selecciona una opción del menú.</div>}
      </main>

      {selectedOption && (
        <button
          onClick={hideQuizApp}
          className="fixed top-4 left-4 bg-yellow-400 text-gray-900 px-3 py-2 rounded-full shadow hover:bg-yellow-500 transition duration-200 z-30"
          title="Regresar al menú"
        >
          &#8592;
        </button>
      )}
    </div>
  );
}

export default App;
