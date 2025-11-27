import React from "react"
import "../Css/style.css"

import { Link, useNavigate } from "react-router-dom";

function Usernav({children}){

    const navigate = useNavigate();

    const [usuario, setUsuario] = React.useState(
        JSON.parse(localStorage.getItem("usuario")) || null
    );

    const handleLogout = () => {
        localStorage.removeItem("usuario");
        setUsuario(null);
        navigate("/");
    };

    React.useEffect(() => {
    const actualizarUsuario = () => {
        const data = JSON.parse(localStorage.getItem("usuario"));
        setUsuario(data);
    };

    window.addEventListener("storage", actualizarUsuario);

    return () => {
        window.removeEventListener("storage", actualizarUsuario);
    };
}, []);

    const esAdmin = usuario?.rol === "admin";
    return(
        <div className="page-container">
        <nav className="navbar">
            <div className="logo">
                <Link to="/">
                <img src="/resource/imagenes/logomeca1.png" alt="Conect@T logo" />
                </Link>
            </div>
            <ul className="nav-links">
                    <li><Link to="/paquetes">Paquetes</Link></li>
                    <li><Link to="/contratar">Contratar</Link></li> {/*to="/contratar/Plan%20Básico"*/}
                    <li><Link to="/ayuda">Ayuda</Link></li>
                    <li><Link to="/tiket">Historial</Link></li>

                    
                    {esAdmin && (
                    <li>
                        <Link to="/homead" className="admin-btn">
                            Admin Panel
                        </Link>
                    </li>
                )}

                    <li>
                    {usuario ? (
                        <>
                            <span className="nav-user">👤 {usuario.nombre}</span>
                            <button className="logout-btn" onClick={handleLogout}>
                                Cerrar sesión
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="login-btn">
                            Iniciar sesión
                        </Link>
                    )}
                </li>              
            </ul>
        </nav>

              {/* Contenido principal */}
      <main>
        {children}
      </main>
        
                        <footer className="footer">
            <div className="contact-info">
                <p><strong>Contacto:</strong></p>
                <p>Email: soporte@conectat.com</p>
                <p>Teléfono: +52 55 1234 5678 </p>
                <p>Dirección: Av. Conexión 123, Merida</p>
            </div>

        </footer>
        </div>
    );
}
export default Usernav