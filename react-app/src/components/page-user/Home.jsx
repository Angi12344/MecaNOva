import React from "react";
import "../Css/style.css";
import Usernav from "../layouts/usernav";
import { Link } from "react-router-dom";


function Home() {
  return (
    <>
        <Usernav>
      {/* Header */}
      <header className="hero">
        <div className="hero-content">
          <h1>El hogar para las necesidades de tu conexión</h1>
          <p>
            Conect@T es una empresa líder en servicios de internet, dedicada a
            proporcionar soluciones rápidas, confiables y accesibles para hogares
            y negocios. Si deseas crear una nueva conexión o mejorar la existente,
            ¡te ayudamos!
          </p>
        </div>
        <div className="hero-image">
          <img src="/resource/imagenes/internet.jpg" alt="Internet Service" />
        </div>
      </header>

      {/* Sección de Paquetes */}
      <section id="paquetes" className="section">
        <h2>Nuestros Servicios - Paquetes de Internet</h2>
        <p>
          Descubre nuestros planes personalizados para adaptarse a tus necesidades
          de conexión
        </p>
        <Link to="/paquetes" className="app-btn">   {/*  No olvidar camiar ruta en el href */}
          Ver Paquetes
        </Link>

        <h2>Descarga Nuestra App Móvil</h2>
        <p>
          Si ya cuentas con un servicio Conect@T, descarga nuestra app para gestionar
          tus servicios y revisar fechas de pago.
        </p>
        <a href="#download" className="app-btn"> {/*  No olvidar camiar ruta en el href */}
          Descargar App
        </a>
      </section>
        </Usernav>
    </>
  );
}

export default Home;

//hola lol, hola clay, este es un mensaje de ayuda piruja el que lo lea 