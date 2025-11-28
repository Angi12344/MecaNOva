import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route } from "react-router-dom";
import Home from "./components/page-user/Home";
import Paquetes from './components/page-user/paquetes';
import Contratacion from './components/page-user/contratar';
import Ayuda from './components/page-user/ayuda';
import ReportesUsuario from './components/page-user/Tikets';
import EnvioEmail from './components/page-user/enviarcorreo';

//rutas del admin web
import Login from './components/login/login';
import Homead from './components/page-admin/HomeAdmin';
import Cliente from './components/page-admin/clientes';
import Admin from './components/page-admin/Admin';
import Paquetesad from './components/page-admin/Paquetes';
import Dashboard from './components/page-admin/Dashboard';
import ReportesAdmin from './components/page-admin/tikets';
import Register from './components/login/registro';
import HistorialPagos from './components/page-admin/Historialdepagos';

function App() {
  const [count, setCount] = useState(0)

 return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/paquetes" element={<Paquetes/>}/>
       <Route path="/contratar" element={<Contratacion/>}/>
       <Route path="/ayuda" element={<Ayuda/>}/>
      <Route path="/tiket" element={<ReportesUsuario/>}/>
      <Route path="/envemail" element={<EnvioEmail/>}/>
      {/*rutas admin*/}
       <Route path="/login" element={<Login />} />
        <Route path="/homead" element={<Homead />} />
        <Route path="/cliente" element={<Cliente />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/paquetesad" element={<Paquetesad />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reportes" element={<ReportesAdmin />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/historialPagos" element={<HistorialPagos />} />

    </Routes>
  );
}

export default App
