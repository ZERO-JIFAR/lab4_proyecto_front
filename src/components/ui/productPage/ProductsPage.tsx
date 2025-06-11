import React, { useEffect, useState } from 'react';
import CardProduct from '../cardProduct/cardProduct';
import Filters from '../filters/filters';
import ProductControls from './ProductControls';
import styles from './productsPage.module.css';
import { getProductos } from '../../../http/productRequest';
import ModalAddProd from '../topbar/modals/modalAddProd';
import { IProduct } from '../../../types/IProduct';

// Asegúrate de que IProduct tenga image como opcional:
// export interface IProduct { ...; image?: string; ... }

const ProductsPage = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [showModal, setShowModal] = useState(false);

    const fetchProducts = async () => {
        const data = await getProductos();
        setProducts(data);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className={styles.page}>
            <Filters />
            <div className={styles.right}>
                <ProductControls />
                {/* Botón de agregar producto eliminado */}
                <div className={styles.productsGrid}>
                    {products.map((prod, idx) => (
                        <CardProduct
                            key={prod.id || idx}
                            title={prod.nombre}
                            price={prod.precio}
                            image={prod.image || '/images/zapatillas/default.png'}
                        />
                    ))}
                </div>
            </div>
            {/* ModalAddProd solo debe renderizarse si tienes lógica de admin, aquí lo dejamos comentado */}
            {/* {showModal && (
                <ModalAddProd
                    isOpen={showModal}
                    onClose={() => {
                        setShowModal(false);
                        fetchProducts();
                    }}
                />
            )} */}
        </div>
    );
};

export default ProductsPage;