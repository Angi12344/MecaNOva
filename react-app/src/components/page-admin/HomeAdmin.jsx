import React from "react";
import { Link } from "react-router-dom";
import "../Css/stylead.css";
import Navbar from "../layouts/adminnav";

export default function Homead() {
  return (
    <>
      <Navbar>
      <header className="hero">
        <div className="hero-content">
          <h1>
            Bienvenida eminencia <span className="highlight">Admin</span>
          </h1>
          <p>
            Plataforma de administración del sistema <strong>Conect@T</strong>,
            diseñada exclusivamente para el control, gestión y monitoreo de
            servicios internos. Solo el personal administrativo autorizado puede
            acceder a esta área.
          </p>
        </div>
      </header>

      {/* Sección de características */}
      <section className="features">
        <div className="feature">
          <Link to="/cliente">
            <h2>Gestión de Usuarios</h2>
          </Link>
          <p>
            Consulta la información de los usuarios, sus contratos activos y el
            estado de sus servicios.
          </p>
        </div>

        <div className="feature">
          <Link to="/admin">
            <h2>Administradores</h2>
          </Link>
          <p>
            Acceso exclusivo del superadministrador. Permite controlar los
            permisos y roles de otros administradores.
          </p>
        </div>

        <div className="feature">
          <Link to="/paquetes">
            <h2>Gestión de Paquetes</h2>
          </Link>
          <p>
            Administra los paquetes disponibles: agrega, edita o elimina
            información del catálogo.
          </p>
        </div>

        <div className="feature">
          <Link to="/dashboard">
            <h2>Panel de Administración</h2>
          </Link>
          <p>
            Visualiza indicadores clave: clientes totales, servicios activos,
            ingresos y tickets abiertos.
          </p>
        </div>
      </section>
      </Navbar>
    </>
  );
}
