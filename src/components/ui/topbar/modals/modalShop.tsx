import React from 'react';
import styles from './modalShop.module.css';
import { useCart } from "../../../../context/CartContext";
import { FaArrowRight } from "react-icons/fa";

interface ModalCarritoProps {
  show: boolean;
  onClose: () => void;
}

const ModalCarrito: React.FC<ModalCarritoProps> = ({ show, onClose }) => {
  const { cart } = useCart();
  if (!show) return null; // Solo renderiza si show es true

  return (
    <div className={`${styles.cartSidebar} ${show ? styles.open : ''}`}>
      <div className={styles.cartHeader}>
        <h2>Mi Carrito</h2>
        <button className={styles.cartClose} onClick={onClose}>
          <FaArrowRight />
        </button>
      </div>

      <div className={styles.cartContent}>
        {cart.length === 0 ? (
          <p className={styles.cartEmpty}>No hay artículos en el carrito...</p>
        ) : (
          cart.map((item, index) => (
            <div key={index} className={styles.cartItem}>
              <img
                src={item.image}
                alt={item.title}
                className={styles.cartItemImage}
              />
              <div className={styles.cartItemDetails}>
                <p className={styles.cartItemTitle}>{item.title}</p>
                <p className={styles.cartItemOptions}>
                  Color: {item.color} | Talle: {item.size}
                </p>
                <p className={styles.cartItemPrice}>${item.price}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {cart.length > 0 && (
        <button className={styles.cartCheckout}>Comprar</button>
      )}
    </div>
  );
};

export default ModalCarrito;
