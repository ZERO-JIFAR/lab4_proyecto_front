import { FC } from "react";
import styles from "./PaymentSuccess.module.css";
import { Link } from "react-router-dom";

export const PaymentSuccess: FC = () => {
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
