import React, { useState } from 'react';
import styles from './cardProduct.module.css';
import ProductModal from '../topbar/modals/modalProduct';
import { useAuth } from '../../../context/AuthContext';

interface CardProductProps {
    title: string;
    price: number;
    image: string;
    images?: string[];      // Imágenes adicionales para el modal
    colors?: string[];      // Colores disponibles (como imágenes)
    sizes?: string[];       // Talles disponibles
    type?: string;
    category?: string;
    description?: string;
}

const CardProduct: React.FC<CardProductProps> = ({
    title,
    price,
    image,
    images = [image],
    colors = [image],
    sizes = ['S', 'M', 'L'],
    type = 'Running',
    category = 'General',
    description = 'Descripción no disponible.'
}) => {
    const [showModal, setShowModal] = useState(false);

    // Usa el contexto de autenticación
    const { isLoggedIn, isAdmin } = useAuth();

    return (
        <>
        <div className={styles.card} onClick={() => setShowModal(true)}>
            <div className={styles.imageContainer}>
                <img src={image} alt={title} className={styles.image} />
            </div>
            <div className={styles.content}>
                <p className={styles.title}>{title}</p>
                <p className={styles.price}>
                    <span>${price}</span>
                </p>
                {/* Ejemplo: solo muestra el botón si el usuario está logueado */}
                {isLoggedIn && (
                    <button className={styles.buyButton}>Agregar al Carrito</button>
                )}
                {/* Ejemplo: muestra un mensaje si es admin */}
                {isAdmin && (
                    <span className={styles.adminBadge}>Producto editable (Admin)</span>
                )}
            </div>
        </div>

        {showModal && (
            <ProductModal
                images={images}
                colors={colors}
                sizes={sizes}
                title={title}
                price={price}
                type={type}
                category={category}
                description={description}
                onClose={() => setShowModal(false)}
            />
        )}
        </>
    );
};

export default CardProduct;
