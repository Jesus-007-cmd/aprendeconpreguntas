const ExplanationBox = ({ explanation }) => {
  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Explicación:</h3>
      {explanation.map((item, index) => {
        if (item.type === "text") {
          return (
            <p key={index} style={styles.text}>
              {item.value}
            </p>
          );
        } else if (item.type === "code") {
          return (
            <pre key={index} style={styles.code}>
              <code>{item.value}</code>
            </pre>
          );
        } else if (item.type === "image") {
          return (
            <img key={index} src={item.value} alt="Explicación" style={styles.image} />
          );
        }
        return null;
      })}
    </div>
  );
};

// 🎨 **Estilos Responsivos**
const styles = {
  container: {
    backgroundColor: "#1e1e1e",
    color: "#ffffff",
    padding: "20px",
    borderRadius: "8px",
    width: "90%", // 📱 Móvil: 90% del ancho
    maxWidth: "800px", // 💻 No supera los 800px en pantallas grandes
    margin: "20px auto",
    fontFamily: "Arial, sans-serif",
    boxShadow: "0px 0px 10px rgba(255, 255, 255, 0.2)",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  title: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
    textAlign: "center",
  },
  text: {
    fontSize: "16px",
    lineHeight: "1.6",
    textAlign: "justify",
  },
  code: {
    backgroundColor: "#282c34",
    color: "#61dafb",
    padding: "10px",
    borderRadius: "5px",
    fontFamily: "monospace",
    whiteSpace: "pre-wrap",
    display: "block",
    overflowX: "auto",
    fontSize: "14px", // 📱 Tamaño de fuente adaptable
  },
  image: {
    maxWidth: "100%",
    height: "auto",
    borderRadius: "5px",
    margin: "10px 0",
  },
};

export default ExplanationBox;
