import React, { useState, useEffect } from "react";
import "../Css/stylead.css";
import Navbar from "../layouts/adminnav";

export default function Admin() {
  const [administradores, setAdmin] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    rol: "",
    correo: "",
    password: "",
    activo: true,
  });
  const [success, setSuccess] = useState("");
  const usuario = JSON.parse(localStorage.getItem("usuario"));

if (!usuario || usuario.rol !== "superadmin") {
  return (
     <Navbar>
    <div className="bloqueo">
      <h1>⛔ Acceso denegado</h1>
      <p>Esta sección solo puede ser vista por usuarios SuperAdministrador.</p>
    </div>
    </Navbar>
  );
}

  // 🔹 Cargar lista de administradores
  useEffect(() => {
    fetch("/api/administradores")
      .then((res) => res.json())
      .then((data) => setAdmin(data))
      .catch((err) => console.error("Error al cargar administradores:", err));
  }, []);

  // 🔹 Manejar cambios del formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // 🔹 Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/administradores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const nuevoAdmin = await response.json();
      setAdmin([...administradores, nuevoAdmin]);
      setFormData({
        nombre: "",
        apellido: "",
        rol: "",
        correo: "",
        password: "",
        activo: true,
      });
      setSuccess("Administrador agregado correctamente.");
      setTimeout(() => setSuccess(""), 3000);
    } else {
      alert("Error al agregar administrador");
    }
  };

  // 🔹 Eliminar administrador
  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este administrador?")) return;

    const response = await fetch(`/api/administradores/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setAdmin(administradores.filter((a) => a.id !== id));
    } else {
      alert("Error al eliminar administrador");
    }
  };

  return (
    <>
      <Navbar>
      <div className="permisos">
        <h1>Gestión de Permisos - Administradores</h1>
        <p>
          Administra los usuarios con rol de administrador. Solo los “super”
          pueden modificar roles.
        </p>

        {success && <div className="alert success">{success}</div>}

        <form onSubmit={handleSubmit} className="formulario">
          <h2>Registrar nuevo administrador</h2>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="apellido"
            placeholder="Apellido"
            value={formData.apellido}
            onChange={handleChange}
            required
          />
          <select
            name="rol"
            value={formData.rol}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar rol</option>
            <option value="super">Super</option>
            <option value="admin">Admin</option>
          </select>
          <input
            type="email"
            name="correo"
            placeholder="Correo electrónico"
            value={formData.correo}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            required
          />
     <label className="check-flex">
        <input
        type="checkbox"
        name="activo"
        checked={formData.activo}
        onChange={handleChange}
            />Activo
          </label>
          <button type="submit" className="btn-primary">
            Agregar
          </button>
        </form>

        <h2>Lista de administradores</h2>
        <table className="clientes-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Rol</th>
              <th>Correo</th>
              <th>Activo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {administradores.length > 0 ? (
              administradores.map((admin) => (
                <tr key={admin.id}>
                  <td>{admin.id}</td>
                  <td>{admin.nombre}</td>
                  <td>{admin.apellido}</td>
                  <td>{admin.rol}</td>
                  <td>{admin.correo}</td>
                  <td>{admin.activo ? "Sí" : "No"}</td>
                  <td>
                    <button
                      className="btn-danger"
                      onClick={() => handleDelete(admin.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No hay administradores registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </Navbar>
    </>
  );
}
