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
  const [paquetes, setPaquetes] = useState([]);
  const [editando, setEditando] = useState(false); // <- Nuevo
  const [paqueteIdEdit, setPaqueteIdEdit] = useState(null); // <- Nuevo

  const [formData, setFormData] = useState({
    nombre: "",
    velocidad: "",
    descripcion: "",
    precio_mensual: "",
    promocion: "",
    beneficios: "",
  });

  // ============================
  //   CARGAR PAQUETES
  // ============================
  const cargarPaquetes = async () => {
    const querySnapshot = await getDocs(collection(db, "paquetes"));
    const lista = querySnapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
    setPaquetes(lista);
  };

  useEffect(() => {
    cargarPaquetes();
  }, []);

  // ============================
  //   MANEJAR INPUTS
  // ============================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ============================
  //   AGREGAR NUEVO PAQUETE
  // ============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "paquetes"), {
        ...formData,
        precio_mensual: Number(formData.precio_mensual),
        activo: true,
        duracion_contrato: "12 meses",
        fecha_creacion: new Date(),
      });

      alert("Paquete agregado con éxito");

      setFormData({
        nombre: "",
        velocidad: "",
        descripcion: "",
        precio_mensual: "",
        promocion: "",
        beneficios: "",
      });

      cargarPaquetes();
    } catch (error) {
      console.error("Error al agregar paquete:", error);
    }
  };

  // ============================
  //   ELIMINAR PAQUETE
  // ============================
  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este paquete?")) return;

    try {
      await deleteDoc(doc(db, "paquetes", id));
      cargarPaquetes();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // ============================
  //   ENTRAR EN MODO EDITAR
  // ============================
  const handleEdit = (paquete) => {
    setEditando(true);
    setPaqueteIdEdit(paquete.id);

    setFormData({
      nombre: paquete.nombre,
      velocidad: paquete.velocidad,
      descripcion: paquete.descripcion,
      precio_mensual: paquete.precio_mensual,
      promocion: paquete.promocion || "",
      beneficios: paquete.beneficios || "",
    });
  };

  // ============================
  //   GUARDAR EDICIÓN
  // ============================
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await updateDoc(doc(db, "paquetes", paqueteIdEdit), {
        ...formData,
        precio_mensual: Number(formData.precio_mensual),
      });

      alert("Paquete actualizado correctamente");

      setEditando(false);
      setPaqueteIdEdit(null);

      setFormData({
        nombre: "",
        velocidad: "",
        descripcion: "",
        precio_mensual: "",
        promocion: "",
        beneficios: "",
      });

      cargarPaquetes();
    } catch (error) {
      console.error("Error al editar:", error);
    }
  };

  return (
    <>
      <Navbar>
        <div className="clientes">
          <h1>Gestión de Paquetes</h1>

          {/* FORM NUEVO Y EDITAR */}
          <form
            onSubmit={editando ? handleUpdate : handleSubmit}
            className="formulario"
          >
            <h2>{editando ? "Editar Paquete" : "Agregar nuevo paquete"}</h2>

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
              name="velocidad"
              placeholder="Velocidad"
              value={formData.velocidad}
              onChange={handleChange}
              required
            />

            <textarea
              name="descripcion"
              placeholder="Descripción"
              value={formData.descripcion}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="precio_mensual"
              placeholder="Precio mensual"
              value={formData.precio_mensual}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="promocion"
              placeholder="Promoción"
              value={formData.promocion}
              onChange={handleChange}
            />

            <input
              type="text"
              name="beneficios"
              placeholder="Beneficios"
              value={formData.beneficios}
              onChange={handleChange}
            />

            <button className="btn-primary" type="submit">
              {editando ? "Actualizar paquete" : "Agregar paquete"}
            </button>

            {editando && (
              <button
                type="button"
                className="btn-danger"
                onClick={() => {
                  setEditando(false);
                  setFormData({
                    nombre: "",
                    velocidad: "",
                    descripcion: "",
                    precio_mensual: "",
                    promocion: "",
                    beneficios: "",
                  });
                }}
              >
                Cancelar edición
              </button>
            )}
          </form>

          {/* LISTA */}
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
                    <button className="btn-edit" onClick={() => handleEdit(p)}>
                      Editar
                    </button>
                    <button className="btn-danger" onClick={() => handleDelete(p.id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Navbar>
    </>
  );
}


