import React from 'react';
import '../style/footer.css'; // Asegúrate de crear este archivo CSS
import logo from '../assets/img/logo_cuc_vertical.png'; // Cambia la ruta según la ubicación de tu logo

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-logo">
          <img src={logo} alt="Logo Universidad de la Costa" className="logo" />
        </div>
        <div className="footer-text">
          <p>
            © {new Date().getFullYear()} Universidad de la Costa. Todos los derechos reservados.
          </p>
          <p>Educación para un mejor futuro.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
