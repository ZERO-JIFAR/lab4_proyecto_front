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

interface GroupedCartItem {
  title: string;
  price: number;
  image: string;
  color: string;
  size: string;
  quantity: number;
}

const ModalCarrito: React.FC<ModalCarritoProps> = ({ show, onClose }) => {
  const { cart, removeFromCart, clearCart } = useCart();
  const { isLoggedIn, token } = useAuth();
  const [showPayModal, setShowPayModal] = useState(false);

  // Agrupa los productos del carrito por título, color y talle
  const groupedCart: GroupedCartItem[] = [];
  cart.forEach(item => {
    const found = groupedCart.find(
      g =>
        g.title === item.title &&
        g.color === item.color &&
        g.size === item.size
    );
    if (found) {
      found.quantity += 1;
    } else {
      groupedCart.push({ ...item, quantity: 1 });
    }
  });

  // Maneja el pago con Mercado Pago
  const handlePay = async (
    email: string,
    nombre: string,
    tipoEntrega: string,
    direccion: string,
    ciudad: string,
    tarjeta: string,
    vencimiento: string,
    cvv: string,
    metodoTarjeta: string
  ) => {
    try {
      // 1. Crear la orden en tu backend (con token)
      const ordenRes = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/ordenes`,
        {
          items: cart,
          email,
          nombre,
          tipoEntrega,
          direccion,
          ciudad
        },
        {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem('token') || ''}`
          }
        }
      );
      const ordenId = ordenRes.data.id;

      // 2. Llamar a tu endpoint de Mercado Pago para obtener la preferencia
      const mpRes = await axios.post(
        `${import.meta.env.VITE_API_URL}/pay/mp`,
        {
          ordenId: ordenId,
          descripcion: `Compra de productos - Orden #${ordenId}`,
          monto: cart.reduce((acc, item) => acc + item.price, 0),
          emailComprador: email
        },
        {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem('token') || ''}`
          }
        }
      );

      // 3. Redirige a Mercado Pago
      window.location.href = mpRes.data.urlMP;
      clearCart(); // Limpia el carrito localmente
    } catch (err: any) {
      if (err.response && err.response.status === 403) {
        alert('No tienes permisos para realizar esta acción. Inicia sesión nuevamente.');
      } else {
        alert('Error al iniciar el pago');
      }
    }
  };

  const handleOpenPayModal = () => {
    if (!isLoggedIn) {
      alert('Debes iniciar sesión o crear una cuenta para realizar un pago.');
      return;
    }
    setShowPayModal(true);
  };

  // Elimina todos los productos de ese grupo del carrito
  const handleRemoveGroup = (group: GroupedCartItem) => {
    for (let i = cart.length - 1; i >= 0; i--) {
      if (
        cart[i].title === group.title &&
        cart[i].color === group.color &&
        cart[i].size === group.size
      ) {
        removeFromCart(i);
      }
    }
  };

  // Suma total del carrito
  const total = groupedCart.reduce((acc, item) => acc + item.price * item.quantity, 0);

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
          {groupedCart.length === 0 ? (
            <p className={styles.cartEmpty}>No hay artículos en el carrito...</p>
          ) : (
            groupedCart.map((item, index) => (
              <div key={index} className={styles.cartItem}>
                <img
                  src={item.image}
                  alt={item.title}
                  className={styles.cartItemImage}
                />
                <div className={styles.cartItemDetails}>
                  <p className={styles.cartItemTitle}>
                    {item.title} {item.quantity > 1 && <span style={{ color: "#aaa" }}>x{item.quantity}</span>}
                  </p>
                  <p className={styles.cartItemOptions}>
                    Color: {item.color} | Talle: {item.size}
                  </p>
                  <p className={styles.cartItemPrice}>
                    ${item.price * item.quantity}
                  </p>
                </div>
                <button className={styles.removeButton} onClick={() => handleRemoveGroup(item)}>✕</button>
              </div>
            ))
          )}
        </div>

        {groupedCart.length > 0 && (
          <>
            <div style={{ textAlign: "right", fontWeight: "bold", fontSize: "1.1rem", margin: "10px 0" }}>
              Total: ${total}
            </div>
            <button
              className={styles.cartCheckout}
              onClick={handleOpenPayModal}
            >
              Comprar
            </button>
          </>
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