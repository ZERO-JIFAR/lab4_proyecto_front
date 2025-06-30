import React, { useEffect, useState } from "react";
import styles from "./ordenHistoryModal.module.css";
import axios from "axios";
import { useAuth } from "../../../../context/AuthContext";

interface OrderHistoryModalProps {
  show: boolean;
  onClose: () => void;
}

interface DetalleOrden {
  producto?: {
    nombre: string;
    imagenUrl?: string;
    color?: string;
  };
  cantidad: number;
  precioUnitario: number;
}

interface OrdenDeCompra {
  id: number;
  fecha: string;
  estadoPago: string;
  detalle: DetalleOrden[];
}

const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({ show, onClose }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrdenDeCompra[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show && user?.id) {
      setLoading(true);
      axios
        .get(`${import.meta.env.VITE_API_URL}/ordenes/usuario/${user.id}`)
        .then((res) => {
          if (Array.isArray(res.data)) {
            setOrders(res.data);
          } else if (res.data == null) {
            setOrders([]);
          } else if (typeof res.data === "object") {
            setOrders([res.data]);
          } else {
            setOrders([]);
          }
        })
        .catch(() => setOrders([]))
        .finally(() => setLoading(false));
    }
  }, [show, user]);

  if (!show) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>✖</button>
        <h2>Historial de Compras</h2>
        {loading ? (
          <div>Cargando...</div>
        ) : Array.isArray(orders) && orders.length === 0 ? (
          <div>No tienes compras registradas.</div>
        ) : (
          <div className={styles.ordersList}>
            {Array.isArray(orders) && orders.map((order) => (
              <div key={order.id} className={styles.orderCard}>
                <div>
                  <strong>Fecha:</strong> {order.fecha}
                </div>
                <div className={styles.orderDetails}>
                  {order.detalle.map((detalle, idx) => (
                    <div key={idx} className={styles.orderItem}>
                      <img
                        src={
                          detalle.producto?.imagenUrl
                            ? detalle.producto.imagenUrl
                            : "/images/zapatillas/default.png"
                        }
                        alt={detalle.producto?.nombre || "Producto"}
                        className={styles.orderItemImg}
                      />
                      <div>
                        <div>{detalle.producto?.nombre || "Producto desconocido"}</div>
                        <div>Cantidad: {detalle.cantidad}</div>
                        <div>Precio: ${detalle.precioUnitario}</div>
                        {detalle.producto?.color && <div>Color: {detalle.producto.color}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryModal;