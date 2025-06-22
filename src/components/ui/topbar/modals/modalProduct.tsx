import React, { useState } from 'react';
import styles from './modalProduct.module.css';
import { useCart } from '../../../../context/CartContext';
import { IProduct } from '../../../../types/IProduct';

interface ProductModalProps {
    product: IProduct;
    cart: any[];
    onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
    product,
    cart,
    onClose
}) => {
    const [imageIndex, setImageIndex] = useState(0);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const { addToCart } = useCart();

    // Calcula el stock disponible por talle considerando el carrito
    const getStockDisponible = (talleValor: string) => {
        const talleObj = product.talles.find(tp => (tp.talle.valor || tp.talle.nombre) === talleValor);
        if (!talleObj) return 0;
        const enCarrito = cart.filter(
            item => item.title === product.nombre && item.size === talleValor
        ).length;
        return talleObj.stock - enCarrito;
    };

    // Solo muestra talles con stock disponible
    const tallesDisponibles = product.talles
        ? product.talles
            .filter(tp => getStockDisponible(tp.talle.valor ? tp.talle.valor : tp.talle.nombre) > 0)
            .map(tp => tp.talle.valor ? tp.talle.valor : tp.talle.nombre)
        : [];

    // Si no hay ningún talle disponible, no se puede comprar
    const productoAgotado = !tallesDisponibles.length;

    const images = [
        product.imagenUrl,
        ...(Array.isArray(product.imagenesAdicionales) ? product.imagenesAdicionales : [])
    ].filter(Boolean);

    const handleAddToCart = () => {
        if (!selectedSize) return alert("Selecciona un talle");
        if (getStockDisponible(selectedSize) <= 0) {
            alert("No hay stock disponible para ese talle");
            return;
        }
        addToCart({
            title: product.nombre,
            price: product.precio,
            image: images[imageIndex],
            color: product.color || '',
            size: selectedSize
        });
        onClose();
    };

    const nextImage = () => setImageIndex((prev) => (prev + 1) % images.length);
    const prevImage = () => setImageIndex((prev) => (prev - 1 + images.length) % images.length);

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
                        <button
                            className={styles.buyButton}
                            onClick={handleAddToCart}
                            disabled={productoAgotado || !selectedSize}
                        >
                            {productoAgotado ? "Sin stock" : "Agregar al Carrito"}
                        </button>
                        <div className={styles.price}>${product.precio}</div>
                        <div className={styles.productTitle}>{product.nombre}</div>
                    </div>
                </div>
                <div className={styles.right}>
                    <div className={styles.subSection}>
                        <div>• Color:</div>
                        <div className={styles.colorList}>{product.color || 'N/A'}</div>
                    </div>
                    <div className={styles.subSection}>
                        <div>• Talles:</div>
                        <div className={styles.sizes}>
                            {tallesDisponibles.length === 0 && (
                                <span style={{ color: '#aaa' }}>Sin stock disponible</span>
                            )}
                            {tallesDisponibles.map((sz) => (
                                <button
                                    key={sz}
                                    className={`${styles.sizeBtn} ${selectedSize === sz ? styles.selected : ''}`}
                                    onClick={() => setSelectedSize(sz)}
                                    disabled={getStockDisponible(sz) <= 0}
                                >
                                    {sz} {getStockDisponible(sz) <= 2 && getStockDisponible(sz) > 0 ? `(${getStockDisponible(sz)} disponibles)` : ""}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className={styles.subSection}>• TIPO: {product.categoria?.tipo?.nombre || ''}</div>
                    <div className={styles.subSection}>• CATEGORIA: {product.categoria?.nombre || ''}</div>
                    <div className={styles.subSection}>
                        • DESCRIPCION: <br />
                        {product.descripcion}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;