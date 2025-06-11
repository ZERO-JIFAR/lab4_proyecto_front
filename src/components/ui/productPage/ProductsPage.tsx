import React, { useEffect, useState } from 'react';
import CardProduct from '../cardProduct/cardProduct';
import Filters from '../filters/filters';
import ProductControls from './ProductControls';
import styles from './productsPage.module.css';
import { getProductos } from '../../../http/productRequest';
import { getTipos } from '../../../http/typeRequest';
import { getCategorias } from '../../../http/categoryRequest';
import { IProduct } from '../../../types/IProduct';
import { ITipo } from '../../../types/IType';
import { ICategory } from '../../../types/ICategory';

const ProductsPage = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [sort, setSort] = useState<string>('relevantes');
    const [search, setSearch] = useState<string>('');
    const [tipos, setTipos] = useState<ITipo[]>([]);
    const [categorias, setCategorias] = useState<ICategory[]>([]);
    const [selectedTipo, setSelectedTipo] = useState<number | "">("");
    const [selectedCategoria, setSelectedCategoria] = useState<number | "">("");
    const [selectedTalle, setSelectedTalle] = useState<string>("");

    const fetchProducts = async () => {
        const data = await getProductos();
        setProducts(data);
    };

    const fetchTiposCategorias = async () => {
        setTipos(await getTipos());
        setCategorias(await getCategorias());
    };

    useEffect(() => {
        fetchProducts();
        fetchTiposCategorias();
    }, []);

    // Filtrar productos por texto, tipo, categoría y talle
    const filteredProducts = products.filter((prod) => {
        const matchesSearch = prod.nombre.toLowerCase().includes(search.toLowerCase());
        const matchesTipo = selectedTipo === "" || prod.categoria.idTipo.id === selectedTipo;
        const matchesCategoria = selectedCategoria === "" || prod.categoria.id === selectedCategoria;
        const matchesTalle =
            selectedTalle === "" ||
            (prod.talles && prod.talles.some(tp => tp.talle.nombre === selectedTalle));
        return matchesSearch && matchesTipo && matchesCategoria && matchesTalle;
    });

    // Ordenar productos según el filtro seleccionado
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sort === 'precioAsc') return a.precio - b.precio;
        if (sort === 'precioDesc') return b.precio - a.precio;
        return 0; // "relevantes" o cualquier otro valor, no ordenar
    });

    // Categorías filtradas por tipo seleccionado
    const categoriasFiltradas = selectedTipo === ""
        ? categorias
        : categorias.filter(cat => cat.idTipo.id === selectedTipo);

    return (
        <div className={styles.page}>
            <Filters
                tipos={tipos}
                categorias={categoriasFiltradas}
                selectedTipo={selectedTipo}
                setSelectedTipo={setSelectedTipo}
                selectedCategoria={selectedCategoria}
                setSelectedCategoria={setSelectedCategoria}
                selectedTalle={selectedTalle}
                setSelectedTalle={setSelectedTalle}
            />
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