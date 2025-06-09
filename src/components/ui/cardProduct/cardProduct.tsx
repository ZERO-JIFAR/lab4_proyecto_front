import React from 'react';
import styles from './cardProduct.module.css';

interface CardProductProps {
    title: string;
    price: number;
    image: string;
}

const CardProduct: React.FC<CardProductProps> = ({ title, price, image }) => {
    return (
        <div className={styles.card}>
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
    );
};

export default CardProduct;
