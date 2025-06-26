import { useState, useEffect } from 'react';
import styles from './cardAdminProducts.module.css';
import ModalEditProd from '../topbar/modals/modalEditProd';
import { IProduct } from '../../../types/IProduct';
import { applyDiscount, removeDiscount } from '../../../http/productRequest';
import { useAuth } from '../../../context/AuthContext';

interface CardAdminProductProps {
  product: IProduct;
}

const CardAdminProduct: React.FC<CardAdminProductProps> = ({ product }) => {
  const [modalEdit, setModalEdit] = useState(false);
  const [eliminado, setEliminado] = useState(product.eliminado);
  const [loading, setLoading] = useState(false);
  const [discountInput, setDiscountInput] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const { isAdmin } = useAuth();

  // Refresca el descuento desde el producto (precioOriginal)
  useEffect(() => {
    if (product.precioOriginal && product.precioOriginal > product.precio) {
      // Si el precio original es mayor, calcula el descuento real
      const realDiscount = Math.round(100 - (product.precio / product.precioOriginal) * 100);
      setDiscount(realDiscount);
    } else {
      setDiscount(0);
    }
  }, [product.precio, product.precioOriginal]);

  // Calcular precio con descuento
  const getDiscountedPrice = () => {
    if (!discount || discount <= 0) return product.precio;
    return Math.round(product.precioOriginal ? product.precioOriginal * (1 - discount / 100) : product.precio);
  };

  const handleToggleActivo = async () => {
    const confirm = window.confirm(
      `¿Estás seguro de que querés ${eliminado ? 'habilitar' : 'deshabilitar'} el producto "${product.nombre}"?`
    );
    if (!confirm) return;

    try {
      const APIURL = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      };
      await fetch(`${APIURL}/productos/${product.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          ...product,
          eliminado: !eliminado,
        }),
      });

      setEliminado(!eliminado); // Actualiza el estado local
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      alert('Hubo un error al intentar actualizar el producto.');
    }
  };

  // Aplicar descuento usando backend
  const handleApplyDiscount = async () => {
    const value = Number(discountInput);
    if (!isAdmin) return alert("Solo un admin puede aplicar descuentos");
    if (isNaN(value) || value < 1 || value > 90) {
      alert('El descuento debe ser un número entre 1 y 90');
      return;
    }
    setLoading(true);
    try {
      await applyDiscount(product.id, value);
      setDiscount(value);
      setDiscountInput('');
      // Opcional: podrías recargar el producto desde backend aquí si lo necesitas
      window.location.reload(); // Para reflejar el cambio en la lista
    } catch (e) {
      alert("Error al aplicar descuento");
    }
    setLoading(false);
  };

  // Quitar descuento usando backend
  const handleRemoveDiscount = async () => {
    if (!isAdmin) return alert("Solo un admin puede quitar descuentos");
    setLoading(true);
    try {
      await removeDiscount(product.id);
      setDiscount(0);
      // Opcional: podrías recargar el producto desde backend aquí si lo necesitas
      window.location.reload(); // Para reflejar el cambio en la lista
    } catch (e) {
      alert("Error al quitar descuento");
    }
    setLoading(false);
  };

  return (
    <div className={`${styles.card} ${eliminado ? styles.disabled : ''}`}>
      <div className={styles.imageContainer}>
        <img src={product.imagenUrl || '/images/zapatillas/default.png'} alt={product.nombre} className={styles.image} />
      </div>
      <div className={styles.details}>
        <h4 className={styles.title}>{product.nombre}</h4>
        <p className={styles.price}>
          {discount > 0 && product.precioOriginal ? (
            <>
              <span style={{ textDecoration: 'line-through', color: '#f44336', marginRight: 8 }}>
                ${product.precioOriginal}
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
        {/* Sección de descuento */}
        <div>
          {discount > 0 ? (
            <div>
              <span className={styles.desc}>
                Descuento activo: {discount}%
              </span>
              <button
                className={styles.delete}
                onClick={handleRemoveDiscount}
                disabled={eliminado || loading}
              >
                Quitar descuento
              </button>
            </div>
          ) : (
            <div className={styles.sectDesc}>
              <input
                type="number"
                min={1}
                max={90}
                placeholder="Descuento %"
                value={discountInput}
                onChange={e => setDiscountInput(e.target.value)}
                className={styles.cuadroDesc}
                disabled={eliminado || loading}
              />
              <button
                className={styles.edit}
                onClick={handleApplyDiscount}
                disabled={eliminado || loading}
              >
                Aplicar
              </button>
            </div>
          )}
        </div>
        <button
          className={styles.edit}
          onClick={() => setModalEdit(true)}
          disabled={eliminado}
        >
          Editar
        </button>
        <ModalEditProd
          isOpen={modalEdit}
          onClose={() => setModalEdit(false)}
          product={product}
        />
        <button
          className={`${styles.delete} ${eliminado ? styles.enable : ''}`}
          onClick={handleToggleActivo}
        >
          {eliminado ? 'Habilitar' : 'Deshabilitar'}
        </button>
      </div>
    </div>
  );
};

export default CardAdminProduct;