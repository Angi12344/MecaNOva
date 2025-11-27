// src/components/page-admin/Historialdepagos.jsx
import React, { useEffect, useState } from "react";
import "../Css/stylead.css";
import Navbar from "../layouts/adminnav";

import { db } from "../../config/firebaseConfig";
import {
  collection,
  query,
  onSnapshot,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

export default function Historialdepagos() {
  const [contratos, setContratos] = useState([]);
  const [cronogramaOpen, setCronogramaOpen] = useState(null);

  // ---------------------------------------------------
  // AUTO-CANCELAR CONTRATO SI NO PAGA EN 24 HORAS
  // ---------------------------------------------------
  const verificarCancelacion = async (contrato) => {
    if (contrato.estado !== "activo") return;

    const fecha = contrato.fecha_activacion?.toMillis();
    if (!fecha) return;

    const limite = fecha + 24 * 60 * 60 * 1000; // 24 horas
    const ahora = Date.now();

    const primerPago = contrato.pagos?.[0];
    const pagado = primerPago?.pagado === true;

    if (!pagado && ahora > limite) {
      await updateDoc(doc(db, "contratos", contrato.id), {
        estado: "cancelado",
      });
      console.log(
        `Contrato ${contrato.numeroContrato} CANCELADO automáticamente por falta de pago.`
      );
    }
  };

  // CARGAR CONTRATOS + ejecutar verificaciones
  useEffect(() => {
    const q = query(collection(db, "contratos"));
    const unsub = onSnapshot(q, (snap) => {
      const lista = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      lista.sort((a, b) => {
        const ta = a.fecha_creacion?.toMillis?.() || 0;
        const tb = b.fecha_creacion?.toMillis?.() || 0;
        return tb - ta;
      });

      lista.forEach((c) => verificarCancelacion(c));
      setContratos(lista);
    });

    return () => unsub();
  }, []);

  // ---------------------------------------------------
  // ACTIVAR CONTRATO + enviar push
  // ---------------------------------------------------
  const activarContrato = async (contrato) => {
    if (!window.confirm("¿Confirmar activación del contrato?")) return;

    try {
      await updateDoc(doc(db, "contratos", contrato.id), {
        estado: "activo",
        fecha_activacion: serverTimestamp(),
      });

      await fetch(
        "https://us-central1-novabooks-35f3b.cloudfunctions.net/activarContrato",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contratoId: contrato.id,
            uid: contrato.cliente_uid,
          }),
        }
      );

      alert("Contrato activado y notificación enviada.");
    } catch (err) {
      console.error(err);
      alert("Error al activar contrato.");
    }
  };

  const abrirCronograma = (c) => setCronogramaOpen(c);
  const cerrarCronograma = () => setCronogramaOpen(null);

  const formatDate = (ts) =>
    ts?.toDate ? ts.toDate().toLocaleDateString() : "—";

  return (
    <Navbar>
      <div className="clientes">
        <h1>Gestión de Contratos / Historial de Pagos</h1>

        {/* LISTA DE PENDIENTES */}
        <h2>Contratos Pendientes de Activación</h2>
        <div style={{ overflowX: "auto" }}>
          <table className="clientes-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Paquete</th>
                <th>Duración</th>
                <th>Método pago</th>
                <th>Contrato</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {contratos.filter((c) => c.estado === "pendiente").length === 0 ? (
                <tr>
                  <td colSpan="7">No hay contratos pendientes.</td>
                </tr>
              ) : (
                contratos
                  .filter((c) => c.estado === "pendiente")
                  .map((c) => (
                    <tr key={c.id}>
                      <td>{c.id}</td>
                      <td>{c.nombre} {c.apellidos}</td>
                      <td>{c.paqueteNombre}</td>
                      <td>{c.duracion_meses} meses</td>
                      <td>{c.metodo_pago}</td>
                      <td>{c.numeroContrato}</td>
                      <td>
                        <button className="btn-activar" onClick={() => activarContrato(c)}>
                          Activar
                        </button>
                        <button className="btn-ver" onClick={() => abrirCronograma(c)}>
                          Ver cronograma
                        </button>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>

        {/* ACTIVOS */}
        <h2 style={{ marginTop: 30 }}>Contratos Activos</h2>
        <div style={{ overflowX: "auto" }}>
          <table className="clientes-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Paquete</th>
                <th>Duración</th>
                <th>Número</th>
                <th>Activado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {contratos.filter((c) => c.estado === "activo").length === 0 ? (
                <tr>
                  <td colSpan="7">No hay contratos activos.</td>
                </tr>
              ) : (
                contratos
                  .filter((c) => c.estado === "activo")
                  .map((c) => (
                    <tr key={c.id}>
                      <td>{c.id}</td>
                      <td>{c.nombre} {c.apellidos}</td>
                      <td>{c.paqueteNombre}</td>
                      <td>{c.duracion_meses} meses</td>
                      <td>{c.numeroContrato}</td>
                      <td>{formatDate(c.fecha_activacion)}</td>
                      <td>
                        <button className="btn-ver" onClick={() => abrirCronograma(c)}>
                          Ver cronograma
                        </button>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>

        {/* CRONOGRAMA */}
        {cronogramaOpen && (
          <>
            <h2 style={{ marginTop: 30 }}>
              Cronograma — {cronogramaOpen.numeroContrato}
            </h2>

            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <button className="btn-agregar" onClick={cerrarCronograma}>
                Cerrar
              </button>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table className="clientes-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Mes</th>
                    <th>Inicio</th>
                    <th>Fin</th>
                    <th>Monto</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {(cronogramaOpen.pagos || []).map((p, i) => {
                    const fin = p.fecha_vencimiento?.toDate();
                    const inicio = new Date(
                      fin.getTime() - 30 * 24 * 60 * 60 * 1000
                    );

                    return (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{fin.toLocaleString("default", { month: "short", year: "numeric" })}</td>
                        <td>{inicio.toLocaleDateString()}</td>
                        <td>{fin.toLocaleDateString()}</td>
                        <td>${p.monto}</td>
                        <td>{p.pagado ? "Pagado" : "Pendiente"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </Navbar>
  );
}
