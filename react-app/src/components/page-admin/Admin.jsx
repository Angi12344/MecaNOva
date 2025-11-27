import React, { useState, useEffect } from "react";
import "../Css/stylead.css";
import Navbar from "../layouts/adminnav";

import { auth, db } from "../../config/firebaseConfig";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  setDoc
} from "firebase/firestore";
import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";

export default function Admin() {
  const [administradores, setAdministradores] = useState([]);
  const [editando, setEditando] = useState(null);

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    rol: "",
    password: "",
    activo: true,
  });

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  // 🚫 BLOQUEAR SI NO ES SUPERADMIN
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

  // 📌 Cargar lista desde Firestore
  useEffect(() => {
    const cargarAdmins = async () => {
      const snap = await getDocs(collection(db, "administradores"));
      const lista = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setAdministradores(lista);
    };
    cargarAdmins();
  }, []);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // 📌 Registrar administrador
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1️⃣ Crear usuario en Firebase Auth
      const cred = await createUserWithEmailAndPassword(
        auth,
        formData.correo,
        formData.password
      );

      const uid = cred.user.uid;

      // 2️⃣ Guardar en Firestore CON EL UID COMO ID
      await setDoc(doc(db, "administradores", uid), {
        uid,
        nombre: formData.nombre,
        apellido: formData.apellido,
        correo: formData.correo,
        rol: formData.rol,
        activo: formData.activo,
      });

      alert("Administrador agregado correctamente ✔");

      setFormData({
        nombre: "",
        apellido: "",
        correo: "",
        rol: "",
        password: "",
        activo: true,
      });

      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Error al registrar administrador: " + err.message);
    }
  };

  // 📌 Abrir modal de edición
  const abrirEditar = (admin) => {
    setEditando(admin);
    setFormData(admin);
  };

  const guardarEdicion = async () => {
    try {
      const ref = doc(db, "administradores", editando.id);
      await updateDoc(ref, {
        nombre: formData.nombre,
        apellido: formData.apellido,
        rol: formData.rol,
        activo: formData.activo,
      });

      alert("Administrador actualizado ✔");
      setEditando(null);
      window.location.reload();
    } catch (err) {
      alert("Error al guardar cambios");
    }
  };

  const eliminarAdmin = async (admin) => {
    if (!window.confirm("¿Eliminar este administrador?")) return;

    try {
      await deleteDoc(doc(db, "administradores", admin.id));

      // 🔥 Si el admin es el usuario actual, eliminar de Auth
      const user = auth.currentUser;
      if (user && user.email === admin.correo) {
        await deleteUser(user);
      }

      alert("Administrador eliminado");
      window.location.reload();
    } catch (err) {
      alert("Error al eliminar");
      console.error(err);
    }
  };

  return (
    <Navbar>
      <div className="permisos">
        <h1>Gestión de Administradores</h1>

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="formulario">
          <h2>Registrar nuevo administrador</h2>

          <input type="text" name="nombre" placeholder="Nombre"
            value={formData.nombre} onChange={handleChange} required />

          <input type="text" name="apellido" placeholder="Apellido"
            value={formData.apellido} onChange={handleChange} required />

          <select name="rol" value={formData.rol} onChange={handleChange} required>
            <option value="">Seleccionar rol</option>
            <option value="admin">Admin</option>
            <option value="superadmin">Superadmin</option>
          </select>

          <input type="email" name="correo" placeholder="Correo"
            value={formData.correo} onChange={handleChange} required />

          <input type="password" name="password" placeholder="Contraseña"
            value={formData.password} onChange={handleChange} required />

          <label className="check-flex">
            <input type="checkbox" name="activo"
              checked={formData.activo} onChange={handleChange} />
            Activo
          </label>

          <button type="submit" className="btn-primary">Agregar</button>
        </form>

        <h2>Lista de Administradores</h2>

        <table className="clientes-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Activo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {administradores.map((a) => (
              <tr key={a.id}>
                <td>{a.nombre}</td>
                <td>{a.apellido}</td>
                <td>{a.correo}</td>
                <td>{a.rol}</td>
                <td>{a.activo ? "Sí" : "No"}</td>
                <td>
                  <button className="btn-editar" onClick={() => abrirEditar(a)}>Editar</button>
                  <button className="btn-danger" onClick={() => eliminarAdmin(a)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* MODAL EDITAR */}
        {editando && (
          <div className="modal">
            <div className="modal-content">
              <h2>Editar Administrador</h2>

              <input
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              />

              <input
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
              />

              <select
                value={formData.rol}
                onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
              >
                <option value="admin">Admin</option>
                <option value="superadmin">Superadmin</option>
              </select>

              <label>
                <input
                  type="checkbox"
                  checked={formData.activo}
                  onChange={(e) =>
                    setFormData({ ...formData, activo: e.target.checked })
                  }
                />
                Activo
              </label>

              <div className="modal-buttons">
                <button className="btn-guardar" onClick={guardarEdicion}>
                  Guardar
                </button>
                <button className="btn-cerrar" onClick={() => setEditando(null)}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Navbar>
  );
}
