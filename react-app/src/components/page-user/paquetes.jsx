import React, { useEffect, useState } from "react";
import "../Css/style.css";
import Usernav from "../layouts/usernav";
import { Link } from "react-router-dom";

function Paquetes() {
  // Estado para los paquetes
  const [paquetes, setPaquetes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulación temporal de carga (placeholder)
  /*useEffect(() => {
    // Aquí  pondrás la llamada a Firebase
    // Ejemplo:
    // import { collection, getDocs } from "firebase/firestore";
    // const querySnapshot = await getDocs(collection(db, "paquetes"));

    const paquetesFake = [ //borara despues de la conexion
      {
        paquete_id: 1,
        nombre: "Plan Básico",
        descripcion: "Ideal para navegación ligera y redes sociales.",
        velocidad: "50 Mbps",
        precio_mensual: 299.0,
        promocion: false,
        beneficios: "Wi-Fi gratis, soporte 24/7",
        activo: true,
        imagen: "/imagenes/plan-basico.jpg",
      },
      {
        paquete_id: 2,
        nombre: "Plan Avanzado",
        descripcion: "Perfecto para streaming y videollamadas.",
        velocidad: "150 Mbps",
        precio_mensual: 499.0,
        promocion: true,
        beneficios: "Instalación gratuita, router incluido",
        activo: true,
        imagen: "/imagenes/plan-avanzado.jpg",
      },
    ];

    setTimeout(() => {
      setPaquetes(paquetesFake);
      setLoading(false);
    }, 1000); // Simula un retardo de red
  }, []);*/

  // Renderizado condicional
  /*if (loading) {
    return <p>Cargando paquetes...</p>;
  }
*/
  return (
<>
 <Usernav>
    <section className="paquetes-section">
        <div className="content-wrapper">
      <h2 className="section-title">Nuestros Paquetes de Internet</h2>
      <p className="section-subtitle">
        Elige el plan que mejor se adapte a tus necesidades.
      </p>

      <div className="paquetes-container">
        {paquetes.map((paquete) => (
          <Link
            key={paquete.paquete_id}
            to={`/contratar/${encodeURIComponent(paquete.nombre)}`}
            className="paquete-card"
          >
            {paquete.imagen && (
              <img
                src={paquete.imagen}
                alt={paquete.nombre}
                className="paquete-imagen"
              />
            )}

            <h3 className="paquete-nombre">{paquete.nombre}</h3>
            <p className="paquete-velocidad">{paquete.velocidad}</p>
            <p className="paquete-descripcion">{paquete.descripcion}</p>

            <p className="paquete-precio">
              ${paquete.precio_mensual.toFixed(2)}
            </p>

            <p className="paquete-beneficios">{paquete.beneficios}</p>

            {paquete.promocion && (
              <span className="paquete-promocion">🎉 En promoción</span>
            )}
          </Link>
        ))}
      </div>
      </div>
    </section>
    </Usernav>
      </>
  );
}

export default Paquetes;