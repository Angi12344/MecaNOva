import React, { useState, useEffect } from "react";
import "../Css/stylead.css";
import Navbar from "../layouts/adminnav";

import { db } from "../../config/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

export default function Paquetesad() {
  
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const ES_SUPER = usuario?.rol === "superadmin";
  const ES_ADMIN = usuario?.rol === "admin";

  if (!usuario) {
    return (
      <Navbar>
        <h1>Debes iniciar sesión</h1>
      </Navbar>
    );
  }

  if (ES_ADMIN) {
    return (
      <Navbar>
        <div className="bloqueo">
          <h1>⛔ Acceso denegado</h1>
          <p>No tienes permisos para gestionar paquetes.</p>
        </div>
      </Navbar>
    );
  }

  const [paquetes, setPaquetes] = useState([]);
  const [editando, setEditando] = useState(false);
  const [paqueteIdEdit, setPaqueteIdEdit] = useState(null);

  const [formData, setFormData] = useState({
    nombre: "",
    velocidad: "",
    descripcion: "",
    precio_mensual: "",
    promocion: "",
    beneficios: "",
  });

  const cargarPaquetes = async () => {
    const querySnapshot = await getDocs(collection(db, "paquetes"));
    const lista = querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    setPaquetes(lista);
  };

  useEffect(() => {
    cargarPaquetes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, "paquetes"), {
      ...formData,
      precio_mensual: Number(formData.precio_mensual),
      activo: true,
      fecha_creacion: new Date(),
    });

    alert("Paquete agregado ✔");
    cargarPaquetes();

    setFormData({
      nombre: "",
      velocidad: "",
      descripcion: "",
      precio_mensual: "",
      promocion: "",
      beneficios: "",
    });
  };

  const handleEdit = (p) => {
    setEditando(true);
    setPaqueteIdEdit(p.id);
    setFormData({
      nombre: p.nombre,
      velocidad: p.velocidad,
      descripcion: p.descripcion,
      precio_mensual: p.precio_mensual,
      promocion: p.promocion,
      beneficios: p.beneficios,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    await updateDoc(doc(db, "paquetes", paqueteIdEdit), {
      ...formData,
      precio_mensual: Number(formData.precio_mensual),
    });

    alert("Paquete actualizado ✔");

    setEditando(false);
    cargarPaquetes();

    setFormData({
      nombre: "",
      velocidad: "",
      descripcion: "",
      precio_mensual: "",
      promocion: "",
      beneficios: "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar paquete?")) return;
    await deleteDoc(doc(db, "paquetes", id));
    cargarPaquetes();
  };

  return (
    <Navbar>
      <div className="clientes">
        <h1>Gestión de Paquetes</h1>

        <form
          onSubmit={editando ? handleUpdate : handleSubmit}
          className="formulario"
        >
          <h2>{editando ? "Editar paquete" : "Agregar nuevo paquete"}</h2>

          <input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre" required />
          <input name="velocidad" value={formData.velocidad} onChange={handleChange} placeholder="Velocidad" required />
          <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} placeholder="Descripción" required />
          <input type="number" name="precio_mensual" value={formData.precio_mensual} onChange={handleChange} placeholder="Precio mensual" required />
          <input name="promocion" value={formData.promocion} onChange={handleChange} placeholder="Promoción" />
          <input name="beneficios" value={formData.beneficios} onChange={handleChange} placeholder="Beneficios" />

          <button className="btn-primary">
            {editando ? "Actualizar" : "Agregar"}
          </button>

          {editando && (
            <button type="button" className="btn-danger" onClick={() => setEditando(false)}>
              Cancelar
            </button>
          )}
        </form>

        <h1>Lista de Paquetes</h1>

        <table className="clientes-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Velocidad</th>
              <th>Precio</th>
              <th>Promoción</th>
              <th>Activo</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {paquetes.map((p) => (
              <tr key={p.id}>
                <td>{p.nombre}</td>
                <td>{p.velocidad}</td>
                <td>${p.precio_mensual}</td>
                <td>{p.promocion || "N/A"}</td>
                <td>{p.activo ? "Sí" : "No"}</td>

                <td>
                  <button className="btn-edit" onClick={() => handleEdit(p)}>Editar</button>
                  <button className="btn-danger" onClick={() => handleDelete(p.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Navbar>
  );
}
