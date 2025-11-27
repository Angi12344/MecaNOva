import React, { useEffect, useState } from "react";
import "../Css/stylead.css";
import Navbar from "../layouts/adminnav";

import { db } from "../../config/firebaseConfig";
import { collection, updateDoc, doc, onSnapshot, deleteDoc } from "firebase/firestore";

function ReportesAdmin() {
  const [reportes, setReportes] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "reportes"), (snap) => {
      const lista = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setReportes(lista);
    });

    return () => unsub();
  }, []);

  // -------------------------------------------
  // 🔥 ENVIAR PUSH AL CLIENTE (usa Cloud Function)
  // -------------------------------------------
  const notificarCambioReporte = async (uid, tipo, titulo) => {
    try {
      await fetch("https://us-central1-novabooks-35f3b.cloudfunctions.net/notificarReporte", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid,
          tipo,
          titulo
        }),
      });
    } catch (error) {
      console.error("Error enviando notificación:", error);
    }
  };

  // Cambiar estado del reporte
  const cambiarEstado = async (id, nuevoEstado, uid, titulo) => {
    await updateDoc(doc(db, "reportes", id), { estado: nuevoEstado });

    // 🔥 ENVIAR PUSH
    if (nuevoEstado === "activo") {
      await notificarCambioReporte(uid, "reporte_activado", titulo);
    } else if (nuevoEstado === "finalizado") {
      await notificarCambioReporte(uid, "reporte_finalizado", titulo);
    }
  };

  // Eliminar reporte
  const eliminarReporte = async (id) => {
    const confirmar = window.confirm("¿Seguro que deseas eliminar este reporte?");
    if (!confirmar) return;

    try {
      await deleteDoc(doc(db, "reportes", id));
      alert("Reporte eliminado correctamente.");
    } catch (error) {
      console.error("Error eliminando reporte:", error);
      alert("Hubo un error al eliminar el reporte.");
    }
  };

  const activos = reportes.filter((r) => r.estado === "activo");
  const pendientes = reportes.filter((r) => r.estado === "pendiente");
  const finalizados = reportes.filter((r) => r.estado === "finalizado");

  return (
    <Navbar>
      <div className="dashboard">
        <h1>Gestión de Reportes</h1>

        {/* ACTIVOS */}
        <h2>Reportes Activos</h2>
        <table className="clientes-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Título</th>
              <th>Descripción</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {activos.length === 0 ? (
              <tr><td colSpan="6">No hay reportes activos</td></tr>
            ) : activos.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.nombre}</td>
                <td>{r.titulo}</td>
                <td>{r.descripcion}</td>
                <td>{r.fecha}</td>
                <td>
                  <button
                    className="btn-editar"
                    onClick={() => cambiarEstado(r.id, "finalizado", r.cliente_uid, r.titulo)}
                  >
                    Finalizar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PENDIENTES */}
        <h2>Reportes Pendientes</h2>
        <table className="clientes-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Título</th>
              <th>Descripción</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pendientes.length === 0 ? (
              <tr><td colSpan="6">No hay reportes pendientes</td></tr>
            ) : pendientes.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.nombre}</td>
                <td>{r.titulo}</td>
                <td>{r.descripcion}</td>
                <td>{r.fecha}</td>
                <td>
                  <button
                    className="btn-editar"
                    onClick={() => cambiarEstado(r.id, "activo", r.cliente_uid, r.titulo)}
                  >
                    Activar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* FINALIZADOS */}
        <h2>Reportes Finalizados</h2>
        <table className="clientes-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Título</th>
              <th>Descripción</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {finalizados.length === 0 ? (
              <tr><td colSpan="6">No hay reportes finalizados</td></tr>
            ) : finalizados.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.nombre}</td>
                <td>{r.titulo}</td>
                <td>{r.descripcion}</td>
                <td>{r.fecha}</td>
                <td>
                  <button className="btn-eliminar" onClick={() => eliminarReporte(r.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </Navbar>
  );
}

export default ReportesAdmin;
