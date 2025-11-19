import React, { useState, useEffect } from "react";
import Usernav from "../layouts/usernav";
import "../Css/style.css";
import { useNavigate, Link } from 'react-router-dom';

function ReportesUsuario() {
     const navigate = useNavigate();

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  // ✅ Si NO hay usuario, bloqueamos la vista
  
    if (!usuario) {
       return(
    
      <Usernav>
        <section className="contratacion-section" style={{ textAlign: "center", padding: "40px" }}>
          <h2>🔒 Inicia sesión primero</h2>
          <p>Para ver tus tikets necesitas iniciar sesión.</p>

          <Link to="/login" className="login-btn" style={{ marginTop: "20px", display: "inline-block" }}>
            Iniciar sesión
          </Link>
        </section>
      </Usernav>
    );
  }
  // Simulación de reportes obtenidos desde Firebase
  const [reportes, setReportes] = useState([
    {
      id: 1,
      titulo: "Internet lento",
      descripcion: "Mi velocidad está por debajo del plan contratado.",
      numeroContrato: "CT-001",
      fecha_creacion: "2025-11-01",
      fecha_actualizacion: "",
      estado: "activo",
    },
    {
      id: 2,
      titulo: "Falla total",
      descripcion: "No tengo conexión desde anoche.",
      numeroContrato: "CT-001",
      fecha_creacion: "2025-10-30",
      fecha_actualizacion: "2025-11-02",
      estado: "finalizado",
    },
    {
      id: 3,
      titulo: "Problema con recibo",
      descripcion: "El sistema marcó pagado antes de pagar.",
      numeroContrato: "CT-001",
      fecha_creacion: "2025-11-07",
      fecha_actualizacion: "",
      estado: "pendiente",
    },
  ]);

  const [filtro, setFiltro] = useState("todos");
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);

  // Filtrar reportes según estado
  const reportesFiltrados =
    filtro === "todos" ? reportes : reportes.filter((r) => r.estado === filtro);

  return (
    <Usernav>
      <section className="ayuda-section">
        <div className="content-wrapper">
          <h2 className="section-title">Mis Reportes</h2>
          <p className="section-subtitle">
            Consulta el estado de tus reportes de soporte.
          </p>

          {/* FILTROS */}
          <div className="filtros-reportes">
            <button
              className={filtro === "todos" ? "filtro-activo" : ""}
              onClick={() => setFiltro("todos")}
            >
              Todos
            </button>
            <button
              className={filtro === "activo" ? "filtro-activo" : ""}
              onClick={() => setFiltro("activo")}
            >
              Activos
            </button>
            <button
              className={filtro === "pendiente" ? "filtro-activo" : ""}
              onClick={() => setFiltro("pendiente")}
            >
              Pendientes
            </button>
            <button
              className={filtro === "finalizado" ? "filtro-activo" : ""}
              onClick={() => setFiltro("finalizado")}
            >
              Finalizados
            </button>
          </div>

          {/* TABLA */}
          <table className="clientes-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Estado</th>
                <th>Fecha creación</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {reportesFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="5">No hay reportes para mostrar</td>
                </tr>
              ) : (
                reportesFiltrados.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.titulo}</td>
                    <td>
                      <span
                        className={`estado-tag estado-${r.estado}`}
                      >
                        {r.estado}
                      </span>
                    </td>
                    <td>{r.fecha_creacion}</td>
                    <td>
                      <button
                        className="btn-ver"
                        onClick={() => setReporteSeleccionado(r)}
                      >
                        Ver detalles
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* MODAL DETALLES */}
      {reporteSeleccionado && (
        <div className="modal" style={{ display: "block"}}>
          <div className="modal-content">
            <span
              className="close"
              onClick={() => setReporteSeleccionado(null)}
            >
              &times;
            </span>

            <h3>Reporte #{reporteSeleccionado.id}</h3>
            <p><strong>Título:</strong> {reporteSeleccionado.titulo}</p>
            <p><strong>Descripción:</strong> {reporteSeleccionado.descripcion}</p>
            <p><strong>Contrato:</strong> {reporteSeleccionado.numeroContrato}</p>
            <p><strong>Estado:</strong> {reporteSeleccionado.estado}</p>
            <p><strong>Fecha creación:</strong> {reporteSeleccionado.fecha_creacion}</p>

            <p>
              <strong>Fecha actualización:</strong>{" "}
              {reporteSeleccionado.fecha_actualizacion || "—"}
            </p>
          </div>
        </div>
      )}
    </Usernav>
  );
}

export default ReportesUsuario;
