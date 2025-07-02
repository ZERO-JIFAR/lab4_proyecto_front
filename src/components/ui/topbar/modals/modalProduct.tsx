import React, { useState } from 'react';
import styles from './modalProduct.module.css';
import { useCart } from '../../../../context/CartContext';
import { useAuth } from '../../../../context/AuthContext';
import { IProduct, IColorProducto, ITalleStock } from '../../../../types/IProduct';

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
    // Si el producto no existe o está vacío, no mostrar nada
    if (!product || !product.colores || product.colores.length === 0) {
        return (
            <div className={styles.overlay}>
                <div className={styles.modal}>
                    <button onClick={onClose} className={styles.closeBtn}>✖</button>
                    <div style={{ color: 'red', padding: 32 }}>Producto no disponible.</div>
                </div>
            </div>
        );
    }

    const [imageIndex, setImageIndex] = useState(0);
    const [selectedColorIdx, setSelectedColorIdx] = useState(0);
    const [selectedTalleId, setSelectedTalleId] = useState<number | null>(null);
    const { addToCart } = useCart();
    const { isLoggedIn } = useAuth();

    const colorList: IColorProducto[] = product.colores || [];
    const color = colorList[selectedColorIdx];

    // Imágenes del color seleccionado
    const images = [
        color?.imagenUrl,
        ...(Array.isArray(color?.imagenesAdicionales) ? color.imagenesAdicionales : [])
    ].filter(Boolean);

    // Talles disponibles para el color seleccionado
    const tallesDisponibles: ITalleStock[] = Array.isArray(color?.talles)
        ? color.talles.filter(ts => ts.stock > 0)
        : [];

    // Calcula el stock disponible por talle considerando el carrito
    const getStockDisponible = (talleId: number) => {
        const talleObj = color.talles.find(ts => ts.talleId === talleId);
        if (!talleObj) return 0;
        const enCarrito = cart.filter(
            item =>
                item.title === product.nombre &&
                item.color === color.color &&
                (item.size === talleObj.talleValor || item.size === talleObj.talleId)
        ).length;
        return talleObj.stock - enCarrito;
    };

    // Si no hay ningún talle disponible, no se puede comprar
    const productoAgotado = tallesDisponibles.length === 0;

    // Descuento real desde backend
    const hasDiscount = !!product.precioOriginal && product.precioOriginal > product.precio;
    const discount = hasDiscount
        ? Math.round(100 - (product.precio / (product.precioOriginal ?? product.precio)) * 100)
        : 0;
    const discountedPrice = hasDiscount
        ? Math.round(product.precio)
        : product.precio;

 const handleAddToCart = () => {
    if (!isLoggedIn) {
        alert("Debes iniciar sesión para agregar productos al carrito.");
        return;
    }
    if (!selectedTalleId) return alert("Selecciona un talle");
    const talleObj = color.talles.find(ts => ts.talleId === selectedTalleId);
    if (!talleObj || getStockDisponible(selectedTalleId) <= 0) {
        alert(
            `Stock insuficiente para el producto ${product.nombre} talle ${talleObj?.talleValor || talleObj?.talleId || 'Sin nombre'}`
        );
        return;
    }
    addToCart({
        id: product.id,
        title: product.nombre,
        price: discountedPrice,
        image: images[imageIndex],
        color: color.color,
        size: String(talleObj.talleValor || talleObj.talleId) // <-- Siempre string
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
                        <img src={images[imageIndex]} className={styles.mainImage} alt="Producto" />
                        <button onClick={nextImage} className={styles.arrow}>→</button>
                    </div>
                    <div className={styles.buySection}>
                        <button
                            className={styles.buyButton}
                            onClick={handleAddToCart}
                            disabled={productoAgotado || !selectedTalleId}
                        >
                            {productoAgotado ? "Sin stock" : "Agregar al Carrito"}
                        </button>
                        <div className={styles.price}>
                            {hasDiscount ? (
                                <>
                                    <span style={{ textDecoration: 'line-through', color: '#f44336', marginRight: 8 }}>
                                        ${product.precioOriginal}
                                    </span>
                                    <span style={{ color: '#4caf50', fontWeight: 'bold' }}>
                                        ${discountedPrice}
                                    </span>
                                    <span style={{ color: '#4caf50', fontWeight: 'bold', marginLeft: 8 }}>
                                        (-{discount}%)
                                    </span>
                                </>
                            ) : (
                                <>${product.precio}</>
                            )}
                        </div>
                        <div className={styles.productTitle}>{product.nombre}</div>
                    </div>
                </div>
                <div className={styles.right}>
                    <div className={styles.subSection}>
                        <div>• Colores:</div>
                        <div className={styles.colorList}>
                            {colorList.map((c, idx) => (
                                <button
                                    key={c.color + idx}
                                    className={`${styles.colorBtn} ${selectedColorIdx === idx ? styles.selected : ''}`}
                                    style={{ marginRight: 8 }}
                                    onClick={() => {
                                        setSelectedColorIdx(idx);
                                        setImageIndex(0);
                                        setSelectedTalleId(null);
                                    }}
                                >
                                    {c.color}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className={styles.subSection}>
                        <div>• Talles:</div>
                        <div className={styles.sizes}>
                            {tallesDisponibles.length === 0 && (
                                <span style={{ color: '#aaa' }}>Sin stock disponible</span>
                            )}
                            {tallesDisponibles.map((ts) => (
                                <button
                                    key={ts.talleId}
                                    className={`${styles.sizeBtn} ${selectedTalleId === ts.talleId ? styles.selected : ''}`}
                                    onClick={() => setSelectedTalleId(ts.talleId)}
                                    disabled={getStockDisponible(ts.talleId) <= 0}
                                >
                                    {ts.talleValor || ts.talleId} {getStockDisponible(ts.talleId) <= 2 && getStockDisponible(ts.talleId) > 0 ? `(${getStockDisponible(ts.talleId)} disponibles)` : ""}
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