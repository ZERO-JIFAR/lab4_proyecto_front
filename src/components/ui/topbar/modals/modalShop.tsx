import React, { useState } from 'react';
import styles from './modalShop.module.css';
import { useCart } from "../../../../context/CartContext";
import { useAuth } from "../../../../context/AuthContext";
import { FaArrowRight, FaTrash } from "react-icons/fa";
import PayDataModal from '../../PayDataModal/payDataModal';
import axios from 'axios';
import { Wallet } from "@mercadopago/sdk-react";
import { IProduct } from "../../../../types/IProduct";

interface ModalCarritoProps {
  show: boolean;
  onClose: () => void;
}

interface GroupedCartItem {
  id: number;
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

  // Estado para Wallet de Mercado Pago
  const [stateConfirm, setStateConfirm] = useState<{
    preferenceId: string | null;
    open: boolean;
  }>({
    preferenceId: null,
    open: false,
  });

  // Estado para agrupación y datos de envío/retiro
  const [deliveryType, setDeliveryType] = useState<"" | "envio" | "local">("");
  const [address, setAddress] = useState("");
  const [storeNumber, setStoreNumber] = useState("");
  const [mpReady, setMpReady] = useState(false);

  // Agrupa los productos del carrito por título, color y talle
  const groupedCart: GroupedCartItem[] = [];
  cart.forEach(item => {
    const discount = Number(localStorage.getItem(`discount_${item.title.replace(/"/g, '').replace(/'/g, '')}`)) || 0;
    const hasDiscount = discount > 0 && discount <= 90;
    const discountedPrice = hasDiscount
      ? Math.round(item.price * (1 - discount / 100))
      : item.price;

    const found = groupedCart.find(
      g =>
        g.title === item.title &&
        g.color === item.color &&
        g.size === item.size
    );
    if (found) {
      found.quantity += 1;
    } else {
      groupedCart.push({
        id: item.id,
        title: item.title,
        price: discountedPrice,
        image: item.image,
        color: item.color,
        size: item.size,
        quantity: 1
      });
    }
  });

  const total = groupedCart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Controla si se puede mostrar el botón de Mercado Pago
  React.useEffect(() => {
    if (deliveryType === "envio" && address.trim().length > 0) {
      setMpReady(true);
    } else if (deliveryType === "local" && storeNumber.trim().length > 0) {
      setMpReady(true);
    } else {
      setMpReady(false);
    }
  }, [deliveryType, address, storeNumber]);

  const resetState = () => {
    setDeliveryType("");
    setAddress("");
    setStoreNumber("");
    setMpReady(false);
    setStateConfirm({ preferenceId: null, open: false });
  };

  React.useEffect(() => {
    if (!show) resetState();
    // eslint-disable-next-line
  }, [show]);

  if (!show) return null;

  // Maneja el pago con Mercado Pago (modal de datos)
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
      const realToken = token || localStorage.getItem('token') || '';
      const ordenRes = await axios.post(
        `${import.meta.env.VITE_API_URL}/ordenes`,
        {
          items: groupedCart,
          email,
          nombre,
          tipoEntrega,
          direccion,
          ciudad,
        },
        {
          headers: {
            Authorization: `Bearer ${realToken}`
          }
        }
      );
      const ordenId = ordenRes.data.id;

      const mpRes = await axios.post(
        `${import.meta.env.VITE_API_URL}/pay/mp`,
        {
          id: [ordenId]
        },
        {
          headers: {
            Authorization: `Bearer ${realToken}`
          }
        }
      );

      const urlMP = mpRes.data.urlMP;
      window.location.href = urlMP;

      clearCart();
    } catch (err: any) {
      if (err.response && err.response.status === 403) {
        alert('No tienes permisos para realizar esta acción. Inicia sesión nuevamente.');
      } else {
        alert('Error al iniciar el pago');
      }
    }
  };

  // Pagar directo con Wallet de Mercado Pago (sin modal de datos)
  const handleGetPreferenceId = async () => {
    try {
      // Envía solo los ids de los productos agrupados
      const ids = groupedCart.map((el) => el.id);
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await axios.post<{ preferenceId: string }>(
        `${apiUrl}/pay/mp`,
        { id: ids }
      );
      if (res.data && res.data.preferenceId) {
        setStateConfirm({
          preferenceId: res.data.preferenceId,
          open: true,
        });
        // clearCart(); // NO limpiar el carrito aquí
      }
    } catch (error) {
      alert("Error al obtener preferencia de Mercado Pago");
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
                  <p className={styles.cartItemTitle}>{item.title}</p>
                  <div className={styles.cartItemOptions}>
                    Color: {item.color} | Talle: {item.size}
                  </div>
                  <div className={styles.cartItemPrice}>
                    ${item.price} x {item.quantity}
                  </div>
                  {item.quantity > 1 && (
                    <div className={styles.cartItemSubtotal}>
                      Subtotal: <span>${item.price * item.quantity}</span>
                    </div>
                  )}
                </div>
                <button
                  className={styles.removeBtn}
                  onClick={() => handleRemoveGroup(item)}
                  title="Eliminar producto"
                >
                  <FaTrash />
                </button>
              </div>
            ))
          )}
        </div>

        {groupedCart.length > 0 && (
          <>
            <div className={styles.cartTotal}>
              Total: ${total}
            </div>

            {/* Paso 1: Elegir tipo de entrega */}
            {!deliveryType && (
              <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 12 }}>
                <button
                  className={styles.cartCheckout}
                  style={{ background: "#009ee3" }}
                  onClick={() => setDeliveryType("envio")}
                >
                  Envío a domicilio
                </button>
                <button
                  className={styles.cartCheckout}
                  style={{ background: "#4caf50" }}
                  onClick={() => setDeliveryType("local")}
                >
                  Retiro en local
                </button>
              </div>
            )}

            {/* Paso 2: Si elige envío, pide dirección */}
            {deliveryType === "envio" && (
              <div style={{ marginTop: 18 }}>
                <label style={{ color: "#fff" }}>Dirección de envío:</label>
                <input
                  type="text"
                  className={styles.cartCheckout}
                  style={{ background: "#222", color: "#fff", marginTop: 8, marginBottom: 8 }}
                  placeholder="Ingresá tu dirección"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                />
              </div>
            )}

            {/* Paso 2: Si elige local, pide número de local */}
            {deliveryType === "local" && (
              <div style={{ marginTop: 18 }}>
                <label style={{ color: "#fff" }}>Número de local:</label>
                <input
                  type="text"
                  className={styles.cartCheckout}
                  style={{ background: "#222", color: "#fff", marginTop: 8, marginBottom: 8 }}
                  placeholder="Ingresá el número del local"
                  value={storeNumber}
                  onChange={e => setStoreNumber(e.target.value)}
                />
              </div>
            )}

            {/* Paso 3: Botón Mercado Pago solo si datos completos */}
            {mpReady && !stateConfirm.open && (
              <button
                className={styles.cartCheckout}
                style={{ background: "#009ee3", marginTop: 8 }}
                onClick={handleGetPreferenceId}
              >
                Pagar con Mercado Pago
              </button>
            )}

            {/* Wallet de Mercado Pago embebido */}
            {stateConfirm.open && stateConfirm.preferenceId && (
              <Wallet initialization={{ preferenceId: stateConfirm.preferenceId }} />
            )}
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