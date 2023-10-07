import 'bootstrap/dist/css/bootstrap.min.css';
import logo from "./../imagenes/logo.jpg";
import './../index.css';
import { Link } from 'react-router-dom';


const Header  = ({ isAuthenticated, handleLogout }) => {
  return (
    <header>
        <nav className="navbar navbar-expand-lg" id="nav">
          <div className="container-md">
            <a className="navbar-brand" href="/"><img src={logo} alt="Logo" width="110" height="110"></img></a>
            <div className="ml-auto">
              <Link to={`/`} className='enlace_tierlist'>
                Inicio
              </Link>
              <Link to={`/tierlist`} className='enlace_tierlist' id='tierlistoc'>
                Armá tu propia Tierlist!
              </Link>
              {isAuthenticated ? (
            <>
              <Link to={`/favoritas`} className='enlace_tierlist'>
                Mis Favoritas
              </Link>
              <Link to={`/`} className='enlace_tierlist' onClick={handleLogout}>
                Cerrar Sesión
              </Link>
            </>
          ) : (
            <>
              <Link to={`/crearcuenta`} className='enlace_tierlist'>
                Crear Cuenta
              </Link>
              <Link to={`/sesion`} className='enlace_tierlist'>
                Iniciar Sesión
              </Link>
            </>
          )}
            </div>
          </div>
        </nav>
      </header>
  );
};

export default Header;   