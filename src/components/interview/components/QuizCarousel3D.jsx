import React, { useState } from "react";
import "./QuizCarousel3D.css";
import PreguntaCard from "./PreguntaCard";

export default function QuizCarousel3D({ questions }) {
  const [angle, setAngle] = useState(0);
  const total = questions.length;

  const handleNext = () => setAngle((prev) => prev - 360 / total);
  const handlePrev = () => setAngle((prev) => prev + 360 / total);

  return (
    <div className="carousel-container">
      <div
        className="carousel"
        style={{
          transform: `translateZ(-500px) rotateY(${angle}deg)`,
        }}
      >
        {questions.map((q, i) => (
          <div
            key={i}
            className="carousel-item"
            style={{
              transform: `rotateY(${(360 / total) * i}deg) translateZ(500px)`,
            }}
          >
            <PreguntaCard pregunta={q} />
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={handlePrev}
          className="bg-gray-700 text-white px-4 py-2 rounded"
        >
          ⟲
        </button>
        <button
          onClick={handleNext}
          className="bg-gray-700 text-white px-4 py-2 rounded"
        >
          ⟳
        </button>
      </div>
    </div>
  );
}
