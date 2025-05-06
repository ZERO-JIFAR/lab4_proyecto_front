import React from 'react';
import styles from './footer.module.css';
import { FaXTwitter, FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa6';
import { SiFigma } from 'react-icons/si';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.column}>
          <div className={styles.socialIcons}>
            <FaXTwitter />
            <FaInstagram />
            <FaYoutube />
            <FaLinkedin />
          </div>
        </div>
        <div className={styles.column}>
          <h4>AYUDA</h4>
          <ul>
            <li>Envíos</li>
            <li>Devoluciones</li>
            <li>Cambios</li>
            <li>Contacto</li>
          </ul>
        </div>
        <div className={styles.column}>
          <h4>ACERCA DE</h4>
          <ul>
            <li>¿Quienes somos?</li>
            <li>Noticias</li>

          </ul>
        </div>
        <div className={styles.column}>
          <h4>Novedades</h4>
          <ul>
            <li>Promociones</li>
            <li>Encontrá tu calzado</li>
            <li>Tips</li>
            <li>Salud</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
