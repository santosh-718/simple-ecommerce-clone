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
      <div style={styles.overlay}></div>
      <header style={styles.header}>
        <h1 style={styles.title}>Bhagya Jewelleries</h1>
        <p style={styles.tagline}>Where Elegance Meets Tradition</p>
      </header>

      <div style={styles.card}>
        {page === "login" ? (
          <>
            <Login setUserId={setUserId} />
            <p onClick={() => setPage("register")} style={styles.link}>
              Don’t have an account? Register
            </p>
          </>
        ) : (
          <>
            <Register />
            <p onClick={() => setPage("login")} style={styles.link}>
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
    backgroundImage:
      "url('https://images.unsplash.com/photo-1600180758895-3e4e3f3f3f3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')", // jewellery showroom background
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    fontFamily: "'Playfair Display', serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    zIndex: 0,
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
    zIndex: 1,
  },
  title: {
    fontSize: "48px",
    fontWeight: "bold",
    color: "#FFD700", // gold accent
    marginBottom: "10px",
    textShadow: "2px 2px 6px rgba(0,0,0,0.7)",
  },
  tagline: {
    fontSize: "18px",
    color: "#f5f5f5",
    fontStyle: "italic",
  },
  card: {
    background: "rgba(255,255,255,0.95)",
    color: "#333",
    padding: "40px",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
    width: "400px",
    textAlign: "center",
    zIndex: 1,
  },
  link: {
    marginTop: "20px",
    fontSize: "14px",
    color: "#800000",
    cursor: "pointer",
    fontWeight: "bold",
    textDecoration: "underline",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "linear-gradient(90deg, #FFD700, #DAA520)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "box-shadow 0.3s ease",
  },
  buttonHover: {
    boxShadow: "0 0 15px rgba(255,215,0,0.8)",
  },
};

export default App;
