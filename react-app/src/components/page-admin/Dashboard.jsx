import React, { useEffect, useState } from "react";
import "../Css/stylead.css";
import Navbar from "../layouts/adminnav";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  // 🔹 Estados principales
  const [totalClientes, setTotalClientes] = useState(0);
  const [serviciosActivos, setServiciosActivos] = useState(0);
  const [ingresosMensuales, setIngresosMensuales] = useState(0);
  const [ticketsAbiertos, setTicketsAbiertos] = useState(0);

  // 🔹 Datos de las gráficas
  const [meses, setMeses] = useState([]);
  const [serviciosPorMes, setServiciosPorMes] = useState([]);
  const [ingresosPorMes, setIngresosPorMes] = useState([]);

  // 🔹 Cargar datos desde backend
  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setTotalClientes(data.totalClientes);
        setServiciosActivos(data.serviciosActivos);
        setIngresosMensuales(data.ingresosMensuales);
        setTicketsAbiertos(data.ticketsAbiertos);
        setMeses(data.meses);
        setServiciosPorMes(data.serviciosPorMes);
        setIngresosPorMes(data.ingresosPorMes);
      })
      .catch((err) => console.error("Error al cargar el dashboard:", err));
  }, []);

  // 🔹 Configuración de la gráfica de servicios
  const serviciosData = {
    labels: meses,
    datasets: [
      {
        label: "Servicios Activos",
        data: serviciosPorMes,
        backgroundColor: "#088395",
        borderRadius: 8,
      },
    ],
  };

  const serviciosOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } },
  };

  // 🔹 Configuración de la gráfica de ingresos
  const ingresosData = {
    labels: meses,
    datasets: [
      {
        label: "Ingresos ($)",
        data: ingresosPorMes,
        borderColor: "#f9c80e",
        backgroundColor: "rgba(249, 200, 14, 0.3)",
        tension: 0.4,
        fill: true,
        borderWidth: 2,
      },
    ],
  };

  const ingresosOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: false } },
  };

  return (
    <>
     <Navbar>
      <section className="dashboard">
        <h1>Panel de Administración</h1>
        <p className="dashboard-desc">
          Visualiza los indicadores clave del sistema y el estado general de los
          servicios.
        </p>

        {/* Tarjetas resumen */}
        <div className="dashboard-grid">
          <div className="card">
            <h2>Clientes</h2>
            <p className="value">{totalClientes}</p>
            <span className="desc">Clientes registrados</span>
          </div>

          <div className="card">
            <h2>Servicios Activos</h2>
            <p className="value">{serviciosActivos}</p>
            <span className="desc">Conectados actualmente</span>
          </div>

          <div className="card">
            <h2>Ingresos Mensuales</h2>
            <p className="value">
              $
              {ingresosMensuales.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <span className="desc">Último período registrado</span>
          </div>
        </div>

        <div className="dashboard-grid-tickets">
          <div className="card-tickets">
            <h2>Tickets Abiertos</h2>
            <p className="value">{ticketsAbiertos}</p>
            <span className="desc">En espera de resolución</span>
          </div>
          <div className="card-tickets">
            <h2>Tickets en Proceso</h2>
            <p className="value">{ticketsAbiertos}</p>
            <span className="desc">En proceso de resolución</span>
          </div>
          <div className="card-tickets">
            <h2>Tickets Cerrados</h2>
            <p className="value">{ticketsAbiertos}</p>
            <span className="desc">Ya Resueltos</span>
          </div>
        </div>

        {/* Sección de gráficas */}
        <div className="charts-section">
          <div className="chart-card">
            <h3>Servicios Activos por Mes</h3>
            <Bar data={serviciosData} options={serviciosOptions} />
          </div>

          <div className="chart-card">
            <h3>Ingresos por Mes</h3>
            <Line data={ingresosData} options={ingresosOptions} />
          </div>
        </div>
      </section>
      </Navbar>
    </>
  );
}