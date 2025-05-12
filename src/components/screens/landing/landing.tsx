import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Topbar from '../../ui/topbar/topbar';
import Footer from '../../ui/footer/footer';
import styles from './landing.module.css';

const categories = [
  {
    name: 'Calzado',
    products: [
      { title: 'Zapatillas de running', image: '/images/zapatillas/Zapatillas1.webp', price: '$69.99' },
      { title: 'Botín de fútbol', image: '/images/botin1.png', price: '$79.99' },
      { title: 'Zapatilla clásica', image: '/images/zapatilla2.png', price: '$79.99' },
    ],
  },
  {
    name: 'Ropa',
    products: [
      { title: 'Buzo hoodie', image: '/images/zapatilla3.png', price: '$49.99' },
      { title: 'Remera polo', image: '/images/botin2.png', price: '$29.99' },
      { title: 'Pantalón de jean', image: '/images/zapatilla4.png', price: '$59.99' },
    ],
  },
];

const featuredImages = [
  '/images/zapatillas/Zapatillas1.webp',
  '/images/zapatillas/Zapatillas2.jpeg',
  '/images/zapatillas/Zapatillas3.webp',
  '/images/zapatillas/Zapatillas4.webp',
];

const Landing = () => {
  const [startIndex, setStartIndex] = useState(0);

  const handleNext = () => {
    setStartIndex((prevIndex) => (prevIndex + 1) % featuredImages.length);
  };

  const visibleImages = [
    featuredImages[startIndex],
    featuredImages[(startIndex + 1) % featuredImages.length],
    featuredImages[(startIndex + 2) % featuredImages.length],
  ];

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
            {visibleImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Zapatilla ${idx + 1}`}
                className={styles.landingProductImage}
              />
            ))}
          </div>
          <button className={styles.carouselButton} onClick={handleNext}>→</button>
        </div>

        <div className={styles.landingButtonWrapper}>
          {/* Uso de Link para redirigir al hacer clic */}
          <Link to="/SearchItem">
            <button className={styles.landingBuyButton}>¡Compre Ahora!</button>
          </Link>
        </div>

        <hr className={styles.landingDivider} />

        <div className={styles.landingCategoryGrid}>
          {categories.map((cat) => (
            <div key={cat.name} className={styles.landingCategoryColumn}>
              <h3>{cat.name}</h3>
              {cat.products.map((product, index) => (
                <div key={index} className={styles.landingProductCard}>
                  <img src={product.image} alt={product.title} className={styles.cardImage} />
                  <div className={styles.cardContent}>
                    <h4>{product.title}</h4>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ut dignissim erat.</p>
                    <div className={styles.cardPriceWrapper}>
                      <span className={styles.cardPrice}>{product.price}</span>
                      <button className={styles.cardButton}>Comprar</button>
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
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>

      <Footer />
    </div>
  );
};

export default Landing;
