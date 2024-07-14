import React, { useState } from 'react';
import * as XLSX from 'xlsx';

function ExcelToJsonConverter() {
  const [jsonData, setJsonData] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);

        setJsonData(json);
      };

      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div>
      <h2>Excel to JSON Converter</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      {jsonData && (
        <div>
          <h3>Generated JSON:</h3>
          <pre>{JSON.stringify(jsonData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default ExcelToJsonConverter;
