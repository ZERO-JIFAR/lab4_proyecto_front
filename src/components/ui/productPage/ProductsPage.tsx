import React, { useEffect, useState } from "react";
import styles from "./productsPage.module.css";
import CardProduct from "../cardProduct/cardProduct";
import Filters from "../filters/filters";
import ProductControls from "./ProductControls";
import { getProductos } from "../../../http/productRequest";
import { getTipos } from "../../../http/typeRequest";
import { getCategorias } from "../../../http/categoryRequest";
import { IProduct } from "../../../types/IProduct";
import { ITipo } from "../../../types/IType";
import { ICategory } from "../../../types/ICategory";

const COLORS = ["Negro", "Blanco", "Rojo", "Azul", "Verde", "Gris", "Otros"];
const MARCAS = ["Nike", "Adidas", "Puma", "Reebok", "Vans", "Fila", "Otros"];

const ProductsPage = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [sort, setSort] = useState<string>('relevantes');
    const [search, setSearch] = useState<string>('');
    const [tipos, setTipos] = useState<ITipo[]>([]);
    const [categorias, setCategorias] = useState<ICategory[]>([]);
    const [selectedTipo, setSelectedTipo] = useState<number | "">("");
    const [selectedCategoria, setSelectedCategoria] = useState<number | "">("");
    const [selectedTalle, setSelectedTalle] = useState<string>("");
    const [selectedColor, setSelectedColor] = useState<string>("");
    const [selectedMarca, setSelectedMarca] = useState<string>("");

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

    // Filtrar productos por texto, tipo, categoría, talle, color y marca
    const filteredProducts = products.filter((prod) => {
        const matchesSearch = prod.nombre.toLowerCase().includes(search.toLowerCase());
        const matchesTipo = selectedTipo === "" || (prod.categoria && prod.categoria.tipo && prod.categoria.tipo.id === selectedTipo);
        const matchesCategoria = selectedCategoria === "" || (prod.categoria && prod.categoria.id === selectedCategoria);
        const matchesTalle =
            selectedTalle === "" ||
            (prod.talles && prod.talles.some(tp => tp.talle.nombre === selectedTalle));
        const matchesColor = selectedColor === "" || (prod.color && prod.color.toLowerCase() === selectedColor.toLowerCase());
        const matchesMarca = selectedMarca === "" || (prod.marca && prod.marca.toLowerCase() === selectedMarca.toLowerCase());
        return matchesSearch && matchesTipo && matchesCategoria && matchesTalle && matchesColor && matchesMarca;
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
        : categorias.filter(cat => cat.tipo && cat.tipo.id === selectedTipo);

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
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                selectedMarca={selectedMarca}
                setSelectedMarca={setSelectedMarca}
                colors={COLORS}
                marcas={MARCAS}
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
                            image={prod.imagenUrl || '/images/zapatillas/default.png'}
                            // PASA LOS DATOS REALES:
                            type={prod.categoria?.tipo?.nombre || ''}
                            category={prod.categoria?.nombre || ''}
                            description={prod.descripcion || ''}
                            sizes={prod.talles?.map(tp => tp.talle.nombre) || []}
                            colors={prod.color ? [prod.color] : []}
                            images={prod.imagenUrl ? [prod.imagenUrl] : []}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;