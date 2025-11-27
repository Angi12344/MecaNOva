import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../Css/stylead.css";

import { auth, db } from "../../config/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      const uid = userCredential.user.uid;

      let userData = null;

      // Buscar en USUARIOS
      const docRefUser = doc(db, "usuarios", uid);
      const snapUser = await getDoc(docRefUser);

      if (snapUser.exists()) {
        userData = snapUser.data();
      } else {
        // Buscar en ADMINISTRADORES
        const docRefAdmin = doc(db, "administradores", uid);
        const snapAdmin = await getDoc(docRefAdmin);

        if (snapAdmin.exists()) {
          userData = snapAdmin.data();
        } else {
          alert("Usuario no encontrado.");
          return;
        }
      }

      localStorage.setItem("usuario", JSON.stringify({
        uid,
        nombre: userData.nombre,
        rol: userData.rol,
        email: userData.email || userData.correo
      }));

      if (userData.rol === "admin" || userData.rol === "superadmin") {
        navigate("/homead");
      } else {
        navigate("/");
      }

    } catch (error) {
      console.error(error);
      alert("Credenciales incorrectas.");
    }
  };

  return (
    <div className="login-admin">
      <div className="login-card">
        <h1>Inicio de Sesión</h1>
        <p className="login-desc">Accede para ver todo el contenido</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Correo Electrónico</label>
            <input
              type="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn-login" type="submit">
            Iniciar Sesión
          </button>
        </form>

        <p className="login-desc" style={{ marginTop: "1.5rem" }}>
          ¿Aún no tienes cuenta?{" "}
          <Link to="/registro" style={{ color: "#21af0e", fontWeight: "bold" }}>
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}

