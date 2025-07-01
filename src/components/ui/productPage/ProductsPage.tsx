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

    // Refresca productos después de editar/deshabilitar
    const fetchProducts = async () => {
        try {
            const productos = await getProductos();
            console.log('Productos recibidos:', productos); // DEPURACIÓN
            setProducts(Array.isArray(productos) ? productos : []);
        } catch (err) {
            console.error("Error al obtener productos:", err);
            setProducts([]);
        }
    };

    const fetchTiposCategorias = async () => {
        try {
            const tiposData = await getTipos();
            const categoriasData = await getCategorias();
            setTipos(tiposData);
            setCategorias(categoriasData);
        } catch (error) {
            console.error("Error al cargar tipos o categorías:", error);
            setTipos([]);
            setCategorias([]);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchTiposCategorias();
    }, []);

    const filteredProducts = Array.isArray(products)
        ? products.filter((prod) => {
            // DEPURACIÓN: log de cada producto y su estado eliminado
            console.log(`Producto: ${prod.nombre}, eliminado: ${prod.eliminado}`);
            // Solo mostrar productos eliminados si el admin marca el checkbox
            if ((!isAdmin && prod.eliminado) || (isAdmin && !showEliminados && prod.eliminado)) {
                return false;
            }

            // Evita error si prod.nombre es null o undefined
            const nombre = prod.nombre ? prod.nombre.toLowerCase() : "";
            const matchesSearch = nombre.includes(search.toLowerCase());

            const matchesTipo = selectedTipo === "" || (prod.categoria?.tipo?.id === selectedTipo);
            const matchesCategoria = selectedCategoria === "" || (prod.categoria?.id === selectedCategoria);

            const matchesTalle =
                selectedTalle === "" ||
                prod.colores?.some(color =>
                    color.talles?.some(tp =>
                        tp.talleValor === selectedTalle && tp.stock > 0
                    )
                );

            const matchesColor =
                selectedColor === "" ||
                prod.colores?.some(c =>
                    c.color && c.color.toLowerCase() === selectedColor.toLowerCase()
                );

            const matchesMarca = selectedMarca === "" || (prod.marca?.toLowerCase() === selectedMarca.toLowerCase());
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
        })
        : [];

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sort === 'precioAsc') return a.precio - b.precio;
        if (sort === 'precioDesc') return b.precio - a.precio;
        return 0;
    });

    const categoriasFiltradas = selectedTipo === ""
        ? categorias
        : categorias.filter(cat => cat.tipo?.id === selectedTipo);

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
                    {isAdmin && (
                        <div className={styles.filtElim}>
                            <label style={{ marginLeft: '10px' }}>
                                <input
                                    type="checkbox"
                                    checked={showEliminados}
                                    onChange={e => setShowEliminados(e.target.checked)}
                                />
                                Mostrar productos eliminados
                            </label>
                        </div>
                    )}
                    {sortedProducts.length === 0 ? (
                        <div className={styles.noEncontrado}>
                            Ningún producto encontrado
                        </div>
                    ) : (
                        sortedProducts.map((prod, idx) =>
                            isAdmin ? (
                                <CardAdminProduct
                                    key={prod.id || idx}
                                    product={prod}
                                    onUpdate={fetchProducts}
                                />
                            ) : (
                                <CardProduct key={prod.id || idx} product={prod} />
                            )
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;