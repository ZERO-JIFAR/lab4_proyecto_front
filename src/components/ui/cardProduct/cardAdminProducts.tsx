import { useState } from 'react';
import styles from './cardAdminProducts.module.css';
import ModalEditProd from '../topbar/modals/modalEditProd';
import { MdDelete } from "react-icons/md";

const CardAdminProduct = ({ product }) => {
  const [modalEdit, setModalEdit] = useState(false);
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={product.image} alt={product.title} className={styles.image} />
      </div>
      <div className={styles.details}>
        <h4 className={styles.title}>{product.title}</h4>
        <p className={styles.price}>${product.price}</p>
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
