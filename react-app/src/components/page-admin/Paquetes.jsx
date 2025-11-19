import React, { useState } from "react";
import "../Css/stylead.css";
import Navbar from "../layouts/adminnav";

export default function Paquetesad() {
  const [paquetes, setPaquetesad] = useState([
    {
      id: 1,
      nombre: "Básico",
      velocidad: "20 Mbps",
      descripcion: "Ideal para navegación ligera y redes sociales.",
      precio: 199.99,
      duracion_contrato: "12 meses",
      promocion: "Primer mes gratis",
      beneficios: "Soporte 24/7, sin instalación",
      activo: true,
    },
  ]);

  const [nuevoPaquete, setNuevoPaquete] = useState({
    nombre: "",
    velocidad: "",
    descripcion: "",
    precio: "",
    promocion: "",
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [paqueteEdit, setPaqueteEdit] = useState(null);

  // === Manejar cambio en inputs ===
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoPaquete({ ...nuevoPaquete, [name]: value });
  };

  // === Agregar nuevo paquete ===
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nuevoPaquete.nombre || !nuevoPaquete.precio)
      return alert("Campos requeridos.");

    const nuevo = {
      ...nuevoPaquete,
      id: paquetes.length + 1,
      activo: true,
      duracion_contrato: "12 meses",
      beneficios: "Soporte 24/7",
    };

    setPaquetesad([...paquetes, nuevo]);
    setNuevoPaquete({
      nombre: "",
      velocidad: "",
      descripcion: "",
      precio: "",
      promocion: "",
    });
    alert("Paquete agregado con éxito ✅");
  };

  // === Eliminar paquete ===
  const handleDelete = (id) => {
    if (window.confirm("¿Eliminar este paquete?")) {
      setPaquetesad(paquetes.filter((p) => p.id !== id));
    }
  };

  // === Abrir modal edición ===
  const openModal = (p) => {
    setPaqueteEdit(p);
    setModalVisible(true);
  };

  // === Guardar cambios del modal ===
  const handleEditSave = (e) => {
    e.preventDefault();
    setPaquetesad(
      paquetes.map((p) => (p.id === paqueteEdit.id ? paqueteEdit : p))
    );
    setModalVisible(false);
    alert("Cambios guardados ✅");
  };

  return (
    <>
      <Navbar>
      <div className="clientes">
        <h1>Gestión de Paquetes</h1>
        <p className="clientes-desc">
          Desde esta sección los administradores pueden actualizar los paquetes,
          precios, promociones y descripciones sin modificar el código fuente.
        </p>

        {/* FORMULARIO NUEVO */}
        <form onSubmit={handleSubmit} className="formulario">
          <h1>Agregar nuevo paquete</h1>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre del paquete"
            value={nuevoPaquete.nombre}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="velocidad"
            placeholder="Velocidad"
            value={nuevoPaquete.velocidad}
            onChange={handleChange}
            required
          />
          <textarea
          type="texttarea"
            name="descripcion"
            placeholder="Descripción"
            value={nuevoPaquete.descripcion}
            onChange={handleChange}
          ></textarea>
          <input
            type="number"
            step="0.01"
            name="precio"
            placeholder="Precio"
            value={nuevoPaquete.precio}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="promocion"
            placeholder="Promoción (opcional)"
            value={nuevoPaquete.promocion}
            onChange={handleChange}
          />
          <button type="submit" className="btn-primary">
            Agregar paquete
          </button>
        </form>

        {/* TABLA */}
        <h1>Lista de paquetes</h1>
        <table className="clientes-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Velocidad</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Duración</th>
              <th>Promoción</th>
              <th>Beneficios</th>
              <th>Activo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paquetes.length > 0 ? (
              paquetes.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.nombre}</td>
                  <td>{p.velocidad}</td>
                  <td>{p.descripcion}</td>
                  <td>${p.precio.toFixed(2)}</td>
                  <td>{p.duracion_contrato}</td>
                  <td>{p.promocion || "N/A"}</td>
                  <td>{p.beneficios}</td>
                  <td>{p.activo ? "Sí" : "No"}</td>
                  <td>
                    <button className="btn-edit" onClick={() => openModal(p)}>
                      Editar
                    </button>
                    <button
                      className="btn-danger"
                      onClick={() => handleDelete(p.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" style={{ textAlign: "center" }}>
                  No hay paquetes registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* MODAL DE EDICIÓN */}
        {modalVisible && (
          <div
            className="modal"
            onClick={(e) =>
              e.target.className === "modal" && setModalVisible(false)
            }
          >
            <div className="modal-content">
              <span className="close" onClick={() => setModalVisible(false)}>
                &times;
              </span>
              <h2>Editar paquete</h2>
              <form onSubmit={handleEditSave}>
                <input
                  type="text"
                  name="nombre"
                  value={paqueteEdit.nombre}
                  onChange={(e) =>
                    setPaqueteEdit({ ...paqueteEdit, nombre: e.target.value })
                  }
                  required
                />
                <textarea
                  name="descripcion"
                  value={paqueteEdit.descripcion}
                  onChange={(e) =>
                    setPaqueteEdit({
                      ...paqueteEdit,
                      descripcion: e.target.value,
                    })
                  }
                ></textarea>
                <input
                  type="number"
                  step="0.01"
                  name="precio"
                  value={paqueteEdit.precio}
                  onChange={(e) =>
                    setPaqueteEdit({ ...paqueteEdit, precio: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  name="promocion"
                  value={paqueteEdit.promocion}
                  onChange={(e) =>
                    setPaqueteEdit({
                      ...paqueteEdit,
                      promocion: e.target.value,
                    })
                  }
                />
                <button type="submit" className="btn-primary">
                  Guardar cambios
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
      </Navbar>
    </>
  );
}
