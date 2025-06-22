import React, { useState } from 'react';
import styles from './cardProduct.module.css';
import ProductModal from '../topbar/modals/modalProduct';
import { IProduct } from '../../../types/IProduct';
import { useCart } from '../../../context/CartContext';

interface CardProductProps {
    product: IProduct;
}

const CardProduct: React.FC<CardProductProps> = ({ product }) => {
    const [showModal, setShowModal] = useState(false);
    const { cart } = useCart();

    if (!product) return null;

    // Leer descuento de localStorage
    const discount = Number(localStorage.getItem(`discount_${product.id}`)) || 0;
    const hasDiscount = discount > 0 && discount <= 90;
    const discountedPrice = hasDiscount
        ? Math.round(product.precio * (1 - discount / 100))
        : product.precio;

    // Extraer talles disponibles (solo los que tiene stock > 0)
    const tallesDisponibles = product.talles
        ? product.talles
            .filter(tp => tp.stock > 0 && tp.talle && (tp.talle.valor || tp.talle.nombre))
            .map(tp => tp.talle.valor ? tp.talle.valor : tp.talle.nombre)
        : [];

    return (
        <>
            <div className={styles.card} onClick={() => setShowModal(true)}>
                <div className={styles.imageContainer}>
                    <img src={product.imagenUrl || (product.imagenesAdicionales?.[0]) || '/images/zapatillas/default.png'} alt={product.nombre} className={styles.image} />
                    {hasDiscount && (
                        <span className={styles.offerBadge}>-{discount}%</span>
                    )}
                </div>
                <div className={styles.content}>
                    <p className={styles.title}>{product.nombre}</p>
                    <p className={styles.price}>
                        {hasDiscount ? (
                            <>
                                <span style={{ textDecoration: 'line-through', color: '#f44336', marginRight: 8 }}>
                                    ${product.precio}
                                </span>
                                <span style={{ color: '#4caf50', fontWeight: 'bold' }}>
                                    ${discountedPrice}
                                </span>
                            </>
                        ) : (
                            <span>${product.precio}</span>
                        )}
                    </p>
                </div>
            </div>

            {showModal && (
                <ProductModal
                    product={product}
                    cart={cart}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    );
};

export default CardProduct;