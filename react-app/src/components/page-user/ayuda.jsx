import React, { useState } from "react";
import "../Css/style.css";
import Usernav from "../layouts/usernav";

function Ayuda() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    numeroContrato: "",
    domicilio: "",
    descripcion: "",
    fecha: new Date().toISOString().split("T")[0], // Fecha automática
  });

  // Manejo del cambio en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Manejo del envío (más adelante conectará con Firebase)

/*import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebaseConfig";

await addDoc(collection(db, "reportes"), formData); */

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulación de envío
    console.log("Reporte enviado:", formData);

    alert("✅ Tu reporte ha sido enviado correctamente.");
    setFormData({
      nombre: "",
      correo: "",
      numeroContrato: "",
      domicilio: "",
      titulo: "",
      descripcion: "",
      fecha: new Date().toISOString().split("T")[0],
    });
    setMostrarFormulario(false);
  };

  return (
    <Usernav>
      <section className="ayuda-section">
        <div className="content-wrapper">
          <h2 className="section-title">Centro de Ayuda - Conect@T</h2>
          <p className="section-subtitle">
            Encuentra información útil o levanta un reporte de soporte.
          </p>

          {/* Opciones de ayuda */}
          <div className="ayuda-opciones">
            <div className="ayuda-card">
              <h3>¿Cómo contratar un paquete?</h3>
              <p>
                Primero <strong>inicia sesión</strong> luego dirígete a la sección <strong>“Paquetes”</strong>, elige el plan
                que mejor se adapte a ti y presiona el botón de{" "}
                <strong>“Contratar”</strong>. Luego llena el formulario con tus
                datos.
              </p>
            </div>

            <div className="ayuda-card">
              <h3>¿Qué datos necesito para contratar?</h3>
              <ul>
                <li>Nombre completo</li>
                <li>Correo electrónico</li>
                <li>Teléfono y dirección</li>
                <li>Paquete elegido</li>
              </ul>
            </div>

            <div className="ayuda-card">
              <h3>¿Tienes un problema técnico?</h3>
              <p>
                Si tu conexión presenta fallos o necesitas asistencia, puedes
                levantar un reporte desde aquí.
              </p>
              <button
                className="app-btn"
                onClick={() => setMostrarFormulario(!mostrarFormulario)}
              >
                {mostrarFormulario ? "Cerrar formulario" : "Levantar reporte"}
              </button>
            </div>
          </div>

          {/* Formulario de reporte */}
          {mostrarFormulario && (
            <form className="reporte-form" onSubmit={handleSubmit}>
              <h3>Levantar un reporte</h3>

              <div className="form-group">
                <label>Nombre:</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Correo:</label>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Número de contrato:</label>
                <input
                  type="text"
                  name="numeroContrato"
                  value={formData.numeroContrato}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Domicilio:</label>
                <input
                  type="text"
                  name="domicilio"
                  value={formData.domicilio}
                  onChange={handleChange}
                  required
                />
              </div>
                
              <div className="form-group">
                <label>Titulo:</label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Descripción del problema:</label>
                <textarea
                  name="descripcion"
                  rows="4"
                  value={formData.descripcion}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label>Fecha del reporte:</label>
                <input
                  type="text"
                  name="fecha"
                  value={formData.fecha}
                  readOnly
                  style={{ backgroundColor: "#eee" }}
                />
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
