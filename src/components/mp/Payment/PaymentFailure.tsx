import { FC } from "react";
import styles from "./PaymentFailure.module.css";
import { Link } from "react-router-dom";

const PaymentFailure: FC = () => {
  return (
    <div className={styles.containerScreenPaymentFailure}>
      <div className={styles.containerCardFailure}>
        <h1>❌ El pago no se pudo procesar</h1>
        <p>Algo salió mal. Podés intentar de nuevo o contactar al soporte.</p>
        <Link className={styles.btnLinkFailure} to="/">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default PaymentFailure;
