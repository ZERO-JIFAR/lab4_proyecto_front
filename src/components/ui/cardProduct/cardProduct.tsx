import React, { useState } from 'react';
import styles from './cardProduct.module.css';
import ProductModal from '../topbar/modals/modalProduct';

interface CardProductProps {
    title: string;
    price: number;
    image: string;
    images?: string[];      // Imágenes adicionales para el modal
    colors?: string[];      // Colores disponibles
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
    colors = [],
    sizes = [],
    type = 'Running',
    category = 'General',
    description = 'Descripción no disponible.'
}) => {
    const [showModal, setShowModal] = useState(false);

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