import React, { useState, useEffect } from "react";
import "../Css/style.css";
import Usernav from "../layouts/usernav";
import { useNavigate, Link } from 'react-router-dom';

function Contratacion({ paquetes = [] }) {
    const navigate = useNavigate();

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  // ✅ Si NO hay usuario, bloqueamos la vista
  
    if (!usuario) {
       return(
    
      <Usernav>
        <section className="contratacion-section" style={{ textAlign: "center", padding: "40px" }}>
          <h2>🔒 Acceso restringido</h2>
          <p>Para contratar un servicio necesitas iniciar sesión.</p>

          <Link to="/login" className="login-btn" style={{ marginTop: "20px", display: "inline-block" }}>
            Iniciar sesión
          </Link>
        </section>
      </Usernav>
    );
  }

  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    correo: "",
    telefono: "",
    direccion: "",
    paquete: "",
    metodoPago: "efectivo",
  });

  const [isValid, setIsValid] = useState(false);

  // Detecta si todos los campos obligatorios están completos
  useEffect(() => {
    const { nombre, apellidos, correo, telefono, direccion, paquete } = formData;
    setIsValid(nombre && apellidos && correo && telefono && direccion && paquete);
  }, [formData]);

  // Preselecciona el paquete desde la URL si existe (?paquete=nombre)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paqueteSeleccionado = params.get("paquete");
    if (paqueteSeleccionado) {
      setFormData((prev) => ({ ...prev, paquete: paqueteSeleccionado }));
    }
  }, []);

  // Manejador de cambios de inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Acción del formulario (a futuro se conectará a Firebase)
 const handleSubmit = (e) => {
    e.preventDefault(); // Detiene el envío clásico del formulario

    // Verifica la validez del estado (que ya calculas con useEffect)
    if (isValid) {
        console.log("Datos del contrato:", formData);

        // 🔜 Aquí se integraría Firebase

        alert("Formulario enviado (solo demostración)");

        // 2. Redirección 
        navigate('/envemail'); 
    } else {
        // Opcional: Mostrar un mensaje si el botón fue presionado de alguna forma sin ser válido
        alert("Por favor, complete todos los campos requeridos.");
    }
};


  return (
<>
 <Usernav>
    <section id="contratacion" className="contratacion-section">
      <h2>Conect@T Contratación</h2>
      <p>Completa tus datos para contratar tu servicio de Internet.</p>

      <form id="contratoForm" onSubmit={handleSubmit} className="contrato-form">
        <div className="form-group">
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="apellidos">Apellidos:</label>
          <input
            type="text"
            id="apellidos"
            name="apellidos"
            value={formData.apellidos}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="correo">Correo electrónico:</label>
          <input
            type="email"
            id="correo"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="telefono">Teléfono:</label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            pattern="[0-9]{10}"
            value={formData.telefono}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="direccion">Dirección:</label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="paquete">Paquete de Internet:</label>
          <select
            id="paquete"
            name="paquete"
            value={formData.paquete}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un paquete</option>
            {paquetes.map((paq, index) => (
              <option key={index} value={paq.nombre}>
                {paq.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="metodoPago">Método de Pago:</label>
          <select
            id="metodoPago"
            name="metodoPago"
            value="efectivo"
            disabled
          >
            <option value="efectivo">Pago en Efectivo</option>
          </select>
        </div>

        <div id="datosPago" className="metodo-pago-info">
          <p>Podrás pagar en tiendas de conveniencia o sucursales autorizadas.</p>
        </div>

        <button type="submit" id="btnContratar" disabled={!isValid}>
          Contratar                                                         {/* lo del pdf creo que aqui va */}
        </button>
      </form>
    </section>
    </Usernav>
      </>
  );
}

export default Contratacion;
//nmmn ya me quiero ir a dormir 