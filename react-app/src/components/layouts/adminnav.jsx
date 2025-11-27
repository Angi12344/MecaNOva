// src/Components/Navbar.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../Css/stylead.css";
import Notificacion from "../page-admin/Notifi";
export default function Navbar({children}) {
  const navigate = useNavigate();

  // Simulación del estado de sesión
  const [usuario, setAdmin] = React.useState(
    JSON.parse(localStorage.getItem("usuario")) || null
  );

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    setAdmin(null);
    navigate("/");
  };

  return (
    <div className="page-container">
    <nav className="navbar">
      <div className="logo">Admin Conect@T</div>
      <ul className="nav-links">
        <li>
          <NavLink to="/homead" className="nav-item">
            Inicio
          </NavLink>
        </li>
        <li>
          <NavLink to="/cliente" className="nav-item">
            Gestión de Usuarios
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin" className="nav-item">
            Administradores
          </NavLink>
        </li>
        <li>
          <NavLink to="/paquetesad" className="nav-item">
            Gestión de Paquetes
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard" className="nav-item">
            Dashboard
          </NavLink>
        </li>
                <li>
          <NavLink to="/reportes" className="nav-item">
            Historial de reportes
          </NavLink>
        </li>
          <li>
          <NavLink to="/historialPagos" className="nav-item">
            Historial de contratos
          </NavLink>
        </li>
          <li>
          <NavLink to="/" className="nav-item">
            Página usuarios
          </NavLink>
        </li>
        <li>
          {usuario ? (
            <>
              <span className="nav-user">👤{usuario.nombre}</span>
              <button className="nav-item" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <NavLink to="/login" className="nav-item">
              Iniciar sesión
            </NavLink>
          )}
        </li>
        <li>
          {" "}
          <Notificacion />{" "}
        </li>
      </ul>
    </nav>
     <main>
        {children}
      </main>
    </div>
  );
}
