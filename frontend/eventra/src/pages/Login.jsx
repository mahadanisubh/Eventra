import React from "react";
import BASE_URL from "../../api.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      alert("All Fields Are Required");
    }

    try {
      const res = await fetch(`${BASE_URL}/loginuser`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Login Failed");
        return;
      }
      if (data.userId) {
        navigate("/verify-otp", { state: { userId: data.userId } });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Login</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="inputs">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="inputs">
            <input
              type="password"
              name="password"
              placeholder="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button className="btnlr" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
