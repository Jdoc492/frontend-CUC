import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Footer from "../components/Footer";
import Home from "../pages/Home";

const AppContent = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetch("http://localhost:5000/auth/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Token inválido");
          }
        })
        .then((userData) => setUser(userData))
        .catch((error) => {
          console.error("Error al validar el token:", error);
          handleLogout();
        });
    }
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem("token", token);

    fetch("http://localhost:5000/auth/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al validar el token");
        }
        return response.json();
      })
      .then((userData) => setUser(userData))
      .catch((error) => console.error("Error al obtener datos del usuario:", error));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <>
      {user && <Navbar user={user} onLogout={handleLogout} />}
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Home user={user} />
            ) : (
              <Navigate to="/login" replace state={{ from: location }} />
            )
          }
        />
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Footer />
    </>
  );
};

const AppRoutes = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default AppRoutes;
