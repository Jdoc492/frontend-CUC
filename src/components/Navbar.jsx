import React from 'react';
import '../style/navbar.css'; // Archivo CSS
import logo from '../assets/img/logo_cuc.png'; // Logo de la universidad
import { useNavigate } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout(); // Llamar la función de logout proporcionada
    localStorage.removeItem("token"); // Eliminar el token del almacenamiento local
    navigate("/login"); // Redirigir al inicio de sesión
  };

  return (
    <div className="navbar-container">
      <div className="navbar-content container">
        {/* Logo */}
        <div className="navbar-logo">
          <img src={logo} alt="Logo" className="logo" />
        </div>

        {/* Saludo al usuario */}
        <div className="navbar-user">
          {user && <span>Hola, {user.username || "Usuario"} 👋</span>}
        </div>

        {/* Botón de salir */}
        <button className="navbar-logout-button" onClick={handleLogout}>
          Salir
        </button>
      </div>
    </div>
  );
};

export default Navbar;
