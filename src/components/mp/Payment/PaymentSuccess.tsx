import { FC, useEffect } from "react";
import styles from "./PaymentSuccess.module.css";
import { Link } from "react-router-dom";
import axios from "axios";

export const PaymentSuccess: FC = () => {
  useEffect(() => {
    const purchase = localStorage.getItem('lastPurchase');
    if (purchase) {
      const items = JSON.parse(purchase);
      // Llama a la API para restar stock de cada producto/talle
      Promise.all(items.map(async (item: any) => {
        try {
          await axios.put(
            `${import.meta.env.VITE_API_URL}/productos/${item.id}/restar-stock`,
            {
              talle: item.size,
              cantidad: item.quantity
            }
          );
        } catch (e) {
          console.error("Error al restar stock:", e);
        }
      })).then(() => {
        // Limpia el carrito local y la compra temporal
        localStorage.removeItem('lastPurchase');
      });
    }
  }, []);

  return (
    <div className={styles.containerPageSuccess}>
      <div className={styles.containerCardSuccess}>
        <h1>¡Pago exitoso! 🎉</h1>
        <p>Gracias por tu compra. Te enviaremos un correo con los detalles.</p>
        <Link className={styles.btnSuccessLink} to={"/"}>
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};
