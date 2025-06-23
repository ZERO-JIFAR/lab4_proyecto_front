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
import CardAdminProduct from "../cardProduct/cardAdminProducts";
import { useAuth } from "../../../context/AuthContext";

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
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const { isAdmin } = useAuth();
    const [selectedWaistType, setSelectedWaistType] = useState<number | "">("");
    const [showEliminados, setShowEliminados] = useState(false);

    // Extiende el tipo para aceptar tallesProducto temporalmente
    type ProductWithTallesProducto = IProduct & { tallesProducto?: any[] };

    const fetchProducts = async () => {
        const data = await getProductos();
        const normalizados = (data as ProductWithTallesProducto[])
            .map(prod => ({
                ...prod,
                talles: prod.talles ?? prod.tallesProducto ?? []
            }));
        setProducts(normalizados);
    };

    const fetchTiposCategorias = async () => {
        setTipos(await getTipos());
        setCategorias(await getCategorias());
    };

    useEffect(() => {
        fetchProducts();
        fetchTiposCategorias();
    }, []);

    // Filtrar productos por texto, tipo, categoría, talle, color, marca y eliminado
    const filteredProducts = products.filter((prod) => {
        if (isAdmin && !showEliminados && prod.eliminado) return false;

        const matchesSearch = prod.nombre.toLowerCase().includes(search.toLowerCase());
        const matchesTipo = selectedTipo === "" || (prod.categoria && prod.categoria.tipo && prod.categoria.tipo.id === selectedTipo);
        const matchesCategoria = selectedCategoria === "" || (prod.categoria && prod.categoria.id === selectedCategoria);

        // FILTRO CORRECTO POR TALLE: compara por nombre y valor, y solo muestra productos que tengan ese talle
        const matchesTalle =
            selectedTalle === "" ||
            (
                prod.talles &&
                prod.talles.some(tp =>
                    (tp.talle.nombre === selectedTalle || tp.talle.valor === selectedTalle)
                    && tp.stock > 0 // Solo si tiene stock
                )
            );

        const matchesColor = selectedColor === "" || (prod.color && prod.color.toLowerCase() === selectedColor.toLowerCase());
        const matchesMarca = selectedMarca === "" || (prod.marca && prod.marca.toLowerCase() === selectedMarca.toLowerCase());
        const matchesMinPrice = minPrice === '' || prod.precio >= Number(minPrice);
        const matchesMaxPrice = maxPrice === '' || prod.precio <= Number(maxPrice);

        return (
            matchesSearch &&
            matchesTipo &&
            matchesCategoria &&
            matchesTalle &&
            matchesColor &&
            matchesMarca &&
            matchesMinPrice &&
            matchesMaxPrice
        );
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
                selectedWaistType={selectedWaistType}
                setSelectedWaistType={setSelectedWaistType}
                selectedTalle={selectedTalle}
                setSelectedTalle={setSelectedTalle}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                selectedMarca={selectedMarca}
                setSelectedMarca={setSelectedMarca}
                colors={COLORS}
                marcas={MARCAS}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
            />
            <div className={styles.right}>
                <ProductControls
                    total={filteredProducts.length}
                    onSortChange={setSort}
                    search={search}
                    onSearchChange={setSearch}
                />
                <div className={isAdmin ? styles.adminList : styles.productsGrid}>

                    {/* Filtro solo visible para admin */}
                    {isAdmin && (
                        <div className={styles.filtElim}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={showEliminados}
                                    onChange={e => setShowEliminados(e.target.checked)}
                                />
                                Mostrar productos eliminados
                            </label>
                        </div>
                    )}

                    {sortedProducts.map((prod, idx) =>
                        isAdmin ? (
                            <CardAdminProduct key={prod.id || idx} product={prod} />
                        ) : (
                            <CardProduct key={prod.id || idx} product={prod} />
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;