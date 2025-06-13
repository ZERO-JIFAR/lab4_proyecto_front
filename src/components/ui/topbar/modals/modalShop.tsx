import React, { useState } from 'react';
import styles from './modalShop.module.css';
import { useCart } from "../../../../context/CartContext";
import { useAuth } from "../../../../context/AuthContext";
import { FaArrowRight } from "react-icons/fa";
import PayDataModal from '../../PayDataModal/payDataModal';
import axios from 'axios';

interface ModalCarritoProps {
  show: boolean;
  onClose: () => void;
}

const ModalCarrito: React.FC<ModalCarritoProps> = ({ show, onClose }) => {
  const { cart, removeFromCart, clearCart } = useCart();
  const { isLoggedIn } = useAuth();
  const [showPayModal, setShowPayModal] = useState(false);

  // Maneja el pago con Mercado Pago
  const handlePay = async (
    email: string,
    nombre: string,
    direccion: string,
    ciudad: string,
    tarjeta: string,
    vencimiento: string,
    cvv: string
  ) => {
    try {
      // 1. Crear la orden en tu backend
      const ordenRes = await axios.post('/api/ordenes', {
        items: cart,
        email,
        nombre,
        direccion,
        ciudad,
        tarjeta,
        vencimiento,
        cvv
      });
      const ordenId = ordenRes.data.id;

      // 2. Llamar a tu endpoint de Mercado Pago para obtener la preferencia
      const mpRes = await axios.post('/pay/mp', { id: [ordenId] });
      window.location.href = mpRes.data.urlMP; // Redirige a Mercado Pago
      clearCart(); // Limpia el carrito localmente
    } catch (err) {
      alert('Error al iniciar el pago');
    }
  };

  const handleOpenPayModal = () => {
    if (!isLoggedIn) {
      alert('Debes iniciar sesión o crear una cuenta para realizar un pago.');
      return;
    }
    setShowPayModal(true);
  };

  if (!show) return null;

  return (
    <>
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
                <button className={styles.removeButton} onClick={() => removeFromCart(index)}>✕</button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <button
            className={styles.cartCheckout}
            onClick={handleOpenPayModal}
          >
            Comprar
          </button>
        )}
      </div>

      {/* Modal para datos de pago */}
      <PayDataModal
        show={showPayModal}
        onClose={() => setShowPayModal(false)}
        onPay={handlePay}
      />
    </>
  );
};

export default ModalCarrito;