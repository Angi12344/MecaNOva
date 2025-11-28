// src/components/page-user/contratar.jsx
import React, { useState, useEffect } from "react";
import "../Css/style.css";
import Usernav from "../layouts/usernav";
import { useNavigate, Link, useLocation } from "react-router-dom";

import { db } from "../../config/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  query,
  where,
  doc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

import emailjs from "@emailjs/browser";

function Contratacion() {
  const navigate = useNavigate();
  const location = useLocation();

  const usuarioLS = JSON.parse(localStorage.getItem("usuario"));
  const [usuarioDB, setUsuarioDB] = useState(null);

  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    correo: "",
    telefono: "",
    direccion: "",
    paquete: "",
    duracion: "",
    metodo_pago: "",
  });

  const [isValid, setIsValid] = useState(false);
  const [paquetesDisponibles, setPaquetesDisponibles] = useState([]);

  // --------------------------------------------------------------------
  // 1. Si no hay usuario, bloquear página
  // --------------------------------------------------------------------
  if (!usuarioLS) {
    return (
      <Usernav>
        <section style={{ textAlign: "center", padding: "40px" }}>
          <h2>🔒 Acceso restringido</h2>
          <p>Necesitas iniciar sesión.</p>
          <Link to="/login">Iniciar sesión</Link>
        </section>
      </Usernav>
    );
  }

  // --------------------------------------------------------------------
  // 2. Cargar datos desde Firestore + mezclar con localStorage
  // --------------------------------------------------------------------
  useEffect(() => {
    const cargarDatosUsuario = async () => {
      try {
        const ref = doc(db, "usuarios", usuarioLS.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          setUsuarioDB(data);

          // 🔥 MEJORADO — Prioriza datos de localStorage si existen
          setFormData((prev) => ({
            ...prev,
            nombre: usuarioLS.nombre || data.nombre || "",
            apellidos: usuarioLS.apellidos || data.apellidos || "",
            correo: usuarioLS.email || data.email || "",
            telefono: usuarioLS.telefono || data.telefono || "",
            direccion: usuarioLS.direccion || data.direccion || "",
          }));
        }
      } catch (e) {
        console.error("Error cargando datos:", e);
      }
    };

    cargarDatosUsuario();
  }, [usuarioLS.uid]);

  // --------------------------------------------------------------------
  // 3. Autorrelleno desde URL (paquete seleccionado)
  // --------------------------------------------------------------------
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paqueteURL = params.get("paquete");
    if (paqueteURL) {
      setFormData((prev) => ({ ...prev, paquete: paqueteURL }));
    }
  }, [location]);

  // --------------------------------------------------------------------
  // 4. Validación del formulario
  // --------------------------------------------------------------------
  useEffect(() => {
    const {
      nombre,
      apellidos,
      correo,
      telefono,
      direccion,
      paquete,
      duracion,
      metodo_pago,
    } = formData;

    setIsValid(
      nombre &&
        apellidos &&
        correo &&
        telefono &&
        direccion &&
        paquete &&
        duracion &&
        metodo_pago
    );
  }, [formData]);

  // --------------------------------------------------------------------
  // 5. Cargar paquetes activos
  // --------------------------------------------------------------------
  useEffect(() => {
    const cargarPaquetes = async () => {
      try {
        const qs = await getDocs(collection(db, "paquetes"));
        const lista = qs.docs.map((d) => ({ id: d.id, ...d.data() }));
        setPaquetesDisponibles(lista.filter((p) => p.activo === true));
      } catch (err) {
        console.error("Error al cargar paquetes:", err);
      }
    };
    cargarPaquetes();
  }, []);

  // --------------------------------------------------------------------
  // 6. Generar número único de contrato
  // --------------------------------------------------------------------
  function generarNumeroContrato() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let random = "";
    for (let i = 0; i < 8; i++) {
      random += chars[Math.floor(Math.random() * chars.length)];
    }
    return `CON-${random}`;
  }

  // --------------------------------------------------------------------
  // 7. Buscar paquete por nombre
  // --------------------------------------------------------------------
  const obtenerPaqueteByName = async (nombrePaquete) => {
    const q = query(collection(db, "paquetes"), where("nombre", "==", nombrePaquete));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const d = snap.docs[0];
      return { id: d.id, ...d.data() };
    }
    return null;
  };

  // --------------------------------------------------------------------
  // 8. Guardar contrato + calendario de pagos (primer vencimiento = mañana)
  // --------------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return alert("Faltan datos.");

    const numeroContrato = generarNumeroContrato();

    try {
      const paqueteDoc = await obtenerPaqueteByName(formData.paquete);
      if (!paqueteDoc) return alert("No se encontró el paquete.");

      const precioMensual = Number(paqueteDoc.precio_mensual || paqueteDoc.precio || 0);

      const duracionMeses =
        formData.duracion.includes("6") ? 6 : formData.duracion.includes("12") ? 12 : 1;

      const total = precioMensual * duracionMeses;

      // Primer pago vence mañana
      const hoy = new Date();
      const primerVence = new Date(hoy.getTime() + 24 * 60 * 60 * 1000);

      const pagos = [];
      for (let i = 0; i < duracionMeses; i++) {
        const due = new Date(primerVence.getTime() + i * 30 * 24 * 60 * 60 * 1000);

        pagos.push({
          cuota: i + 1,
          monto: precioMensual,
          pagado: false,
          estatus: "pago pendiente",
          fecha_vencimiento: Timestamp.fromDate(due),
        });
      }

      // 🔥 Datos completos que SÍ guardan teléfono y dirección correctamente
      const contratoData = {
        numeroContrato,
        cliente_uid: usuarioLS.uid,
        paqueteId: paqueteDoc.id,
        paqueteNombre: paqueteDoc.nombre,
        precio_mensual: precioMensual,
        duracion_meses: duracionMeses,
        metodo_pago: formData.metodo_pago,

        // Información del cliente (Fijo y funcional)
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        correo: formData.correo,
        telefono: formData.telefono,
        direccion: formData.direccion,

        pagos,
        total,
        fecha_creacion: serverTimestamp(),
        estado: "pendiente",
      };

      await addDoc(collection(db, "contratos"), contratoData);

      //Guardar en localStorage
      const lcl = { ...(usuarioLS || {}) };
      if (!lcl.contratos) lcl.contratos = [];
      lcl.contratos.push(numeroContrato);
      localStorage.setItem("usuario", JSON.stringify(lcl));

      
      await addDoc(collection(db, "notificaciones"), {
        tipo: "contrato",
        titulo: "Nuevo contrato generado",
        descripcion: `Contrato de ${formData.nombre} ${formData.apellidos}`,
        fecha: new Date(),
        leido: false,
        link: "/historialPagos",
      });


      // Enviar correo
      await emailjs.send(
        "service_8nzlm6a",
        "template_quqk4rs",
        {
          to_email: formData.correo,
          nombre: formData.nombre,
          apellidos: formData.apellidos,
          telefono: formData.telefono,      // 🔥 AGREGADO
          direccion: formData.direccion,    // 🔥 AGREGADO

          paquete: paqueteDoc.nombre,
          duracion: `${duracionMeses} meses`,
          metodo_pago: formData.metodo_pago,

          numeroContrato,
          precio_mensual: precioMensual,
          total,
        },
        "E3VFmMyvk8j-KqQy8"
      );


      navigate("/envemail");
    } catch (err) {
      console.error("Error:", err);
      alert("Hubo un problema al procesar tu contrato.");
    }

  };

  return (
    <Usernav>
      <section className="contratacion-section">
        <h2>Conect@T Contratación</h2>

        <form onSubmit={handleSubmit} className="contrato-form">
          
          {/* Datos personales */}
          <div className="form-group">
            <label>Nombre</label>
            <input
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Apellidos</label>
            <input
              value={formData.apellidos}
              onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Correo</label>
            <input
              type="email"
              value={formData.correo}
              onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Teléfono</label>
            <input
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Dirección</label>
            <input
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
            />
          </div>

          {/* Paquete */}
          <div className="form-group">
            <label>Paquete</label>
            <select
              value={formData.paquete}
              onChange={(e) => setFormData({ ...formData, paquete: e.target.value })}
            >
              <option value="">Seleccione</option>
              {paquetesDisponibles.map((p) => (
                <option key={p.id} value={p.nombre}>
                  {p.nombre} — ${Number(p.precio_mensual || p.precio || 0)}
                </option>
              ))}
            </select>
          </div>

          {/* Duración */}
          <div className="form-group">
            <label>Duración</label>
            <select
              value={formData.duracion}
              onChange={(e) => setFormData({ ...formData, duracion: e.target.value })}
            >
              <option value="">Seleccione</option>
              <option value="6 meses">6 meses</option>
              <option value="12 meses">12 meses</option>
            </select>
          </div>

          {/* Método pago */}
          <div className="form-group">
            <label>Método de pago</label>
            <select
              value={formData.metodo_pago}
              onChange={(e) => setFormData({ ...formData, metodo_pago: e.target.value })}
            >
              <option value="">Seleccione</option>
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
            </select>
          </div>

          <button disabled={!isValid}>Contratar</button>
        </form>
      </section>
    </Usernav>
  );
}

export default Contratacion;
