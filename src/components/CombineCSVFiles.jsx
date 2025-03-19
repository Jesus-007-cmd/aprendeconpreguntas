import React, { useState } from 'react';
import Papa from 'papaparse';

const CombineCSVFiles = () => {
  const [csvData, setCsvData] = useState([]);
  const [combinedCsv, setCombinedCsv] = useState('');

  // Función para manejar los archivos subidos
  const handleFilesUpload = (event) => {
    const files = event.target.files;
    const allCsvData = [];

    Array.from(files).forEach((file) => {
      Papa.parse(file, {
        complete: (result) => {
          allCsvData.push(result.data);
          if (allCsvData.length === files.length) {
            combineCsvData(allCsvData);
          }
        },
        header: true,
        skipEmptyLines: true
      });
    });
  };

  // Función para combinar los datos de varios CSV
  const combineCsvData = (csvFiles) => {
    const combined = [];
    //const headers = Object.keys(csvFiles[0][0]); // Usar encabezados del primer archivo

    csvFiles.forEach((file) => {
      file.forEach((row) => {
        combined.push(row);
      });
    });

    setCsvData(combined);
    const csvString = Papa.unparse(combined); // Convertir a formato CSV
    setCombinedCsv(csvString);
  };

  // Función para descargar el CSV combinado
  const downloadCsv = () => {
    const blob = new Blob([combinedCsv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'combined.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h2>Combinar Archivos CSV</h2>
      <input type="file" multiple accept=".csv" onChange={handleFilesUpload} />

      {csvData.length > 0 && (
        <div>
          <h3>Datos Combinados:</h3>
          <button onClick={downloadCsv}>Descargar CSV Combinado</button>
        </div>
      )}
    </div>
  );
};

export default CombineCSVFiles;
