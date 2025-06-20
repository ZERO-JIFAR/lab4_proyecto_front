import React, { useState } from 'react';
import styles from './cardProduct.module.css';
import ProductModal from '../topbar/modals/modalProduct';
import { IProduct } from '../../../types/IProduct';

interface CardProductProps {
    product: IProduct | undefined;
}

const CardProduct: React.FC<CardProductProps> = ({ product }) => {
    const [showModal, setShowModal] = useState(false);

    if (!product) return null;

    // Debug: Verifica qué talles llegan para este producto
    console.log('Talles para producto', product.nombre, product.talles);

    // Extraer talles disponibles (solo los que tiene stock > 0)
    const tallesDisponibles = product.talles
        ? product.talles
            .filter(tp => tp.stock > 0 && tp.talle && (tp.talle.valor || tp.talle.nombre))
            .map(tp => tp.talle.valor ? tp.talle.valor : tp.talle.nombre)
        : [];

    const colorDisponible = product.color || 'N/A';
    const imagenes = [
        product.imagenUrl,
        ...(Array.isArray(product.imagenesAdicionales) ? product.imagenesAdicionales : [])
    ].filter(Boolean);

    return (
        <>
            <div className={styles.card} onClick={() => setShowModal(true)}>
                <div className={styles.imageContainer}>
                    <img src={product.imagenUrl || (product.imagenesAdicionales?.[0]) || '/images/zapatillas/default.png'} alt={product.nombre} className={styles.image} />
                </div>
                <div className={styles.content}>
                    <p className={styles.title}>{product.nombre}</p>
                    <p className={styles.price}>
                        <span>${product.precio}</span>
                    </p>
                </div>
            </div>

            {showModal && (
                <ProductModal
                    images={imagenes}
                    color={colorDisponible}
                    sizes={tallesDisponibles}
                    title={product.nombre}
                    price={product.precio}
                    type={product.categoria?.tipo?.nombre || ''}
                    category={product.categoria?.nombre || ''}
                    description={product.descripcion || ''}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    );
};

export default CardProduct;