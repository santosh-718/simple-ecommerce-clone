import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import Shop from "./Shop";

function App() {
  const [page, setPage] = useState("login");
  const [userId, setUserId] = useState(null);

  if (userId) {
    return <Shop userId={userId} />;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Bhagya Jewelleries</h1>
        <p style={styles.tagline}>Elegance Crafted in Gold & Diamonds</p>
      </header>

      <div style={styles.card}>
        {page === "login" ? (
          <>
            <Login setUserId={setUserId} />
            <p
              onClick={() => setPage("register")}
              style={styles.link}
            >
              Don’t have an account? Register
            </p>
          </>
        ) : (
          <>
            <Register />
            <p
              onClick={() => setPage("login")}
              style={styles.link}
            >
              Already have an account? Login
            </p>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #b9935a 0%, #5d3a00 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "'Playfair Display', serif",
    color: "#fff",
    padding: "20px",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },
  title: {
    fontSize: "36px",
    fontWeight: "bold",
    color: "#ffd700", // gold accent
    marginBottom: "10px",
  },
  tagline: {
    fontSize: "16px",
    color: "#f5f5f5",
    fontStyle: "italic",
  },
  card: {
    background: "#fff",
    color: "#333",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
    width: "400px",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  },
  link: {
    marginTop: "20px",
    fontSize: "14px",
    color: "#b9935a",
    cursor: "pointer",
    fontWeight: "bold",
    textDecoration: "underline",
  },
};

export default App;
