import React from 'react';
import styles from './topbar.module.css';
import { FaBars, FaShoppingCart } from 'react-icons/fa';

const Topbar = () => {
  return (
    <div className={styles.topbar}>
      <div className={styles.left}>
        <FaBars />
      </div>

      <div className={styles.center}>
        <img
          src="/logo.png" // tener este logo en public/logo.png o ajustá la ruta
          alt="Logo"
          className={styles.logo}
        />
      </div>

      <div className={styles.right}>
        <FaShoppingCart className={styles.icon} />
        <button className={styles.signin}>Sign in</button>
        <button className={styles.register}>Register</button>
      </div>
    </div>
  );
};

export default Topbar;
