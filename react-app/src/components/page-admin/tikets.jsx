import React, { useState } from "react";
import "../Css/stylead.css";
import Navbar from "../layouts/adminnav";

function ReportesAdmin() {
  // Estado inicial simulado (luego vendrá de Firebase)
  const [reportes, setReportes] = useState([  /* {
      id: 1,
      nombre: "Juan Pérez",
      correo: "juanperez@gmail.com",
      numeroContrato: "CT-001",
      domicilio: "Calle 12 #45, Centro",
      titulo: "",
      descripcion: "Problema con la velocidad de internet",
      fecha: "2025-11-09",
      estado: "activo",
    },
    {
      id: 2,
      nombre: "Ana López",
      correo: "ana@gmail.com",
      numeroContrato: "CT-002",
      domicilio: "Av. Reforma 10",
      titulo: "",
      descripcion: "El sistema no registra mi pago",
      fecha: "2025-11-07",
      estado: "pendiente",
    }*/]);

  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
  const [modalSolucion, setModalSolucion] = useState(false);
  const [modalFinalizar, setModalFinalizar] = useState(false);

  // Cambiar estado del reporte
  const cambiarEstado = (id, nuevoEstado) => {
    setReportes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, estado: nuevoEstado } : r))
    );
    setReporteSeleccionado(null);
  };

  const handleDescargar = (reporte) => {
    const contenido = `
      Reporte #${reporte.id}
      Nombre: ${reporte.nombre}
      Titulo: ${reporte.titulo}
      Descripción: ${reporte.descripcion}
      Fecha: ${reporte.fecha}
    `;
    const blob = new Blob([contenido], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Reporte-${reporte.id}.txt`;
    a.click();
  };

  // Filtrar reportes por estado
  const activos = reportes.filter((r) => r.estado === "activo");
  const pendientes = reportes.filter((r) => r.estado === "pendiente");
  const finalizados = reportes.filter((r) => r.estado === "finalizado");

  return (
    <>
    <Navbar>
      <div className="dashboard">
        <h1>Gestión de Reportes</h1>
        <p className="dashboard-desc">
          Visualiza, atiende y da seguimiento a los reportes de clientes.
        </p>

        {/* TABLA DE ACTIVOS */}
        <h2>Reportes Activos</h2>
        <table className="clientes-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Titulo</th>
              <th>Descripción</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {activos.length === 0 ? (
              <tr>
                <td colSpan="6">No hay reportes activos</td>
              </tr>
            ) : (
              activos.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.nombre}</td>
                   <td>{r.titulo}</td>
                  <td>{r.descripcion}</td>
                  <td>{r.fecha}</td>
                  <td>
                    <button
                      className="btn-ver"
                      onClick={() => setReporteSeleccionado(r)}
                    >
                      Ver
                    </button>
                    <button
                      className="btn-editar"
                      onClick={() => cambiarEstado(r.id, "pendiente")}
                    >
                      Atender
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* TABLA DE PENDIENTES */}
        <h2>Reportes Pendientes</h2>
        <table className="clientes-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Titulo</th>
              <th>Descripción</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pendientes.length === 0 ? (
              <tr>
                <td colSpan="6">No hay reportes pendientes</td>
              </tr>
            ) : (
              pendientes.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.nombre}</td>
                   <td>{r.titulo}</td>
                  <td>{r.descripcion}</td>
                  <td>{r.fecha}</td>
                  <td>
                    <button
                      className="btn-ver"
                      onClick={() => setReporteSeleccionado(r)}
                    >
                      Ver
                    </button>
                    <button
                      className="btn-editar"
                      onClick={() => setModalSolucion(true)}
                    >
                      Solución
                    </button>
                    <button
                      className="btn-editar"
                      onClick={() => handleDescargar(r)}
                    >
                      Descargar
                    </button>
                    <button
                      className="btn-ver"
                      onClick={() => setModalFinalizar(true)}
                    >
                      Finalizar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* TABLA DE FINALIZADOS */}
        <h2>Reportes Finalizados (Mes Actual)</h2>
        <table className="clientes-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Titulo</th>
              <th>Descripción</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {finalizados.length === 0 ? (
              <tr>
                <td colSpan="5">No hay reportes finalizados</td>
              </tr>
            ) : (
              finalizados.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.nombre}</td>
                  <td>{r.titulo}</td>
                  <td>{r.descripcion}</td>
                  <td>{r.fecha}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* VISTA DETALLADA DEL REPORTE */}
      {reporteSeleccionado && (
        <div className="modal" style={{ display: "block" }}>
          <div className="modal-content">
            <span className="close" onClick={() => setReporteSeleccionado(null)}>
              &times;
            </span>
            <h3>Detalles del Reporte #{reporteSeleccionado.id}</h3>
            <p><strong>Nombre:</strong> {reporteSeleccionado.nombre}</p>
            <p><strong>Correo:</strong> {reporteSeleccionado.correo}</p>
            <p><strong>Contrato:</strong> {reporteSeleccionado.numeroContrato}</p>
            <p><strong>Domicilio:</strong> {reporteSeleccionado.domicilio}</p>
            <p><strong>Titulo:</strong> {reporteSeleccionado.titulo}</p>
            <p><strong>Descripción:</strong> {reporteSeleccionado.descripcion}</p>
            <p><strong>Fecha:</strong> {reporteSeleccionado.fecha}</p>
          </div>
        </div>
      )}

      {/* MODAL SOLUCIÓN */}
      {modalSolucion && (
        <div className="modal" style={{ display: "block" }}>
          <div className="modal-content">
            <span className="close" onClick={() => setModalSolucion(false)}>
              &times;
            </span>
            <h3>Registrar solución</h3>
            <textarea
              rows="5"
              placeholder="Describe la solución aplicada..."
              style={{ width: "100%", marginBottom: "10px" }}
            ></textarea>
            <button
              className="btn-primary"
              onClick={() => {
                alert("Solución registrada (simulado)");
                setModalSolucion(false);
              }}
            >
              Guardar solución
            </button>
          </div>
        </div>
      )}

      {/* MODAL FINALIZAR */}
      {modalFinalizar && (
        <div className="modal" style={{ display: "block" }}>
          <div className="modal-content">
            <span className="close" onClick={() => setModalFinalizar(false)}>
              &times;
            </span>
            <h3>Subir evidencia</h3>
            <input type="file" accept="image/*" />
            <button
              className="btn-primary"
              onClick={() => {
                alert("Caso finalizado correctamente (simulado)");
                setModalFinalizar(false);
              }}
            >
              Finalizar caso
            </button>
          </div>
        </div>
      )}
      </Navbar>
    </>
  );
}

export default ReportesAdmin;



//nms que son esas mamadas de tikests esa onda es un reporte 