import React, { useState } from "react";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const register = async () => {
    await fetch("http://api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    alert("Registered successfully");
  };

  return (
    <div>
      <h2>Register</h2>
      <input placeholder="Name" onChange={e => setForm({...form, name: e.target.value})} />
      <br />
      <input placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} />
      <br />
      <input type="password" placeholder="Password" onChange={e => setForm({...form, password: e.target.value})} />
      <br />
      <button onClick={register}>Register</button>
    </div>
  );
}

export default Register;