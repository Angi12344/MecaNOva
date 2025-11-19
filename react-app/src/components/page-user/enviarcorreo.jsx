import React from "react";
import "../Css/style.css";
import { Link } from "react-router-dom";
import Usernav from "../layouts/usernav";

function EnvioEmail() {
    const handleReenviarCorreo = () => {
    alert("Simulando reenvío de correo... Por favor, revisa tu bandeja.");
    // 🔜 Aquí iría la lógica real para reenviar el correo (por ejemplo, una llamada a Firebase o un servicio de backend)
  };
  return (
    <>
    <Usernav>
      <header className="hero">
        <div className="hero-content">
          <h1>Correo Enviado</h1>
          <p>
            Te hemos enviado un correo electrónico con la información solicitada.
            Por favor, revisa tu bandeja de entrada (y la carpeta de spam si no lo ves).
            ¡Gracias por elegir <strong>Conect@T</strong>!
          </p>
        </div>
        <div className="hero-image">
          <img src="/imagenes/internet.jpg" alt="Correo Enviado" />
        </div>
      </header>

      <section className="section">
        <h2>¿Qué hacer ahora?</h2>
        <p>
          Si no recibes el correo en los próximos minutos, verifica tu dirección
          de correo o contáctanos en{" "}
          <a href="">soporte@conectat.com</a>.
        </p>
        <button 
              onClick={handleReenviarCorreo} 
              className="app-btn" // Reutiliza la clase para el estilo
              style={{ marginRight: '15px' }} // Espacio entre botones
            >
              Reenviar Correo
            </button>

        <Link to="/" className="app-btn">
          Volver al inicio
        </Link>
      </section>
      </Usernav>
    </>
  );
}

export default EnvioEmail;