import { FC, useEffect } from "react";
import styles from "./PaymentSuccess.module.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import { IProduct } from "../../../types/IProduct";

export const PaymentSuccess: FC = () => {
  const { user } = useAuth();

  useEffect(() => {
    const purchase = localStorage.getItem('lastPurchase');
    if (purchase && user?.id) {
      const items = JSON.parse(purchase);

      console.log("Intentando registrar orden de compra:", {
        usuarioId: user.id,
        items: items.map((item: any) => ({
          productoId: item.id,
          cantidad: item.quantity,
          precioUnitario: item.price,
          talle: item.size,
          color: item.color
        }))
      });

      Promise.all(items.map(async (item: any) => {
        try {
          // 1. Obtener el producto para buscar colorProductoId y talleId
          const res = await axios.get<IProduct>(`${import.meta.env.VITE_API_URL}/productos/dto/${item.id}`);
          const product = res.data;
          const colorObj = product.colores.find(
            c => c.color.trim().toLowerCase() === item.color.trim().toLowerCase()
          );
          if (!colorObj) throw new Error("Color no encontrado");
          const talleObj = colorObj.talles.find(
            t =>
              (t.talleValor && t.talleValor.trim().toLowerCase() === item.size.trim().toLowerCase()) ||
              (t.talleId && String(t.talleId) === String(item.size.trim()))
          );
          if (!talleObj) throw new Error("Talle no encontrado");

          await axios.put(
            `${import.meta.env.VITE_API_URL}/productos/${item.id}/restar-stock`,
            {
              colorProductoId: colorObj.id,
              talleId: talleObj.talleId,
              cantidad: item.quantity
            }
          );
        } catch (e) {
          console.error("Error al restar stock:", e);
        }
      }))
      .then(async () => {
        try {
          const res = await axios.post(`${import.meta.env.VITE_API_URL}/ordenes`, {
            usuarioId: user.id,
            items: items.map((item: any) => ({
              productoId: item.id,
              cantidad: item.quantity,
              precioUnitario: item.price,
              talle: item.size,
              color: item.color
            }))
          });
          console.log("Respuesta del backend al crear orden:", res.data);
        } catch (e) {
          console.error("Error al registrar la orden de compra:", e);
        }
        localStorage.removeItem('lastPurchase');
      });
    } else {
      console.warn("No hay purchase o user.id en PaymentSuccess");
    }
  }, [user]);

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