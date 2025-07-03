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

    // Imagen principal: la imagenUrl del producto, o la primera imagen adicional, o default
    const mainImage =
        product.imagenUrl ||
        (product.colores && product.colores.length > 0 && product.colores[0].imagenesAdicionales && product.colores[0].imagenesAdicionales.length > 0
            ? product.colores[0].imagenesAdicionales[0]
            : '/images/zapatillas/default.png');

    // Descuento real desde backend
    const hasDiscount = !!product.precioOriginal && product.precioOriginal > product.precio;
    const discount = hasDiscount
        ? Math.round(100 - (product.precio / (product.precioOriginal ?? 1)) * 100)
        : 0;
    const discountedPrice = hasDiscount
        ? Math.round(product.precio)
        : product.precio;

    return (
        <>
            <div className={styles.card} onClick={() => setShowModal(true)}>
                <div className={styles.imageContainer}>
                    <img src={mainImage} alt={product.nombre} className={styles.image} />
                    {hasDiscount && (
                        <span className={styles.offerBadge}>-{discount}%</span>
                    )}
                </div>
                <div className={styles.content}>
                    <p className={styles.title}>{product.nombre}</p>
                    <p className={styles.price}>
                        {hasDiscount ? (
                            <>
                                <span className={styles.precioOriginal}>
                                    ${product.precioOriginal}
                                </span>
                                <span className={styles.discountedPrice}>
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