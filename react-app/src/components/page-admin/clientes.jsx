import React, { useState, useEffect } from "react";
import "../Css/stylead.css";
import Navbar from "../layouts/adminnav";

export default function Cliente() {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtrados, setFiltrados] = useState([]);

  // 🔹 Cargar clientes desde el backend
  useEffect(() => {
    fetch("/api/clientes")
      .then((res) => res.json())
      .then((data) => {
        setClientes(data);
        setFiltrados(data);
      })
      .catch((err) => console.error("Error al cargar clientes:", err));
  }, []);

  // 🔹 Filtrar clientes por nombre o correo
  const handleBuscar = (e) => {
    const valor = e.target.value.toLowerCase();
    setBusqueda(valor);
    setFiltrados(
      clientes.filter(
        (c) =>
          c.nombre.toLowerCase().includes(valor) ||
          c.apellido.toLowerCase().includes(valor) ||
          c.correo.toLowerCase().includes(valor)
      )
    );
  };

  // 🔹 (Opcional) Acciones para botones
  const handleVer = (id) => {
    alert(`Ver detalles del cliente ID: ${id}`);
  };

  const handleEditar = (id) => {
    alert(`Editar cliente ID: ${id}`);
  };

  return (
    <>
      <Navbar>
      <section className="clientes">
        <h1>Gestión de Clientes</h1>
        <p className="clientes-desc">
          Administra la información de los clientes registrados en el sistema.
          Desde aquí podrás agregar nuevos, editar sus datos o consultar su
          estado actual.
        </p>

        {/* Barra de acciones */}
        <div className="clientes-actions">
          <button className="btn-agregar">+ Agregar Cliente</button>
          <input
            type="text"
            placeholder="Buscar cliente..."
            className="buscador"
            value={busqueda}
            onChange={handleBuscar}
          />
        </div>

        {/* Tabla de clientes */}
        <table className="clientes-table">
          <thead>
            <tr>
              <th>ID Cliente</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Contraseña</th>
              <th>Dirección</th>
              <th>Estado</th>
              <th>Fecha de Registro</th>
              <th>Última Actualización</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length > 0 ? (
              filtrados.map((cliente) => (
                <tr key={cliente.id_cliente}>
                  <td>{cliente.id_cliente}</td>
                  <td>{cliente.nombre}</td>
                  <td>{cliente.apellido}</td>
                  <td>{cliente.correo}</td>
                  <td>{cliente.telefono || "N/A"}</td>
                  <td>••••••••</td>
                  <td>{cliente.direccion || "N/A"}</td>
                  <td>
                    <span className={`estado ${cliente.estado}`}>
                      {cliente.estado
                        ? cliente.estado.charAt(0).toUpperCase() +
                          cliente.estado.slice(1)
                        : "Desconocido"}
                    </span>
                  </td>
                  <td>
                    {new Date(cliente.created_at).toISOString().split("T")[0]}
                  </td>
                  <td>
                    {new Date(cliente.updated_at).toISOString().split("T")[0]}
                  </td>
                  <td>
                    <button
                      className="btn-ver"
                      onClick={() => handleVer(cliente.id_cliente)}
                    >
                      Ver
                    </button>
                    <button
                      className="btn-editar"
                      onClick={() => handleEditar(cliente.id_cliente)}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" style={{ textAlign: "center" }}>
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