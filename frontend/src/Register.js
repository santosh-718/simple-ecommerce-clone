import React, { useState } from "react";

function Register({ setPage }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const register = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        alert("Registered successfully!");
        setPage("login"); // go back to login after success
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Create Account</h2>
      <input
        style={styles.input}
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        style={styles.input}
        placeholder="Email"
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        style={styles.input}
        placeholder="Password"
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      {error && <p style={styles.error}>{error}</p>}

      <button style={styles.button} onClick={register} disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </button>

      <p style={styles.footer}>
        Already have an account?{" "}
        <span onClick={() => setPage("login")} style={styles.link}>
          Login
        </span>
      </p>
    </div>
  );
}

const styles = {
  card: { width: "350px", padding: "40px", background: "#fff", borderRadius: "12px" },
  title: { fontSize: "24px", fontWeight: "bold", marginBottom: "20px" },
  input: { width: "100%", padding: "12px", marginBottom: "15px" },
  button: { width: "100%", padding: "12px", backgroundColor: "#667eea", color: "#fff" },
  error: { color: "red", fontSize: "13px" },
  footer: { marginTop: "20px", fontSize: "13px" },
  link: { color: "#667eea", cursor: "pointer", fontWeight: "bold" },
};

export default Register;
