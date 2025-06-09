import React from 'react';
import styles from './cardProduct.module.css';

interface CardProductProps {
    title: string;
    price: number;
    oldPrice?: number; // si hay precio anterior, mostramos "OFERTA"
    image: string;
}

const CardProduct: React.FC<CardProductProps> = ({ title, price, oldPrice, image }) => {
    const hasDiscount = oldPrice && oldPrice > price;

    return (
        <div className={styles.card}>
            <div className={styles.imageContainer}>
                {hasDiscount && <span className={styles.offerBadge}>OFERTA</span>}
                <img src={image} alt={title} className={styles.image} />
            </div>
            <div className={styles.content}>
                <p className={styles.title}>{title}</p>
                <p className={styles.price}>
                {hasDiscount && <span className={styles.oldPrice}>${oldPrice}</span>}
                <span>${price}</span>
                </p>
            </div>
        </div>
    );
};

export default CardProduct;
