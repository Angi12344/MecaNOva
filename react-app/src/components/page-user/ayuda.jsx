import React, { useState } from "react";
import "../Css/style.css";
import Usernav from "../layouts/usernav";

import { db } from "../../config/firebaseConfig";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs
} from "firebase/firestore";

import emailjs from "@emailjs/browser";
import { useNavigate } from "react-router-dom";

function Ayuda() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [formData, setFormData] = useState({
    nombre: usuario?.nombre || "",
    correo: usuario?.email || "",
    numeroContrato: "",
    domicilio: usuario?.direccion || "",
    titulo: "",
    descripcion: "",
    fecha: new Date().toISOString().split("T")[0],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 🔍 VALIDAR CONTRATO REAL
      const contratosRef = collection(db, "contratos");
      const q = query(
        contratosRef,
        where("numeroContrato", "==", formData.numeroContrato),
        where("cliente_uid", "==", usuario.uid)
      );

      const snap = await getDocs(q);

      if (snap.empty) {
        alert("❌ El número de contrato NO existe o no pertenece a tu cuenta.");
        return;
      }

      // ✔ Si llega aquí, el contrato sí existe, crear el reporte
      await addDoc(collection(db, "reportes"), {
        ...formData,
        cliente_uid: usuario?.uid || null,
        estado: "pendiente",
        fecha_creacion: serverTimestamp(),
      });

       // ✔ Crear notificación para el usuario
      await addDoc(collection(db, "notificaciones"), {
        tipo: "reporte",
        titulo: "Reporte enviado",
        descripcion: `Reporte: ${formData.titulo}`,
        usuario_uid: usuario.uid,
        fecha: new Date(),
        leido: false,
        link: "/reportes" // 👈 página a la que llevará cuando haga clic
      });
      // ✔ Enviar correo con EmailJS
      await emailjs.send(
        "service_8nzlm6a",
        "template_oourq2c",
        {
          to_email: formData.correo,
          nombre: formData.nombre,
          titulo: formData.titulo,
          descripcion: formData.descripcion,
          correo: formData.correo,
          numeroContrato: formData.numeroContrato,
          domicilio: formData.domicilio,
          fecha: formData.fecha,
        },
        "E3VFmMyvk8j-KqQy8"
      );

      // Redirigir
      navigate("/envemail");

      // Reset
      setFormData({
        nombre: usuario?.nombre || "",
        correo: usuario?.email || "",
        numeroContrato: "",
        domicilio: usuario?.direccion || "",
        titulo: "",
        descripcion: "",
        fecha: new Date().toISOString().split("T")[0],
      });

    } catch (error) {
      console.error("Error al enviar reporte:", error);
      alert("❌ Ocurrió un error al enviar el reporte.");
    }

  };

  return (
    <Usernav>
      <section className="ayuda-section">
        <div className="content-wrapper">
          <h2 className="section-title">Centro de Ayuda - Conect@T</h2>
          <p className="section-subtitle">
            Encuentra información útil o levanta un reporte de soporte.
          </p>

          <div className="ayuda-opciones">
            <div className="ayuda-card">
              <h3>¿Tienes un problema técnico?</h3>
              <p>Si tu conexión presenta fallos, levanta un reporte aquí.</p>
              <button className="app-btn" onClick={() => setMostrarFormulario(!mostrarFormulario)}>
                {mostrarFormulario ? "Cerrar formulario" : "Levantar reporte"}
              </button>
            </div>
          </div>

          {mostrarFormulario && (
            <form className="reporte-form" onSubmit={handleSubmit}>
              <h3>Levantar un reporte</h3>

              <div className="form-group">
                <label>Nombre:</label>
                <input name="nombre" value={formData.nombre} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Correo:</label>
                <input type="email" name="correo" value={formData.correo} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Número de contrato:</label>
                <input name="numeroContrato" value={formData.numeroContrato} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Domicilio:</label>
                <input name="domicilio" value={formData.domicilio} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Título del reporte:</label>
                <input name="titulo" value={formData.titulo} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Descripción del problema:</label>
                <textarea name="descripcion" rows="4" value={formData.descripcion} onChange={handleChange} required></textarea>
              </div>

              <div className="form-group">
                <label>Fecha:</label>
                <input name="fecha" value={formData.fecha} readOnly style={{ background: "#eee" }} />
              </div>

              <button type="submit">Enviar reporte</button>
            </form>
          )}
        </div>
      </section>
    </Usernav>
  );
}

export default Ayuda;
