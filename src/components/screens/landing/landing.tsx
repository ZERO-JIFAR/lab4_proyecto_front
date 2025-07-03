import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Topbar from '../../ui/topbar/topbar';
import Footer from '../../ui/footer/footer';
import styles from './landing.module.css';
import { FaChevronRight, FaChevronLeft } from "react-icons/fa6";
import { getProductos } from '../../../http/productRequest';
import { IProduct } from '../../../types/IProduct';
import ProductModal from '../../ui/topbar/modals/modalProduct';
import { useCart } from '../../../context/CartContext';

const NUM_FEATURED_VISIBLE = 3;
const NUM_FEATURED_TOTAL = 10;
const NUM_CATEGORIES = 2;
const NUM_CATEGORY_PRODUCTS = 3;

function getRandomElements<T>(arr: T[], n: number): T[] {
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

        // FILTRAR SOLO HABILITADOS
        const enabled = normalized.filter((p: any) => p.eliminado !== true);

        setProducts(enabled);

        // Shuffle for randomness and pick featured
        const shuffled = [...enabled].sort(() => Math.random() - 0.5);
        setFeatured(shuffled.slice(0, NUM_FEATURED_TOTAL));

        // Obtener todas las categorías únicas presentes en los productos
        const allCategories = Array.from(
          new Set(
            enabled
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
          const prods = enabled.filter(
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

  const handlePrev = () => {
    setCarouselIndex((prev) =>
      featured.length <= NUM_FEATURED_VISIBLE
        ? 0
        : (prev - 1 + featured.length) % featured.length
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

  // Utilidad para calcular descuento
  const getDiscountData = (product: IProduct) => {
    if (product.precioOriginal && product.precioOriginal > product.precio) {
      const discount = Math.round(100 - (product.precio / product.precioOriginal) * 100);
      return {
        hasDiscount: true,
        discount,
        discountedPrice: Math.round(product.precio),
      };
    }
    return {
      hasDiscount: false,
      discount: 0,
      discountedPrice: product.precio,
    };
  };

  return (
    <div className={styles.landingContainerUnico}>
      <Topbar />

      <div className={styles.landingMainUnico}>
        <h1 className={styles.landingTitleUnico}><strong>Strike</strong></h1>
        <p className={styles.landingSubtitleUnico}><strong>Alcanza tus sueños</strong></p>

        <hr className={styles.landingDividerUnico} />

        <div className={styles.landingSectionTitleUnico}>Productos Destacados</div>

        <div className={styles.carouselContainerUnico}>
          {featured.length > NUM_FEATURED_VISIBLE && (
            <button className={styles.carouselButtonUnico} onClick={handlePrev}>
              <h1><FaChevronLeft /></h1>
            </button>
          )}
          <div className={styles.landingProductsUnico}>
            {visibleFeatured.map((prod, idx) => {
              const mainImage = prod.imagenUrl || (prod.imagenesAdicionales?.[0]) || '/images/zapatillas/default.png';
              const { hasDiscount, discount } = getDiscountData(prod);
              return (
                <div key={prod.id || idx} style={{ position: 'relative', display: 'inline-block' }}>
                  <img
                    src={mainImage}
                    alt={prod.nombre}
                    className={styles.landingProductImageUnico}
                    title={prod.nombre}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleOpenModal(prod)}
                  />
                  {hasDiscount && (
                    <span
                      style={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        background: '#f44336',
                        color: '#fff',
                        borderRadius: 6,
                        padding: '2px 8px',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        zIndex: 2,
                        boxShadow: '0 2px 8px #0003',
                        letterSpacing: '1px'
                      }}
                    >
                      -{discount}%
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          {featured.length > NUM_FEATURED_VISIBLE && (
            <button className={styles.carouselButtonUnico} onClick={handleNext}>
              <h1><FaChevronRight /></h1>
            </button>
          )}
        </div>

        <div className={styles.landingButtonWrapperUnico}>
          <Link to="/SearchItem">
            <button className={styles.landingBuyButtonUnico}>Todos los productos</button>
          </Link>
        </div>

        <hr className={styles.landingDividerUnico} />

        <div className={styles.landingCategoryGridUnico}>
          {randomCategories.length === 0 && (
            <div className={styles.landingCategoryColumnUnico}>
              <h3>Sin categorías disponibles</h3>
              <p>No hay productos con categorías cargadas en la base de datos.</p>
            </div>
          )}
          {randomCategories.map(category => (
            <div key={category} className={styles.landingCategoryColumnUnico}>
              <h3>{category}</h3>
              {(!productsByCategory[category] || productsByCategory[category].length === 0) && (
                <p>No hay productos de esta categoría.</p>
              )}
              {productsByCategory[category]?.map((product, index) => {
                const mainImage = product.imagenUrl || (product.imagenesAdicionales?.[0]) || '/images/zapatillas/default.png';
                const { hasDiscount, discount, discountedPrice } = getDiscountData(product);
                return (
                  <div key={product.id || index} className={styles.landingProductCardUnico} style={{ position: 'relative' }}>
                    <div style={{ position: 'relative' }}>
                      <img
                        src={mainImage}
                        alt={product.nombre}
                        className={styles.cardImageUnico}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleOpenModal(product)}
                      />
                      {hasDiscount && (
                        <span
                          style={{
                            position: 'absolute',
                            top: 8,
                            left: 8,
                            background: '#f44336',
                            color: '#fff',
                            borderRadius: 6,
                            padding: '2px 8px',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            zIndex: 2,
                            boxShadow: '0 2px 8px #0003',
                            letterSpacing: '1px'
                          }}
                        >
                          -{discount}%
                        </span>
                      )}
                    </div>
                    <div className={styles.cardContentUnico}>
                      <h4>{product.nombre}</h4>
                      <p>{product.descripcion || 'Sin descripción.'}</p>
                      <div className={styles.cardPriceWrapperUnico}>
                        {hasDiscount ? (
                          <>
                            <span style={{ textDecoration: 'line-through', color: '#f44336', marginRight: 8 }}>
                              ${product.precioOriginal}
                            </span>
                            <span style={{ color: '#4caf50', fontWeight: 'bold', marginRight: 8 }}>
                              ${discountedPrice}
                            </span>
                          </>
                        ) : (
                          <span className={styles.cardPriceUnico}>${product.precio}</span>
                        )}
                        <button
                          className={styles.cardButtonUnico}
                          onClick={() => handleOpenModal(product)}
                        >
                          Comprar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <h1 className={styles.landingMoreUnico}><strong>¿Quiénes somos?</strong></h1>
        <p className={styles.landingMoreTextUnico}>
          Somos una tienda de zapatillas y ropa deportiva con más de 10 años de experiencia en el mercado. 
          Nos especializamos en ofrecer productos de alta calidad y las últimas tendencias en moda deportiva. 
          Nuestro objetivo es brindar a nuestros clientes una experiencia de compra excepcional, con un servicio al cliente amigable y eficiente.
        </p>
      </div>

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