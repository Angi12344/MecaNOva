import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../Css/stylead.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación simple
    if (email === "admin@demo.com" && password === "12345") {
      
        localStorage.setItem("usuario", JSON.stringify({ nombre: "Administrador", rol: "admin" }));
        window.dispatchEvent(new Event("storage"));
        navigate("/homead");
    } 
    
    else if(email === "cliente@prueba.com" && password === "12345"){
      
      localStorage.setItem("usuario", JSON.stringify({ nombre: "Cliente Demo", rol: "cliente" })); 
      window.dispatchEvent(new Event("storage"));
      navigate("/");
    }

       else if (email === "superadmin@demo.com" && password === "12345") {
      
        localStorage.setItem("usuario", JSON.stringify({ nombre: "SuperAdministrador", rol: "superadmin" }));
        window.dispatchEvent(new Event("storage"));
        navigate("/homead");
    } 
    
    else  {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div className="login-admin">
      <div className="login-card">
        <h1>Inicio de Sesión</h1>
        <p className="login-desc">Accede para ver todo el contenido</p>

        <form onSubmit={handleSubmit}>
          {/* Grupo del correo */}
          <div className="form-group">
            <label>Correo Electrónico</label>
            <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            </div>
          </div>

          {/* Grupo de la contraseña */}
          <div className="form-group">
            <label>Contraseña</label>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ flex: 1 }}
              />

             {/* <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  padding: "0 10px",
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                  cursor: "pointer",
                  background: "#f0f0f0",
                }}
              >
                {showPassword ? "🙈" : "👀"}
              </button>*/}
            </div>
          </div>

          {/* Botón */}
          <button className="btn-login" type="submit">
            Iniciar Sesión
          </button>
        </form>

        <p className="login-desc" style={{ marginTop: "1.5rem" }}>
          ¿Aún no tienes cuenta?{" "}
          <Link to="/registro" style={{ color: " #21af0e", fontWeight: "bold" }}>
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}