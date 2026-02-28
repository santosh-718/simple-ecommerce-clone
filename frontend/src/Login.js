import React, { useState } from "react";

function Login({ setUserId }) {
  const [form, setForm] = useState({ email: "", password: "" });

  const login = async () => {
    const res = await fetch("http://api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (data.token) {
      // For simplicity, decode not implemented
      setUserId(1);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} />
      <br />
      <input type="password" placeholder="Password" onChange={e => setForm({...form, password: e.target.value})} />
      <br />
      <button onClick={login}>Login</button>
    </div>
  );
}

export default Login;