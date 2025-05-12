import React, { useState } from 'react';
import styles from './topbar.module.css';
import { FaBars, FaShoppingCart } from 'react-icons/fa';
import ModalCarrito from './modals/modalShop';
import ModalSignIn from './modals/ModalSignIn';

const Topbar = () => {
  const [showCart, setShowCart] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const toggleCart = () => {
    setShowCart(!showCart);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  return (
    <>
      <div className={styles.topbarContainer}>
        <div className={styles.topbarLeft}>
          {isAdmin && <FaBars />}
        </div>

        <div className={styles.topbarCenter}>
          <img
            src="/logo/LogoNikeBlanco.png"
            alt="Logo"
            className={styles.topbarLogo}
          />
        </div>

        <div className={styles.topbarRight}>
          <FaShoppingCart className={styles.topbarIcon} onClick={toggleCart} />

          {!isLoggedIn && (
            <>
              <button
                className={styles.topbarSignin}
                onClick={() => setShowSignIn(true)}
              >
                Sign in
              </button>
              <button className={styles.topbarRegister}>Register</button>
            </>
          )}

          {isLoggedIn && (
            <>
              {isAdmin && <span className={styles.adminBadge}>Modo Admin</span>}
              <button className={styles.topbarSignin} onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      <ModalCarrito show={showCart} onClose={toggleCart} />

      <ModalSignIn
        show={showSignIn}
        onClose={() => setShowSignIn(false)}
        onLogin={(isAdmin) => {
          setIsLoggedIn(true);
          setIsAdmin(isAdmin);
          setShowSignIn(false);
        }}
      />
    </>
  );
};

export default Topbar;
