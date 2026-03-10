import React, { useState } from "react";

function Login({ setUserId }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.token) {
        setUserId(1); // replace with actual userId from backend
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back 👋</h2>
        <p style={styles.subtitle}>Please log in to continue</p>

        <input
          style={styles.input}
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button style={styles.button} onClick={login} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", justifyContent: "center", alignItems: "center" },
  card: { width: "350px", padding: "40px", background: "#fff", borderRadius: "12px" },
  title: { fontSize: "24px", fontWeight: "bold" },
  subtitle: { marginBottom: "20px", fontSize: "14px" },
  input: { width: "100%", padding: "12px", marginBottom: "15px" },
  button: { width: "100%", padding: "12px", backgroundColor: "#667eea", color: "#fff" },
  error: { color: "red", fontSize: "13px" },
};

export default Login;
