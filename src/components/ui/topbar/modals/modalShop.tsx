import React from 'react';
import styles from './modalShop.module.css';

interface ModalCarritoProps {
  show: boolean;
  onClose: () => void;
}

const ModalCarrito: React.FC<ModalCarritoProps> = ({ show, onClose }) => {
  if (!show) return null; // Solo renderiza si show es true

  return (
    <div className={`${styles.cartSidebar} ${show ? styles.open : ''}`}>
      <div className={styles.cartHeader}>
        <h2>Mi Carrito</h2>
        <button className={styles.cartClose} onClick={onClose}>→</button>
      </div>
      <p className={styles.cartEmpty}>No hay artículos en el carrito...</p>
      <button className={styles.cartCheckout}>Comprar</button>
    </div>
  );
};

export default ModalCarrito;
