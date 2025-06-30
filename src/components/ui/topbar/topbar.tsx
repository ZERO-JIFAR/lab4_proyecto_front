// src/components/Topbar.tsx
import { useEffect, useState } from 'react';
import styles from './topbar.module.css';
import { FaBars, FaShoppingCart } from 'react-icons/fa';
import ModalCarrito from './modals/modalShop';
import ModalSignIn from './modals/ModalSignIn';
import RegisterModal from './modals/modalRegister';
import AdminMenu from './modals/adminMenu';
import { AiOutlineSun, AiFillMoon } from "react-icons/ai";
import ModalLogout from './modals/modalLogout';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const Topbar: React.FC = () => {
  const [showCart, setShowCart] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { isLoggedIn, isAdmin, logout, login } = useAuth();
  

  const toggleCart = () => {
    setShowCart(!showCart);
  };

  const toggleAdminMenu = () => {
    setShowAdminMenu(!showAdminMenu);
  };

  const toggleSignInModal = () => {
    setShowSignIn(!showSignIn);  // Cambiar el estado para abrir o cerrar el modal
  };

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedMode);
  }, []);

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "light";
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  return (
    <>
      <div className={styles.topbarContainer}>
        <div className={styles.topbarLeft}>
          {isAdmin && (
            <FaBars
              className={styles.adminIcon}
              onClick={toggleAdminMenu}
              style={{ cursor: 'pointer' }}
            />
          )}
          <button className={styles.topbarIcon}  onClick={() => setDarkMode((prev) => !prev)}>
            {darkMode ? <AiOutlineSun /> : <AiFillMoon />}
          </button>
        </div>

        <div className={styles.topbarCenter}>
          <Link to="/">
            <img
              src="/logo/lala.png"
              alt="Logo"
              className={styles.topbarLogo}
              style={{ cursor: 'pointer' }}
            />
          </Link>
        </div>

        <div className={styles.topbarRight}>
        <FaShoppingCart className={styles.topbarIcon} onClick={toggleCart} />

        {!isLoggedIn && (
          <>
            <button
              className={styles.topbarSignin}
              onClick={toggleSignInModal}
            >
              Sign in
            </button>
            <button
              className={styles.topbarRegister}
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
          </>
        )}

        {isLoggedIn && (
          <>
            {isAdmin && <span className={styles.topbarAdmin}>Modo Admin</span>}
            <button className={styles.topbarSignin} onClick={() => setShowLogoutConfirm(true)}>
              Logout
            </button>
          </>
        )}
      </div>
      </div>

      {/* Modal del Logout */}
      <ModalLogout
        show={showLogoutConfirm}
        onConfirm={() => {
          logout(); // <--- Usa la función global de logout
          setShowAdminMenu(false);
          setShowLogoutConfirm(false);
        }}
        onCancel={() => setShowLogoutConfirm(false)}
      />

      {/* Admin dropdown menu */}
      <AdminMenu visible={showAdminMenu} />

      {/* Modals */}
      <ModalCarrito show={showCart} onClose={toggleCart} />
      <ModalSignIn
        show={showSignIn}
        onClose={() => setShowSignIn(false)}
        onLogin={(role: string, token: string) => {
          login(role, token);
          setShowSignIn(false);
        }}
      />
      <RegisterModal
        show={showRegister}
        onClose={() => setShowRegister(false)}
      />
    </>
  );
};

export default Topbar;
