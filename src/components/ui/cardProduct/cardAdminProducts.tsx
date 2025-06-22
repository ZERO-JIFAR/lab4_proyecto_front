import { useState, useEffect } from 'react';
import styles from './cardAdminProducts.module.css';
import ModalEditProd from '../topbar/modals/modalEditProd';
import { MdDelete } from "react-icons/md";
import { IProduct } from '../../../types/IProduct';

interface CardAdminProductProps {
  product: IProduct;
}

const CardAdminProduct: React.FC<CardAdminProductProps> = ({ product }) => {
  const [modalEdit, setModalEdit] = useState(false);
  const [discount, setDiscount] = useState<number>(0);
  const [discountInput, setDiscountInput] = useState<string>('');

  // Cargar descuento guardado en localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`discount_${product.id}`);
    if (saved) setDiscount(Number(saved));
  }, [product.id]);

  // Calcular precio con descuento
  const getDiscountedPrice = () => {
    if (!discount || discount <= 0) return product.precio;
    return Math.round(product.precio * (1 - discount / 100));
  };

  const handleDelete = async () => {
    const confirm = window.confirm(`¿Estás seguro de que querés eliminar el producto "${product.nombre}"?`);
    if (!confirm) return;

    try {
      const APIURL = import.meta.env.VITE_API_URL;
      // Construir headers sin Authorization si es undefined
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      };
      await fetch(`${APIURL}/productos/${product.id}`, {
        method: 'DELETE',
        headers,
      });

      alert('Producto eliminado correctamente.');
      window.location.reload();
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Hubo un error al intentar eliminar el producto.');
    }
  };

  // Guardar descuento en localStorage
  const handleSetDiscount = () => {
    const value = Number(discountInput);
    if (isNaN(value) || value < 1 || value > 90) {
      alert('El descuento debe ser un número entre 1 y 90');
      return;
    }
    setDiscount(value);
    localStorage.setItem(`discount_${product.id}`, String(value));
    setDiscountInput('');
  };

  // Quitar descuento
  const handleRemoveDiscount = () => {
    setDiscount(0);
    localStorage.removeItem(`discount_${product.id}`);
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={product.imagenUrl || '/images/zapatillas/default.png'} alt={product.nombre} className={styles.image} />
      </div>
      <div className={styles.details}>
        <h4 className={styles.title}>{product.nombre}</h4>
        <p className={styles.price}>
          {discount > 0 ? (
            <>
              <span style={{ textDecoration: 'line-through', color: '#f44336', marginRight: 8 }}>
                ${product.precio}
              </span>
              <span style={{ color: '#4caf50', fontWeight: 'bold' }}>
                ${getDiscountedPrice()} (-{discount}%)
              </span>
            </>
          ) : (
            <>${product.precio}</>
          )}
        </p>
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
      {/* Sección de descuento */}
      <div style={{ marginTop: 10 }}>
        {discount > 0 ? (
          <div>
            <span style={{ color: '#4caf50', fontWeight: 'bold' }}>
              Descuento activo: {discount}%
            </span>
            <button
              style={{
                marginLeft: 10,
                background: '#f44336',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
                padding: '4px 10px',
                cursor: 'pointer'
              }}
              onClick={handleRemoveDiscount}
            >
              Quitar descuento
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <input
              type="number"
              min={1}
              max={90}
              placeholder="Descuento %"
              value={discountInput}
              onChange={e => setDiscountInput(e.target.value)}
              style={{ width: 70, padding: 4, borderRadius: 4, border: '1px solid #ccc' }}
            />
            <button
              style={{
                background: '#4caf50',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
                padding: '4px 10px',
                cursor: 'pointer'
              }}
              onClick={handleSetDiscount}
            >
              Aplicar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardAdminProduct;