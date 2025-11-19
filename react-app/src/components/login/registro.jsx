import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Css/stylead.css";
import { Link } from "react-router-dom";
export default function Register() {
  const navigate = useNavigate();

  // Estados del formulario
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación simple
    if (password !== confirmar) {
      alert("Las contraseñas no coinciden");
      return;
    }

    // Aquí puedes hacer una petición POST para guardar al usuario en tu DB
    // Ejemplo:
    // axios.post("/api/usuarios", { nombre, email, password })

    alert("Cuenta creada correctamente ✅");

    navigate("/envemail"); // Redirigir al login
  };

  return (
    <div className="login-admin">
      <div className="login-card">
        <h1>Crear Cuenta</h1>
        <p className="login-desc">Regístrate como nuevo cliente</p>

        <form onSubmit={handleSubmit}>
          {/* Nombre */}
          <div className="form-group">
            <label>Nombre Completo</label>
            <input
              type="text"
              placeholder="Tu nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          {/* Correo */}
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

          {/* Contraseña */}
          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="Crea una contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Confirmación */}
          <div className="form-group">
            <label>Confirmar Contraseña</label>
            <input
              type="password"
              placeholder="Repite la contraseña"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              required
            />
          </div>

          {/* Botón */}
          <button className="btn-login" type="submit">
            Crear Cuenta
          </button>
        </form>

        {/* Link para ir al login */}
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
