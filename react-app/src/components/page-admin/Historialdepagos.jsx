import React from "react";
import Navbar from "../layouts/adminnav";
import "../Css/stylead.css";

export default function HistorialPagos() {
  return (
    <>
      <Navbar>
      <section className="clientes">
        <h1>Historial de Pagos</h1>
        <p className="clientes-desc">
          Administra la información de los pagos registrados en el sistema.
          Desde aquí podrás administrar los pagos recibidos.
        </p>

        <table className="clientes-table">
          <thead>
            <tr>
              <th>ID Pago</th>
              <th>Contrato</th>
              <th>Forma de pago</th>
              <th>Fecha de vencimiento</th>
              <th>Fecha de pago</th>
              <th>Monto</th>
              <th>Estado</th>
              <th>Referencia de pago</th>
              <th>Comprobante</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="11" style={{ textAlign: "center" }}>
                No hay pagos registrados.
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      </Navbar>
    </>
  );
}