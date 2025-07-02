import { useEffect, useState } from 'react';
import styles from './topbar.module.css';
import { FaBars, FaShoppingCart, FaHistory } from 'react-icons/fa';
import ModalCarrito from './modals/modalShop';
import ModalSignIn from './modals/ModalSignIn';
import RegisterModal from './modals/modalRegister';
import AdminMenu from './modals/adminMenu';
import { AiOutlineSun, AiFillMoon } from "react-icons/ai";
import ModalLogout from './modals/modalLogout';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import OrderHistoryModal from './modals/ordenHistoryModal';

const Topbar: React.FC = () => {
  const [showCart, setShowCart] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { isLoggedIn, isAdmin, logout, login } = useAuth();

  const toggleCart = () => setShowCart(!showCart);
  const toggleAdminMenu = () => setShowAdminMenu(!showAdminMenu);
  const toggleSignInModal = () => setShowSignIn(!showSignIn);

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
      <div className={styles.topbarContainerUnico}>
        <div className={styles.topbarLeftUnico}>
          {isAdmin && (
            <FaBars
              className={styles.topbarAdminIconUnico}
              onClick={toggleAdminMenu}
              title="Menú Admin"
            />
          )}
          <button className={styles.topbarIconUnico} onClick={() => setDarkMode((prev) => !prev)}>
            {darkMode ? <AiOutlineSun /> : <AiFillMoon />}
          </button>
        </div>

        <div className={styles.topbarCenterUnico}>
          <Link to="/">
            <img
              src="/logo/lala.png"
              alt="Logo"
              className={styles.topbarLogoUnico}
              style={{ cursor: 'pointer' }}
            />
          </Link>
        </div>

        <div className={styles.topbarRightUnico}>
          <FaShoppingCart className={styles.topbarIconUnico} onClick={toggleCart} title="Carrito" />
          {isLoggedIn && (
            <FaHistory
              className={styles.topbarIconUnico}
              title="Historial de compras"
              onClick={() => setShowOrderHistory(true)}
            />
          )}

          {!isLoggedIn && (
            <>
              <button
                className={styles.topbarSigninUnico}
                onClick={toggleSignInModal}
              >
                Sign in
              </button>
              <button
                className={styles.topbarRegisterUnico}
                onClick={() => setShowRegister(true)}
              >
                Register
              </button>
            </>
          )}

          {isLoggedIn && (
            <>
              {isAdmin && <span className={styles.topbarAdminTextUnico}>Modo Admin</span>}
              <button className={styles.topbarSigninUnico} onClick={() => setShowLogoutConfirm(true)}>
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
          logout();
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
        onLogin={(role: string, token: string, user: { id: number, email: string, rol: string }) => {
          login(role, token, user);
          setShowSignIn(false);
        }}
      />
      <RegisterModal
        show={showRegister}
        onClose={() => setShowRegister(false)}
      />
      <OrderHistoryModal
        show={showOrderHistory}
        onClose={() => setShowOrderHistory(false)}
      />
    </>
  );
};

export default Topbar;