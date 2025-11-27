import React, { useEffect, useState } from "react";
import "../Css/style.css";
import Usernav from "../layouts/usernav";
import { Link, useNavigate } from "react-router-dom";

import { db } from "../../config/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

function Paquetes() {
  const [paquetes, setPaquetes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerPaquetes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "paquetes"));
        const lista = querySnapshot.docs.map((d) => ({
          paquete_id: d.id,
          ...d.data(),
        }));

        setPaquetes(lista.filter((p) => p.activo === true));
      } catch (error) {
        console.error("Error al obtener paquetes:", error);
      }
    };
    obtenerPaquetes();
  }, []);

  const irAContratar = (paquete) => {
    navigate(`/contratar?paquete=${encodeURIComponent(paquete.nombre)}`);
  };

  return (
    <>
      <Usernav>
        <section className="paquetes-section">
          <div className="content-wrapper">
            <h2 className="section-title">Nuestros Paquetes de Internet</h2>

            <div className="paquetes-container">
              {paquetes.map((paquete) => (
                <div
                  key={paquete.paquete_id}
                  className="paquete-card paquete-hover"
                  onClick={() => irAContratar(paquete)}
                >
                  <h3 className="paquete-nombre">{paquete.nombre}</h3>

                  <p className="paquete-velocidad">⚡ {paquete.velocidad}</p>

                  <p className="paquete-descripcion">{paquete.descripcion}</p>

                  <p className="paquete-precio">${paquete.precio_mensual.toFixed(2)} MXN</p>

                  <p className="paquete-beneficios">✔ {paquete.beneficios}</p>

                  {paquete.promocion && (
                    <span className="paquete-promocion">
                      🎉 {paquete.promocion}
                    </span>
                  )}

                  <button className="btn-contratar">Contratar ahora</button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Usernav>
    </>
  );
}

export default Paquetes;
