import React from 'react';
import Topbar from '../../ui/topbar/topbar';
import Footer from '../../ui/footer/footer';
import styles from './landing.module.css';

const Landing = () => {
  return (
    <div className={styles.landingContainer}>
      <Topbar />

      <div className={styles.landingMain}>
        <h1 className={styles.landingTitle}><strong>Nike</strong></h1>
        <p className={styles.landingSubtitle}>Just do it!</p>

        <hr className={styles.landingDivider} />

        <div className={styles.landingSectionTitle}>
          Productos Destacados
        </div>

        <div className={styles.landingProducts}>
          <img src="/images/zapatillas/Zapatillas1.webp" alt="Zapatilla 1" className={styles.landingProductImage} />
          <img src="/images/zapatilla2.png" alt="Zapatilla 2" className={styles.landingProductImage} />
          <img src="/images/zapatilla3.png" alt="Zapatilla 3" className={styles.landingProductImage} />
          <img src="/images/zapatilla4.png" alt="Zapatilla 4" className={styles.landingProductImage} />
        </div>

        <div className={styles.landingButtonWrapper}>
          <button className={styles.landingBuyButton}>
            ¡Compre Ahora!
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Landing;
