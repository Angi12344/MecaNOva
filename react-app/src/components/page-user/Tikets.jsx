// src/components/page-user/Tikets.jsx  (o ReportesUsuario.jsx)
import React, { useState, useEffect } from "react";
import Usernav from "../layouts/usernav";
import "../Css/style.css";
import { Link } from "react-router-dom";

import { db } from "../../config/firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";

function ReportesUsuario() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (!usuario) {
    return (
      <Usernav>
        <section className="contratacion-section" style={{ textAlign: "center", padding: "40px" }}>
          <h2>🔒 Inicia sesión primero</h2>
          <p>Para ver tus reportes necesitas iniciar sesión.</p>
          <Link to="/login" className="login-btn" style={{ marginTop: "20px", display: "inline-block" }}>
            Iniciar sesión
          </Link>
        </section>
      </Usernav>
    );
  }

  const [reportes, setReportes] = useState([]);
  const [contratos, setContratos] = useState([]);
  const [filtro, setFiltro] = useState("todos");
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
  const [contratoSeleccionado, setContratoSeleccionado] = useState(null);

  // Cargar reportes (igual que antes)
  useEffect(() => {
    const ref = collection(db, "reportes");
    const q = query(ref, where("cliente_uid", "==", usuario.uid));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setReportes(data);
    });
    return () => unsub();
  }, [usuario.uid]);

  // Cargar TODOS los contratos del usuario (ahora muestra varios contratos)
  useEffect(() => {
    const ref = collection(db, "contratos");
    const q = query(ref, where("cliente_uid", "==", usuario.uid));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      // ordenar por fecha de creación descendente (último primero)
      data.sort((a, b) => {
        const ta = a.fecha_creacion?.toMillis ? a.fecha_creacion.toMillis() : 0;
        const tb = b.fecha_creacion?.toMillis ? b.fecha_creacion.toMillis() : 0;
        return tb - ta;
      });
      setContratos(data);
    });
    return () => unsub();
  }, [usuario.uid]);

  // Filtrar reportes
  const reportesFiltrados =
    filtro === "todos" ? reportes : reportes.filter((r) => r.estado === filtro);

  // Cálculos para pagos del contrato seleccionado
  const calcularTotalesContrato = (contr) => {
    if (!contr || !contr.pagos) return { total: 0, pagado: 0, pendiente: 0 };
    let total = 0, pagado = 0;
    contr.pagos.forEach((p) => {
      total += Number(p.monto || 0);
      if (p.pagado || p.estatus === "pagado" || p.estatus === "Pagado") {
        pagado += Number(p.monto || 0);
      }
    });
    return { total, pagado, pendiente: total - pagado };
  };

  const formatDate = (maybeTs) => {
    if (!maybeTs) return "—";
    // si es Timestamp de Firestore
    if (maybeTs.toDate) {
      return maybeTs.toDate().toLocaleDateString();
    }
    // si es string
    try {
      return new Date(maybeTs).toLocaleDateString();
    } catch {
      return String(maybeTs);
    }
  };

  return (
    <Usernav>
      <section className="ayuda-section">
        <div className="content-wrapper">
          <h2 className="section-title">Mis Contratos y Reportes</h2>
          <p className="section-subtitle">Aquí verás tus contratos (todos) y su calendario de pagos. Más abajo tus reportes de soporte.</p>

          {/* CONTRATOS: lista */}
          <h3>Contratos</h3>
          <div style={{ overflowX: "auto" }}>
            <table className="clientes-table">
              <thead>
                <tr>
                  <th>Núm. Contrato</th>
                  <th>Paquete</th>
                  <th>Duración (meses)</th>
                  <th>Precio mensual</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Fecha creación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {contratos.length === 0 ? (
                  <tr><td colSpan="8">No tienes contratos registrados</td></tr>
                ) : contratos.map((c) => (
                  <tr key={c.id}>
                    <td>{c.numeroContrato}</td>
                    <td>{c.paqueteNombre || c.paquete || "—"}</td>
                    <td>{c.duracion_meses || c.duracion || "—"}</td>
                    <td>${Number(c.precio_mensual || 0).toFixed(2)}</td>
                    <td>${Number(c.total || (c.precio_mensual * (c.duracion_meses || 0)) ).toFixed(2)}</td>
                    <td>
                      <span className={`estado-tag estado-${c.estado}`}>
                        {c.estado || "—"}
                      </span>
                    </td>
                    <td>{c.fecha_creacion?.toDate ? c.fecha_creacion.toDate().toLocaleDateString() : "—"}</td>
                    <td>
                      <button className="btn-ver" onClick={() => setContratoSeleccionado(c)}>Ver pagos</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* CUADRO: detalles del contrato seleccionado y calendario */}
          {contratoSeleccionado && (
            <div style={{ marginTop: 18, padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
              <h3>Pagos del contrato: {contratoSeleccionado.numeroContrato}</h3>
              <p><strong>Paquete:</strong> {contratoSeleccionado.paqueteNombre}</p>
              <p><strong>Duración:</strong> {contratoSeleccionado.duracion_meses || contratoSeleccionado.duracion} meses</p>
              <p><strong>Precio mensual:</strong> ${Number(contratoSeleccionado.precio_mensual || 0).toFixed(2)}</p>

              <table className="clientes-table" style={{ marginTop: 10 }}>
                <thead>
                  <tr>
                    <th>Cuota</th>
                    <th>Fecha vencimiento</th>
                    <th>Monto</th>
                    <th>Estatus</th>
                  </tr>
                </thead>
                <tbody>
                  {(contratoSeleccionado.pagos || []).map((p, idx) => (
                    <tr key={idx}>
                      <td>{p.cuota}</td>
                      <td>{formatDate(p.fecha_vencimiento)}</td>
                      <td>${Number(p.monto || 0).toFixed(2)}</td>
                      <td>
                        <span className={`estado-tag ${p.pagado ? "pagado" : "pendiente"}`}>
                          {p.pagado ? "Pagado" : (p.estatus || "Pago pendiente")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {(() => {
                const totals = calcularTotalesContrato(contratoSeleccionado);
                return (
                  <div style={{ marginTop: 12 }}>
                    <p><strong>Total contrato:</strong> ${totals.total.toFixed(2)}</p>
                    <p><strong>Pagado:</strong> ${totals.pagado.toFixed(2)}</p>
                    <p><strong>Por pagar:</strong> ${totals.pendiente.toFixed(2)}</p>
                    <div style={{ marginTop: 8 }}>
                      <button className="app-btn" onClick={() => setContratoSeleccionado(null)}>Cerrar</button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          <hr style={{ margin: "24px 0" }} />

          {/* REPORTES (mantengo tu funcionalidad) */}
          <h3>Mis Reportes</h3>
          <div className="filtros-reportes">
            <button className={filtro === "todos" ? "filtro-activo" : ""} onClick={() => setFiltro("todos")}>Todos</button>
            <button className={filtro === "activo" ? "filtro-activo" : ""} onClick={() => setFiltro("activo")}>Activos</button>
            <button className={filtro === "pendiente" ? "filtro-activo" : ""} onClick={() => setFiltro("pendiente")}>Pendientes</button>
            <button className={filtro === "finalizado" ? "filtro-activo" : ""} onClick={() => setFiltro("finalizado")}>Finalizados</button>
          </div>

          <table className="clientes-table" style={{ marginTop: 12 }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reportesFiltrados.length === 0 ? (
                <tr><td colSpan="5">No hay reportes para mostrar</td></tr>
              ) : reportesFiltrados.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.titulo}</td>
                  <td><span className={`estado-tag estado-${r.estado}`}>{r.estado}</span></td>
                  <td>{r.fecha}</td>
                  <td><button className="btn-ver" onClick={() => setReporteSeleccionado(r)}>Ver detalles</button></td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>

        {/* MODAL DETALLES REPORTE */}
        {reporteSeleccionado && (
          <div className="modal" style={{ display: "block" }}>
            <div className="modal-content">
              <span className="close" onClick={() => setReporteSeleccionado(null)}>&times;</span>
              <h3>Reporte #{reporteSeleccionado.id}</h3>
              <p><strong>Título:</strong> {reporteSeleccionado.titulo}</p>
              <p><strong>Descripción:</strong> {reporteSeleccionado.descripcion}</p>
              <p><strong>Contrato:</strong> {reporteSeleccionado.numeroContrato}</p>
              <p><strong>Estado:</strong> {reporteSeleccionado.estado}</p>
              <p><strong>Fecha:</strong> {reporteSeleccionado.fecha}</p>
            </div>
          </div>
        )}

      </section>
    </Usernav>
  );
}

export default ReportesUsuario;
