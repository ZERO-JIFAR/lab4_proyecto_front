import React, { useState } from 'react';
import styles from './topbar.module.css';
import { FaBars, FaShoppingCart } from 'react-icons/fa';
import ModalCarrito from './modals/modalShop';

const Topbar = () => {
  const [showCart, setShowCart] = useState(false);

  const toggleCart = () => {
    setShowCart(!showCart);
  };

  return (
    <>
      <div className={styles.topbarContainer}>
        <div className={styles.topbarLeft}>
          <FaBars />
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
          <button className={styles.topbarSignin}>Sign in</button>
          <button className={styles.topbarRegister}>Register</button>
        </div>
      </div>

      <ModalCarrito show={showCart} onClose={toggleCart} />
    </>
  );
};

export default Topbar;
