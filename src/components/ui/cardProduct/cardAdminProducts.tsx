import { useState, useEffect } from 'react';
import styles from './cardAdminProducts.module.css';
import ModalEditProd from '../topbar/modals/modalEditProd';
import ModalProduct from '../topbar/modals/modalProduct';
import { IProduct } from '../../../types/IProduct';
import { applyDiscount, removeDiscount, getProductoById } from '../../../http/productRequest';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import axios from "axios";

interface CardAdminProductProps {
  product: IProduct;
  onUpdate?: () => void;
}

const CardAdminProduct: React.FC<CardAdminProductProps> = ({ product, onUpdate }) => {
  const [modalEdit, setModalEdit] = useState(false);
  const [modalProduct, setModalProduct] = useState(false);
  const [eliminado, setEliminado] = useState(product.eliminado);
  const [loading, setLoading] = useState(false);
  const [discountInput, setDiscountInput] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const [editProduct, setEditProduct] = useState<IProduct | null>(product);
  const { isAdmin } = useAuth();
  const { cart } = useCart();

  // NUEVO: Refrescar producto tras edición
  const refreshProduct = async () => {
    try {
      const prod = await getProductoById(product.id);
      setEditProduct(prod);
      if (onUpdate) onUpdate();
    } catch (e) {
      alert("Error al refrescar producto");
    }
  };

  useEffect(() => {
    if (product.precioOriginal && product.precioOriginal > product.precio) {
      const realDiscount = Math.round(100 - (product.precio / product.precioOriginal) * 100);
      setDiscount(realDiscount);
    } else {
      setDiscount(0);
    }
    setEliminado(product.eliminado);
    setEditProduct(product); // Si cambia el prop, actualiza el estado local
  }, [product.precio, product.precioOriginal, product.eliminado, product]);

  const getDiscountedPrice = () => {
    if (!discount || discount <= 0) return product.precio;
    return Math.round(product.precioOriginal ? product.precioOriginal * (1 - discount / 100) : product.precio);
  };

  // PATCH para habilitar/deshabilitar producto y refrescar lista
  const handleToggleActivo = async () => {
    const confirmMsg = eliminado
      ? `¿Estás seguro de que querés habilitar el producto "${product.nombre}"?`
      : `¿Estás seguro de que querés deshabilitar el producto "${product.nombre}"?`;
    if (!window.confirm(confirmMsg)) return;

    setLoading(true);
    try {
      const APIURL = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      };
      const response = await axios.patch(`${APIURL}/productos/${product.id}`, {
        eliminado: !eliminado,
      }, { headers });

      if (response.data && typeof response.data.eliminado === "boolean") {
        setEliminado(response.data.eliminado);
      } else {
        setEliminado(!eliminado);
      }

      await refreshProduct();
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      alert('Hubo un error al intentar actualizar el producto.');
    }
    setLoading(false);
  };

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
      await refreshProduct();
    } catch (e) {
      alert("Error al aplicar descuento");
    }
    setLoading(false);
  };

  const handleRemoveDiscount = async () => {
    if (!isAdmin) return alert("Solo un admin puede quitar descuentos");
    setLoading(true);
    try {
      await removeDiscount(product.id);
      setDiscount(0);
      await refreshProduct();
    } catch (e) {
      alert("Error al quitar descuento");
    }
    setLoading(false);
  };

  const openEditModal = async () => {
    setLoading(true);
    try {
      const prod = await getProductoById(product.id);
      setEditProduct(prod);
      setModalEdit(true);
    } catch (e) {
      alert("Error al cargar datos completos del producto");
    }
    setLoading(false);
  };

  // Cuando se cierra el modal de edición, refresca el producto
  const handleCloseEditModal = async () => {
    setModalEdit(false);
    await refreshProduct();
  };

  return (
    <div className={`${styles.card} ${eliminado ? styles.disabled : ''}`}>
      <div
        className={styles.imageContainer}
        style={{ cursor: 'pointer' }}
        onClick={() => setModalProduct(true)}
        title="Ver y comprar producto"
      >
        <img src={editProduct?.imagenUrl || '/images/zapatillas/default.png'} alt={editProduct?.nombre || ''} className={styles.image} />
      </div>
      <div className={styles.details}>
        <h4 className={styles.title}>{editProduct?.nombre}</h4>
        <p className={styles.price}>
          {discount > 0 && editProduct?.precioOriginal ? (
            <>
              <span style={{ textDecoration: 'line-through', color: '#f44336', marginRight: 8 }}>
                ${editProduct.precioOriginal}
              </span>
              <span style={{ color: '#4caf50', fontWeight: 'bold' }}>
                ${getDiscountedPrice()}
              </span>
            </>
          ) : (
            <>${editProduct?.precio}</>
          )}
        </p>
      </div>
      <div className={styles.actions}>
        <div>
          {discount > 0 ? (
            <div>
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
                value={discountInput ?? ''}
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
          onClick={openEditModal}
          disabled={eliminado}
        >
          Editar
        </button>
        <ModalEditProd
          isOpen={modalEdit}
          onClose={handleCloseEditModal}
          product={editProduct || product}
        />
        <button
          className={`${styles.delete} ${eliminado ? styles.enable : ''}`}
          onClick={handleToggleActivo}
          disabled={loading}
        >
          {eliminado ? 'Habilitar' : 'Deshabilitar'}
        </button>
      </div>
      {modalProduct && (
        <ModalProduct
          product={editProduct || product}
          cart={cart}
          onClose={() => setModalProduct(false)}
        />
      )}
    </div>
  );
};

export default CardAdminProduct;