import React, { useState } from 'react';
import '../style/login.css';
import loginImage from '../assets/img/imgLogo.jpg'; // Imagen del login
import imagen1 from '../assets/img/logo-cuc.jpg';  // Logo de la universidad
import { useNavigate } from 'react-router-dom'; 

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Hook para redirigir

  const handleSubmit = (e) => {
    e.preventDefault();
  
    fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Credenciales incorrectas");
        }
        return response.json();
      })
      .then((data) => {
        localStorage.setItem("token", data.access_token); // Guardar el token en localStorage
        onLogin(data.access_token); // Pasar el token al componente principal
        navigate("/"); // Redirigir al usuario a la página principal
      })
      .catch((error) => {
        console.error("Error:", error);
        setMessage(error.message || "Error al conectar con el servidor");
      });
  };
  

  return (
    <div className="login-container container">
      {/* Columna para el formulario */}
      <div className="login-card">
        <div className="login-header">
          <img
            src={imagen1}
            alt="Universidad de la Costa"
            className="university-logo"
            loading="lazy"
          />
          <h1>Inicio de Sesión</h1>
          <p>Bienvenido a la plataforma de la Universidad de la Costa</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            placeholder="Ingresa tu correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="btn-login">
            Iniciar Sesión
          </button>
        </form>

        {/* Mostrar mensajes de error o éxito */}
        {message && <p className="login-message">{message}</p>}

        <div className="login-footer">
          <a href="/recover" className="recover-link">
            ¿Olvidaste tu contraseña?
          </a>
          <a href="/register" className="register-link">
            Crear una cuenta
          </a>
        </div>
      </div>

      {/* Columna para la imagen */}
      <div className="login-image">
        <img
          src={loginImage}
          alt="Universidad de la Costa"
          className="university-logo"
          loading="lazy"
          width={"600px"}
        />
      </div>
    </div>
  );
};

export default Login;
