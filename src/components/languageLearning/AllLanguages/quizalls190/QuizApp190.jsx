import * as XLSX from "xlsx";
import { saveAs } from "file-saver"; // Para descargar los archivos JSON

const QuizApp190 = (file) => {
  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Combinaciones de idiomas
      const combinations = [
        { questionLang: "es-ES", responseLang: "de-DE", questionKey: "Español", responseKey: "Alemán" },
        { questionLang: "es-ES", responseLang: "fr-FR", questionKey: "Español", responseKey: "Francés" },
        { questionLang: "es-ES", responseLang: "it-IT", questionKey: "Español", responseKey: "Italiano" },
        { questionLang: "es-ES", responseLang: "en-US", questionKey: "Español", responseKey: "Inglés" },
        { questionLang: "es-ES", responseLang: "pt-PT", questionKey: "Español", responseKey: "Portugués" },
        { questionLang: "es-ES", responseLang: "ja-JP", questionKey: "Español", responseKey: "Japonés" },
        { questionLang: "es-ES", responseLang: "zh-CN", questionKey: "Español", responseKey: "Chino" },
        // Inverso
        { questionLang: "de-DE", responseLang: "es-ES", questionKey: "Alemán", responseKey: "Español" },
        { questionLang: "fr-FR", responseLang: "es-ES", questionKey: "Francés", responseKey: "Español" },
        { questionLang: "it-IT", responseLang: "es-ES", questionKey: "Italiano", responseKey: "Español" },
        { questionLang: "en-US", responseLang: "es-ES", questionKey: "Inglés", responseKey: "Español" },
        { questionLang: "pt-PT", responseLang: "es-ES", questionKey: "Portugués", responseKey: "Español" },
        { questionLang: "ja-JP", responseLang: "es-ES", questionKey: "Japonés", responseKey: "Español" },
        { questionLang: "zh-CN", responseLang: "es-ES", questionKey: "Chino", responseKey: "Español" },
      ];

      // Crear los JSON para cada combinación de idiomas
      combinations.forEach((combination) => {
        const jsonOutput = {
          questionLanguage: combination.questionLang,
          responseLanguage: combination.responseLang,
          questions: jsonData.map((row) => ({
            word: row[combination.questionKey],
            translation: row[combination.responseKey],
            pronunciation: row[combination.questionKey]?.toLowerCase(),
            options: shuffleArray([row["Opción 1"], row["Opción 2"], row["Opción 3"], row["Opción 4"]]),
            correctAnswer: 2, // Aquí defines cuál opción es correcta
          })),
        };

        // Verificar que los datos no estén vacíos
        if (jsonOutput.questions.length > 0) {
          const blob = new Blob([JSON.stringify(jsonOutput, null, 2)], { type: "application/json" });
          saveAs(blob, `quiz_${combination.questionKey.toLowerCase()}_${combination.responseKey.toLowerCase()}.json`);
        } else {
          console.error("El JSON generado está vacío.");
        }
      });
    } catch (error) {
      console.error("Error procesando el archivo: ", error);
    }
  };

  if (file && file instanceof Blob) {
    reader.readAsArrayBuffer(file);
  } else {
    console.error("Por favor, sube un archivo válido.");
  }
};

// Función para mezclar las respuestas
const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

export default QuizApp190;
