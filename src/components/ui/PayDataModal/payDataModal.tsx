import React, { useState } from 'react';
import styles from './payDataModal.module.css';

interface PayDataModalProps {
  show: boolean;
  onClose: () => void;
  onPay: (
    email: string,
    nombre: string,
    tipoEntrega: string,
    direccion: string,
    ciudad: string,
    tarjeta: string,
    vencimiento: string,
    cvv: string,
    metodoTarjeta: string
  ) => void;
}

const PayDataModal: React.FC<PayDataModalProps> = ({ show, onClose, onPay }) => {
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [tipoEntrega, setTipoEntrega] = useState('');
  const [direccion, setDireccion] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [mostrarPago, setMostrarPago] = useState(false);
  const [metodoTarjeta, setMetodoTarjeta] = useState('');
  const [tarjeta, setTarjeta] = useState('');
  const [vencimiento, setVencimiento] = useState('');
  const [cvv, setCvv] = useState('');

  // Controla cuándo mostrar el formulario de pago
  React.useEffect(() => {
    if (tipoEntrega === "retiro") {
      setMostrarPago(true);
    } else if (tipoEntrega === "envio" && direccion && ciudad) {
      setMostrarPago(true);
    } else {
      setMostrarPago(false);
    }
  }, [tipoEntrega, direccion, ciudad]);

  if (!show) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPay(
      email,
      nombre,
      tipoEntrega,
      direccion,
      ciudad,
      tarjeta,
      vencimiento,
      cvv,
      metodoTarjeta
    );
  };

  return (
    <div className={styles.cartSidebar + ' ' + styles.open}>
      <div className={styles.cartHeader}>
        <h2>Datos para el pago</h2>
        <button className={styles.cartClose} onClick={onClose}>✕</button>
      </div>
      <form onSubmit={handleSubmit}>
        <label>Nombre completo</label>
        <input
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          required
        />
        <label>Correo electrónico</label>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        {/* Desplegable para elegir tipo de entrega */}
        <label style={{ marginTop: 10 }}>¿Cómo querés recibir tu compra?</label>
        <select
          value={tipoEntrega}
          onChange={e => setTipoEntrega(e.target.value)}
          required
        >
          <option value="">Seleccionar</option>
          <option value="envio">Envío a domicilio</option>
          <option value="retiro">Retiro en local</option>
        </select>

        {/* Si elige envío, pide dirección y ciudad */}
        {tipoEntrega === "envio" && (
          <>
            <label>Dirección de envío</label>
            <input
              type="text"
              placeholder="Dirección"
              value={direccion}
              onChange={e => setDireccion(e.target.value)}
              required
            />
            <label>Ciudad</label>
            <input
              type="text"
              placeholder="Ciudad"
              value={ciudad}
              onChange={e => setCiudad(e.target.value)}
              required
            />
          </>
        )}

        {/* Formulario de pago: solo si corresponde */}
        {mostrarPago && (
          <div style={{ marginTop: 18 }}>
            <label>Método de pago</label>
            <select
              value={metodoTarjeta}
              onChange={e => setMetodoTarjeta(e.target.value)}
              required
            >
              <option value="">Seleccionar</option>
              <option value="visa">Visa</option>
              <option value="mastercard">MasterCard</option>
            </select>
            <label>Número de tarjeta</label>
            <input
              type="text"
              placeholder="Número de tarjeta"
              maxLength={16}
              value={tarjeta}
              onChange={e => setTarjeta(e.target.value)}
              required
            />
            <label>Vencimiento</label>
            <input
              type="text"
              placeholder="MM/AA"
              maxLength={5}
              value={vencimiento}
              onChange={e => setVencimiento(e.target.value)}
              required
            />
            <label>Código de seguridad</label>
            <input
              type="text"
              placeholder="CVV"
              maxLength={4}
              value={cvv}
              onChange={e => setCvv(e.target.value)}
              required
            />
          </div>
        )}

        <button
          type="submit"
          className={styles.cartCheckout}
          disabled={
            !nombre ||
            !email ||
            !tipoEntrega ||
            (tipoEntrega === "envio" && (!direccion || !ciudad)) ||
            !mostrarPago ||
            !metodoTarjeta ||
            !tarjeta ||
            !vencimiento ||
            !cvv
          }
        >
          Pagar con Mercado Pago
        </button>
      </form>
    </div>
  );
};

export default PayDataModal;