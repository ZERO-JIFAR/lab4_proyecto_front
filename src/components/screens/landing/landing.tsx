import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Topbar from '../../ui/topbar/topbar';
import Footer from '../../ui/footer/footer';
import styles from './landing.module.css';
import { FaChevronRight } from "react-icons/fa6";
import { getProductos } from '../../../http/productRequest';
import { IProduct } from '../../../types/IProduct';
import ProductModal from '../../ui/topbar/modals/modalProduct';
import { useCart } from '../../../context/CartContext';

const NUM_FEATURED_VISIBLE = 3;
const NUM_FEATURED_TOTAL = 10;
const NUM_CATEGORIES = 2;
const NUM_CATEGORY_PRODUCTS = 3;

function getRandomElements<T>(arr: T[], n: number): T[] {
  if (arr.length <= n) return [...arr];
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

const Landing = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [featured, setFeatured] = useState<IProduct[]>([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [randomCategories, setRandomCategories] = useState<string[]>([]);
  const [productsByCategory, setProductsByCategory] = useState<Record<string, IProduct[]>>({});
  const [showModal, setShowModal] = useState(false);
  const [modalProduct, setModalProduct] = useState<IProduct | null>(null);

  const { cart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const all = await getProductos();
        // Normaliza los productos para que siempre tengan el campo talles
        const normalized = all.map((prod: any) => ({
          ...prod,
          talles: prod.talles ?? prod.tallesProducto ?? []
        }));
        setProducts(normalized);

        // Shuffle for randomness and pick featured
        const shuffled = [...normalized].sort(() => Math.random() - 0.5);
        setFeatured(shuffled.slice(0, NUM_FEATURED_TOTAL));

        // Obtener todas las categorías únicas presentes en los productos
        const allCategories = Array.from(
          new Set(
            normalized
              .map(p => p.categoria?.nombre)
              .filter((x): x is string => Boolean(x))
          )
        );

        // Elegir 2 categorías aleatorias (si hay)
        const selectedCategories = getRandomElements(allCategories, NUM_CATEGORIES);
        setRandomCategories(selectedCategories);

        // Para cada categoría, elegir 3 productos aleatorios de esa categoría
        const byCategory: Record<string, IProduct[]> = {};
        selectedCategories.forEach(category => {
          const prods = normalized.filter(
            p => p.categoria?.nombre === category
          );
          byCategory[category] = getRandomElements(prods, NUM_CATEGORY_PRODUCTS);
        });
        setProductsByCategory(byCategory);

      } catch (e) {
        setProducts([]);
        setFeatured([]);
        setRandomCategories([]);
        setProductsByCategory({});
      }
    };
    fetchProducts();
  }, []);

  const handleNext = () => {
    setCarouselIndex((prev) =>
      featured.length <= NUM_FEATURED_VISIBLE
        ? 0
        : (prev + 1) % featured.length
    );
  };

  const visibleFeatured =
    featured.length > 0
      ? Array.from({ length: Math.min(NUM_FEATURED_VISIBLE, featured.length) }, (_, i) =>
          featured[(carouselIndex + i) % featured.length]
        )
      : [];

  // Abre el modal con el producto seleccionado
  const handleOpenModal = (product: IProduct) => {
    setModalProduct(product);
    setShowModal(true);
  };

  return (
    <div className={styles.landingContainer}>
      <Topbar />

      <div className={styles.landingMain}>
        <h1 className={styles.landingTitle}><strong>Nike</strong></h1>
        <p className={styles.landingSubtitle}>Just do it!</p>

        <hr className={styles.landingDivider} />

        <div className={styles.landingSectionTitle}>Productos Destacados</div>

        <div className={styles.carouselContainer}>
          <div className={styles.landingProducts}>
            {visibleFeatured.map((prod, idx) => (
              <img
                key={prod.id || idx}
                src={prod.imagenUrl || (prod.imagenesAdicionales?.[0]) || '/images/zapatillas/default.png'}
                alt={prod.nombre}
                className={styles.landingProductImage}
                title={prod.nombre}
                style={{ cursor: 'pointer' }}
                onClick={() => handleOpenModal(prod)}
              />
            ))}
          </div>
          {featured.length > NUM_FEATURED_VISIBLE && (
            <button className={styles.carouselButton} onClick={handleNext}>
              <h1><FaChevronRight /></h1>
            </button>
          )}
        </div>

        <div className={styles.landingButtonWrapper}>
          <Link to="/SearchItem">
            <button className={styles.landingBuyButton}>¡Compre Ahora!</button>
          </Link>
        </div>

        <hr className={styles.landingDivider} />

        <div className={styles.landingCategoryGrid}>
          {randomCategories.length === 0 && (
            <div className={styles.landingCategoryColumn}>
              <h3>Sin categorías disponibles</h3>
              <p>No hay productos con categorías cargadas en la base de datos.</p>
            </div>
          )}
          {randomCategories.map(category => (
            <div key={category} className={styles.landingCategoryColumn}>
              <h3>{category}</h3>
              {(!productsByCategory[category] || productsByCategory[category].length === 0) && (
                <p>No hay productos de esta categoría.</p>
              )}
              {productsByCategory[category]?.map((product, index) => (
                <div key={product.id || index} className={styles.landingProductCard}>
                  <img
                    src={product.imagenUrl || (product.imagenesAdicionales?.[0]) || '/images/zapatillas/default.png'}
                    alt={product.nombre}
                    className={styles.cardImage}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleOpenModal(product)}
                  />
                  <div className={styles.cardContent}>
                    <h4>{product.nombre}</h4>
                    <p>{product.descripcion || 'Sin descripción.'}</p>
                    <div className={styles.cardPriceWrapper}>
                      <span className={styles.cardPrice}>${product.precio}</span>
                      <button
                        className={styles.cardButton}
                        onClick={() => handleOpenModal(product)}
                      >
                        Comprar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <h1 className={styles.landingMore}><strong>¿Quiénes somos?</strong></h1>
      <p className={styles.landingMoreText}>
        Somos una tienda de zapatillas y ropa deportiva con más de 10 años de experiencia en el mercado. 
        Nos especializamos en ofrecer productos de alta calidad y las últimas tendencias en moda deportiva. 
        Nuestro objetivo es brindar a nuestros clientes una experiencia de compra excepcional, con un servicio al cliente amigable y eficiente.
      </p>

      <Footer />

      {/* Modal de vista previa */}
      {showModal && modalProduct && (
        <ProductModal
          product={modalProduct}
          cart={cart}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Landing;