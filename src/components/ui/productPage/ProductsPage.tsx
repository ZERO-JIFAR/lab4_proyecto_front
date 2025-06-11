import React, { useEffect, useState } from 'react';
import CardProduct from '../cardProduct/cardProduct';
import Filters from '../filters/filters';
import ProductControls from './ProductControls';
import styles from './productsPage.module.css';
import { getProductos } from '../../../http/productRequest';
import ModalAddProd from '../topbar/modals/modalAddProd';
import { IProduct } from '../../../types/IProduct';

const ProductsPage = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [sort, setSort] = useState<string>('relevantes');
    const [search, setSearch] = useState<string>('');
    const [showModal, setShowModal] = useState(false);

    const fetchProducts = async () => {
        const data = await getProductos();
        setProducts(data);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Filtrar productos por texto
    const filteredProducts = products.filter((prod) =>
        prod.nombre.toLowerCase().includes(search.toLowerCase())
    );

    // Ordenar productos según el filtro seleccionado
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sort === 'precioAsc') return a.precio - b.precio;
        if (sort === 'precioDesc') return b.precio - a.precio;
        return 0; // "relevantes" o cualquier otro valor, no ordenar
    });

    return (
        <div className={styles.page}>
            <Filters />
            <div className={styles.right}>
                <ProductControls
                    total={filteredProducts.length}
                    onSortChange={setSort}
                    search={search}
                    onSearchChange={setSearch}
                />
                <div className={styles.productsGrid}>
                    {sortedProducts.map((prod, idx) => (
                        <CardProduct
                            key={prod.id || idx}
                            title={prod.nombre}
                            price={prod.precio}
                            image={prod.image || '/images/zapatillas/default.png'}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;