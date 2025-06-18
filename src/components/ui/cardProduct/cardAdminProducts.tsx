import { useState } from 'react';
import styles from './cardAdminProducts.module.css';
import ModalEditProd from '../topbar/modals/modalEditProd';
import { MdDelete } from "react-icons/md";

const CardAdminProduct = ({ product }) => {
  const [modalEdit, setModalEdit] = useState(false);
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={product.imagenUrl || '/images/zapatillas/default.png'} alt={product.nombre} className={styles.image} />
      </div>
      <div className={styles.details}>
        <h4 className={styles.title}>{product.nombre}</h4>
        <p className={styles.price}>${product.precio}</p>
      </div>
      <div className={styles.actions}>
        <button className={styles.edit} onClick={() => setModalEdit(true)}>
          Editar
        </button>
        <ModalEditProd isOpen={modalEdit} onClose={() => setModalEdit(false)} />
        <button className={styles.delete}><MdDelete /></button>
      </div>
    </div>
  );
};

export default CardAdminProduct;
