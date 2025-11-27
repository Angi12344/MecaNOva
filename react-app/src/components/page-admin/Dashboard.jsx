// src/components/page-admin/Dashboard.jsx
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

// Firebase
import { db } from "../../config/firebaseConfig";
import {
  collection,
  onSnapshot,
  getDocs,
} from "firebase/firestore";

// Registrar componentes
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
  const [totalClientes, setTotalClientes] = useState(0);
  const [serviciosActivos, setServiciosActivos] = useState(0);
  const [ingresosMensuales, setIngresosMensuales] = useState(0);

  const [meses, setMeses] = useState([]);
  const [serviciosPorMes, setServiciosPorMes] = useState([]);
  const [ingresosPorMes, setIngresosPorMes] = useState([]);

  // Helper: últimos N meses
  function generarUltimosMeses(n = 6) {
    const res = [];
    const fecha = new Date();
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(fecha.getFullYear(), fecha.getMonth() - i, 1);
      res.push({
        label: d.toLocaleString("default", { month: "short", year: "numeric" }),
        year: d.getFullYear(),
        month: d.getMonth(),
      });
    }
    return res;
  }

  function keyYM(date) {
    const d = date.toDate ? date.toDate() : date;
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  }

  useEffect(() => {
    const mesesArr = generarUltimosMeses(6);
    setMeses(mesesArr.map((m) => m.label));

    // -----------------------
    // TOTAL CLIENTES
    // -----------------------
    const unsubUsuarios = onSnapshot(collection(db, "usuarios"), (snap) => {
      let docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      let clientes = docs.filter((u) => u.rol ? u.rol === "cliente" : true);
      setTotalClientes(clientes.length);
    });

    // -----------------------
    // CONTRATOS Y PAGOS
    // -----------------------
    const unsubContratos = onSnapshot(collection(db, "contratos"), async (snap) => {
      const contratos = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

      // Servicios activos
      setServiciosActivos(contratos.filter((c) => c.estado === "activo").length);

      // Cargar paquetes (para obtener precios si fuera necesario)
      const paquetesSnap = await getDocs(collection(db, "paquetes"));
      const paquetes = paquetesSnap.docs.map((p) => ({ id: p.id, ...p.data() }));

      const mapPaquetes = {};
      paquetes.forEach((p) => { if (p.nombre) mapPaquetes[p.nombre] = p; });

      // -----------------------
      // 1) INGRESOS MENSUALES REALES (solo pagos pagados)
      // -----------------------
      let totalIngresos = 0;

      contratos.forEach((c) => {
        (c.pagos || []).forEach((p) => {
          if (p.pagado === true) {
            totalIngresos += p.monto || 0;
          }
        });
      });

      setIngresosMensuales(totalIngresos);

      // -----------------------
      // 2) DATOS PARA GRÁFICAS POR MES
      // -----------------------
      const keys = mesesArr.map((m) => `${m.year}-${String(m.month + 1).padStart(2, "0")}`);

      const servCount = {};   // contratos activos activados ese mes
      const incomeCount = {}; // ingresos de pagos pagados ese mes

      keys.forEach((k) => {
        servCount[k] = 0;
        incomeCount[k] = 0;
      });

      contratos.forEach((c) => {
        // servicios activos por mes = fecha_activacion
        if (c.estado === "activo" && c.fecha_activacion) {
          const key = keyYM(c.fecha_activacion);
          if (servCount[key] !== undefined) servCount[key]++;
        }

        // ingresos por mes = pagos pagados en ese mes
        (c.pagos || []).forEach((p) => {
          if (p.pagado === true) {
            const key = keyYM(p.fecha_vencimiento);
            if (incomeCount[key] !== undefined) {
              incomeCount[key] += p.monto || 0;
            }
          }
        });
      });

      setServiciosPorMes(keys.map((k) => servCount[k]));
      setIngresosPorMes(keys.map((k) => incomeCount[k]));
    });

    return () => {
      unsubUsuarios();
      unsubContratos();
    };
  }, []);

  // Gráfica servicios
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

  // Gráfica ingresos
  const ingresosData = {
    labels: meses,
    datasets: [
      {
        label: "Ingresos ($)",
        data: ingresosPorMes,
        borderColor: "#f9c80e",
        backgroundColor: "rgba(249,200,14,0.3)",
        tension: 0.4,
        fill: true,
        borderWidth: 2,
      },
    ],
  };

  return (
    <Navbar>
      <section className="dashboard">
        <h1>Panel de Administración</h1>

        {/* Tarjetas */}
        <div className="dashboard-grid">
          <div className="card">
            <h2>Clientes</h2>
            <p className="value">{totalClientes}</p>
          </div>

          <div className="card">
            <h2>Servicios Activos</h2>
            <p className="value">{serviciosActivos}</p>
          </div>

          <div className="card">
            <h2>Ingresos Mensuales</h2>
            <p className="value">
              ${ingresosMensuales.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>

        {/* Gráficas */}
        <div className="charts-section">
          <div className="chart-card">
            <h3>Servicios Activos por Mes</h3>
            <Bar data={serviciosData} />
          </div>

          <div className="chart-card">
            <h3>Ingresos por Mes</h3>
            <Line data={ingresosData} />
          </div>
        </div>
      </section>
    </Navbar>
  );
}
