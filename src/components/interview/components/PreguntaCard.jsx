import React from "react";

export default function PreguntaCard({ pregunta }) {
  return (
    <div className="bg-[#1e1e1e] text-white p-4 rounded shadow-lg w-full h-full flex flex-col justify-between items-center">
      <h2 className="text-lg font-bold text-center">{pregunta.word}</h2>
      <ul className="mt-4 w-full space-y-2">
        {pregunta.options.map((opt, idx) => (
          <li
            key={idx}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-center cursor-pointer transition duration-200"
          >
            {idx + 1}. {opt}
          </li>
        ))}
      </ul>
    </div>
  );
}
