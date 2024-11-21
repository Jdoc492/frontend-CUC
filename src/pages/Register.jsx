import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/register.css';
import img1 from '../assets/img/cucR.png';
import img2 from '../assets/img/logo-cuc.jpg';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar contraseñas
    if (password !== confirmPassword) {
      setMessage('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      setMessage(
        'La contraseña debe tener al menos 6 caracteres, una mayúscula y un número'
      );
      return;
    }

    if (!validateEmail(email)) {
      setMessage('El correo no tiene un formato válido');
      return;
    }

    try {
      // Registrar usuario en el backend
      const response = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Usuario registrado con éxito');
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => navigate('/login'), 2000); // Redirigir al login
      } else {
        // Mostrar mensaje de error del backend
        setMessage(data.error || 'Error al registrar el usuario');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error al conectar con el servidor');
    }
  };

  return (
    <div className="register-container container">
      <div className="register-card">
        <div className="register-header">
          <img src={img2} alt="Universidad de la Costa" className="university-logo" loading="lazy" width="200px" />
          <h1>Crear una Cuenta</h1>
          <p>Únete a la plataforma de la Universidad de la Costa</p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Nombre Completo</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder='Ingresa tu nombre'
          />

          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder='ejemplo@gmail.com'
          />

          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder='Ingresa tu contraseña'
          />

          <label htmlFor="confirm-password">Confirmar Contraseña</label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder='Confirma tu contraseña'
          />

          <button type="submit" className="btn-register">Registrarme</button>
        </form>

        {message && <p className="register-message">{message}</p>}

        <div className="register-footer">
          <p>¿Ya tienes una cuenta?</p>
          <a href="/login">Inicia Sesión</a>
        </div>
      </div>

      <div className="register-image">
        <img src={img1} alt="Universidad de la Costa" className="university-logo" loading="lazy" width="700px" />
      </div>
    </div>
  );
};

export default Register;
