import React from 'react';
import styles from './topbar.module.css';
import { FaBars, FaShoppingCart } from 'react-icons/fa';

const Topbar = () => {
  return (
    <div className={styles.topbarContainer}>
      <div className={styles.topbarLeft}>
        <FaBars />
      </div>

      <div className={styles.topbarCenter}>
        <img
          src="/logo.png" // tener este logo en public/logo.png o ajustá la ruta
          alt="Logo"
          className={styles.topbarLogo}
        />
      </div>

      <div className={styles.topbarRight}>
        <FaShoppingCart className={styles.topbarIcon} />
        <button className={styles.topbarSignin}>Sign in</button>
        <button className={styles.topbarRegister}>Register</button>
      </div>
    </div>
  );
};

export default Topbar;
