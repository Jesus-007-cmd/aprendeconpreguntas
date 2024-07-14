// App.js
import React from 'react';
import './App.css';
import QuizApp from './QuizApp';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function App() {
  return (
    <div className="App">
      <header className="App-header">
        
        <QuizApp />
      </header>
    </div>
  );
}

export default App;
