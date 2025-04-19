import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Inicio</Link>
        </li>
        <li>
          <Link to="/furniture">Muebles</Link>
        </li>
        {isAuthenticated ? (
          <>
            <li>
              <Link to="/cart">Carrito</Link>
            </li>
            <li>
              <Link to="/profile">Perfil</Link>
            </li>
            <li>
              <button onClick={handleLogout}>Cerrar Sesión</button>
            </li>
            {user && <span>Bienvenido, {user.username}</span>}
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Iniciar Sesión</Link>
            </li>
            <li>
              <Link to="/register">Registrarse</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;