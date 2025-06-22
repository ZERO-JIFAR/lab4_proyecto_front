import { useState } from 'react';
import styles from './cardAdminProducts.module.css';
import ModalEditProd from '../topbar/modals/modalEditProd';
import { MdDelete } from "react-icons/md";

const CardAdminProduct = ({ product }) => {
  const [modalEdit, setModalEdit] = useState(false);
  const handleDelete = async () => {
  const confirm = window.confirm(`¿Estás seguro de que querés eliminar el producto "${product.nombre}"?`);
  if (!confirm) return;

  try {
    const APIURL = import.meta.env.VITE_API_URL;
    await fetch(`${APIURL}/productos/${product.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token')
          ? `Bearer ${localStorage.getItem('token')}`
          : undefined,
      },
    });

    alert('Producto eliminado correctamente.');
    // Podés recargar o actualizar el listado
    window.location.reload(); // ❗️podés reemplazarlo por refetch si lo tenés
  } catch (error) {
    console.error('Error al eliminar:', error);
    alert('Hubo un error al intentar eliminar el producto.');
  }
};

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
        <ModalEditProd
          isOpen={modalEdit}
          onClose={() => setModalEdit(false)}
          product={product}
        />
        <button className={styles.delete} onClick={handleDelete}>
          <MdDelete />
        </button>
      </div>
    </div>
  );
};

export default CardAdminProduct;
