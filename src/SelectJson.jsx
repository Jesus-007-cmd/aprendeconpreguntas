import React from 'react';

const SelectJson = ({ onSelect }) => {
  const handleSelect = (event) => {
    onSelect(event.target.value);
  };

  return (
    <div>
      <select onChange={handleSelect}>
        <option value="">Select JSON</option>
        <option value="01preguntasTrailHead.json">JSON 1</option>
        <option value="02preguntasTrailHead.json">JSON 2</option>
        <option value="03PreguntasTrailHead.json">JSON 3</option>
        <option value="preguntastelcel.json">Telcel</option>
      </select>
    </div>
  );
};

export default SelectJson;
