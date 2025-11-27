import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Css/stylead.css";
import { Link } from "react-router-dom";

import { auth, db } from "../../config/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp, collection, addDoc } from "firebase/firestore";

export default function Register() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmar) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      // 1. Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const uid = userCredential.user.uid;

      // 2. Crear documento en colección "usuarios"
      await setDoc(doc(db, "usuarios", uid), {
        email: email,
        nombre: nombre,
        rol: "cliente",
        telefono: "",
        activo: true,
        metadata: {
          fechaCreacion: serverTimestamp(),
          ultimoAcceso: serverTimestamp(),
        },
      });

      alert("Cuenta creada correctamente");
      navigate("/envemail");

    } catch (error) {
      console.error(error);
      alert("Error al crear la cuenta: " + error.message);
    }
  };

  return (
    <div className="login-admin">
      <div className="login-card">
        <h1>Crear Cuenta</h1>
        <p className="login-desc">Regístrate como nuevo cliente</p>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Nombre Completo</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Confirmar Contraseña</label>
            <input
              type="password"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              required
            />
          </div>

          <button className="btn-login" type="submit">
            Crear Cuenta
          </button>
        </form>

        <p className="login-desc" style={{ marginTop: "1.5rem" }}>
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login" style={{ color: "#21af0e", fontWeight: "bold" }}>
            Inicia Sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
