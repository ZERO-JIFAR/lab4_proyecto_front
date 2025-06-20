// ProductModal.tsx
import React, { useState } from 'react';
import styles from './modalProduct.module.css';
import { useCart } from '../../../../context/CartContext';

interface ProductModalProps {
    images: string[];
    color: string;
    sizes: string[];
    title: string;
    price: number;
    type: string;
    category: string;
    description: string;
    onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
    images,
    color,
    sizes,
    title,
    price,
    type,
    category,
    description,
    onClose
    }) => {
    const [imageIndex, setImageIndex] = useState(0);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);

    const nextImage = () => setImageIndex((prev) => (prev + 1) % images.length);
    const prevImage = () => setImageIndex((prev) => (prev - 1 + images.length) % images.length);

    const { addToCart } = useCart();

    const handleAddToCart = () => {
        if (!selectedSize) return alert("Selecciona un talle");

        addToCart({
            title,
            price,
            image: images[imageIndex],
            color,
            size: selectedSize
        });

    onClose(); // opcional, para cerrar el modal
    };
    return (
        <div className={styles.overlay}>
        <div className={styles.modal}>
            <button onClick={onClose} className={styles.closeBtn}>✖</button>

            <div className={styles.left}>
            <div className={styles.thumbnails}>
                {images.map((img, i) => (
                <img
                    key={i}
                    src={img}
                    alt={`thumb-${i}`}
                    className={styles.thumb}
                    onClick={() => setImageIndex(i)}
                />
                ))}
            </div>
            <div className={styles.mainImageContainer}>
                <button onClick={prevImage} className={styles.arrow}>←</button>
                <img src={images[imageIndex]} className={styles.mainImage} />
                <button onClick={nextImage} className={styles.arrow}>→</button>
            </div>
            <div className={styles.buySection}>
                <button className={styles.buyButton} onClick={handleAddToCart}>Agregar al Carrito</button>
                <div className={styles.price}>${price}</div>
                <div className={styles.productTitle}>{title}</div>
            </div>
            </div>

            <div className={styles.right}>
            <div className={styles.subSection}>
                <div>• Color:</div>
                <div className={styles.colorList}>{color}</div>
            </div>
            <div className={styles.subSection}>
                <div>• Talles:</div>
              <div className={styles.sizes}>
    {sizes.map((sz) => (
        <button
            key={sz}
            className={`${styles.sizeBtn} ${selectedSize === sz ? styles.selected : ''}`}
            onClick={() => setSelectedSize(sz)}
        >
            {sz}
        </button>
    ))}
</div>
            </div>
            <div className={styles.subSection}>• TIPO: {type}</div>
            <div className={styles.subSection}>• CATEGORIA: {category}</div>
            <div className={styles.subSection}>
                • DESCRIPCION: <br />
                {description}
            </div>
            </div>
        </div>
        </div>
    );
};

export default ProductModal;
