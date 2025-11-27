import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Css/noti.css";

import { db } from "../../config/firebaseConfig";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  doc,
} from "firebase/firestore";

export default function NotificationButton() {
  const [open, setOpen] = useState(false);
  const [notificaciones, setNotificaciones] = useState([]);
  const navigate = useNavigate();

  // 🔥 Cargar notificaciones en tiempo real
  useEffect(() => {
    const q = query(
      collection(db, "notificaciones"),
      orderBy("fecha", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const lista = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setNotificaciones(lista);
    });

    return () => unsub();
  }, []);

  // 🔥 Marcar como leída + navegar
  const handleClick = async (id, link) => {
    await updateDoc(doc(db, "notificaciones", id), { leido: true });
    setOpen(false);
    navigate(link);
  };

  return (
    <div className="notification-container">
      <div className="notification-icon" onClick={() => setOpen(!open)}>
        {notificaciones.filter((n) => !n.leido).length > 0 && (
          <span className="notification-count">
            {notificaciones.filter((n) => !n.leido).length}
          </span>
        )}
        🔔
      </div>

      {open && (
        <div className="notification-dropdown">
          {notificaciones.length > 0 ? (
            notificaciones.map((n) => (
              <div
                key={n.id}
                className={`notification-item ${
                  n.leido ? "leido" : "no-leido"
                }`}
              >
                <div>
                  <strong>{n.titulo}</strong>
                  <p>{n.descripcion}</p>
                </div>

                <button
                  className="btn-view"
                  onClick={() => handleClick(n.id, n.link)}
                >
                  Ver
                </button>
              </div>
            ))
          ) : (
            <p className="no-notifications">No hay notificaciones</p>
          )}
        </div>
      )}
    </div>
  );
}
