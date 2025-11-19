import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Css/noti.css";

export default function NotificationButton() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const notifications = [
    { id: 1, title: "Pago realizado por Cliente #3", link: "/historialPagos" },
    { id: 2, title: "Nuevo Ticket de soporte", link: "/reportes" },
    { id: 3, title: "Ticket #4 Finalizado", link: "/reportes" },
    { id: 4, title: "Ticket #4 En Proceso", link: "/reportes"},
  ];

  const handleClick = (link) => {
    setOpen(false);
    navigate(link);
  };

  return (
    <div className="notification-container">
      <div className="notification-icon" onClick={() => setOpen(!open)}>
        <span className="notification-count">{notifications.length}</span>
        🔔
      </div>

      {open && (
        <div className="notification-dropdown">
          {notifications.map((n) => (
            <div className="notification-item" key={n.id}>
              <span>{n.title}</span>
              <button className="btn-view" onClick={() => handleClick(n.link)}>
                Ver
              </button>
            </div>
          ))}

          {notifications.length === 0 && (
            <p className="no-notifications">No hay notificaciones</p>
          )}
        </div>
      )}
    </div>
  );
}
