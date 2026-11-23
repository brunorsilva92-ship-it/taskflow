import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './Sidebar.module.css';

function Sidebar() {
  const { logado, usuario, logout } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    isActive ? styles.link + ' ' + styles.ativo : styles.link;

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <h1>TaskFlow</h1>
      </div>

      <nav className={styles.nav}>
        {logado && <NavLink to='/' className={linkClass}>Dashboard</NavLink>}
        <NavLink to='/sobre' className={linkClass}>Sobre</NavLink>
        {!logado && <NavLink to='/login' className={linkClass}>Login</NavLink>}
      </nav>

      {logado && (
        <div className={styles.sidebarUsuario}>
          <span>Olá, {usuario?.nome ?? 'Usuário'}</span>
          <button onClick={handleLogout} className={styles.logout}>
            Sair
          </button>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;