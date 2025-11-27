// src/components/page-admin/clientes.jsx
import React, { useState, useEffect } from "react";
import "../Css/stylead.css";
import Navbar from "../layouts/adminnav";

import { db } from "../../config/firebaseConfig";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";

export default function Cliente() {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtrados, setFiltrados] = useState([]);

  // Cargar usuarios y contratos
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // 1) usuarios
        const usersSnap = await getDocs(collection(db, "usuarios"));
        const usuarios = usersSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

        // 2) contratos
        const contratosSnap = await getDocs(collection(db, "contratos"));
        const contratos = contratosSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

        // Map: cliente_uid => array de contratos
        const contratosPorCliente = {};
        contratos.forEach((c) => {
          if (!contratosPorCliente[c.cliente_uid])
            contratosPorCliente[c.cliente_uid] = [];
          contratosPorCliente[c.cliente_uid].push(c);
        });

        // Construir lista final
        const lista = usuarios.map((u) => ({
          id: u.id,
          nombre: u.nombre || "",
          apellidos:
            u.apellidos ||
            (contratosPorCliente[u.id] &&
              contratosPorCliente[u.id][0]?.apellidos) ||
            "",
          email: u.email || "",
          telefono:
            (contratosPorCliente[u.id] &&
              contratosPorCliente[u.id][0]?.telefono) ||
            u.telefono ||
            "",
          direccion:
            (contratosPorCliente[u.id] &&
              contratosPorCliente[u.id][0]?.direccion) ||
            u.direccion ||
            "",
          contratos: contratosPorCliente[u.id] || [],
        }));

        setClientes(lista);
        setFiltrados(lista);
      } catch (err) {
        console.error("Error cargando clientes:", err);
      }
    };

    cargarDatos();
  }, []);

  // Filtrar
  const handleBuscar = (e) => {
    const valor = e.target.value.toLowerCase();
    setBusqueda(valor);

    setFiltrados(
      clientes.filter(
        (c) =>
          (c.nombre || "").toLowerCase().includes(valor) ||
          (c.apellidos || "").toLowerCase().includes(valor) ||
          (c.email || "").toLowerCase().includes(valor)
      )
    );
  };

  // Eliminar cliente y contratos asociados
  const eliminarCliente = async (clienteId) => {
    if (
      !window.confirm(
        "¿Eliminar este cliente? Esta acción borra su cuenta y contratos asociados."
      )
    )
      return;

    try {
      // borrar usuario
      await deleteDoc(doc(db, "usuarios", clienteId));

      // borrar contratos asociados
      const q = query(
        collection(db, "contratos"),
        where("cliente_uid", "==", clienteId)
      );
      const snap = await getDocs(q);
      const batchDeletes = snap.docs.map((d) =>
        deleteDoc(doc(db, "contratos", d.id))
      );
      await Promise.all(batchDeletes);

      alert("Cliente eliminado.");
      setClientes((prev) => prev.filter((c) => c.id !== clienteId));
      setFiltrados((prev) => prev.filter((c) => c.id !== clienteId));
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar.");
    }
  };

  return (
    <>
      <Navbar>
        <section className="clientes">
          <h1>Gestión de Clientes</h1>
          <p className="clientes-desc">
            Consulta y elimina información de los clientes registrados.
          </p>

          {/* Barra de búsqueda */}
          <div className="clientes-actions">
            <input
              type="text"
              placeholder="Buscar cliente por nombre, apellido o correo..."
              className="buscador"
              value={busqueda}
              onChange={handleBuscar}
            />
          </div>

          {/* Tabla */}
          <table className="clientes-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellidos</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Dirección</th>
                <th># Contratos</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filtrados.length > 0 ? (
                filtrados.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.nombre}</td>
                    <td>{c.apellidos || "—"}</td>
                    <td>{c.email}</td>
                    <td>{c.telefono || "N/A"}</td>
                    <td>{c.direccion || "N/A"}</td>
                    <td>{(c.contratos && c.contratos.length) || 0}</td>
                    <td>
                      <button
                        className="btn-eliminar"
                        onClick={() => eliminarCliente(c.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center" }}>
                    No hay clientes registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </Navbar>
    </>
  );
}

