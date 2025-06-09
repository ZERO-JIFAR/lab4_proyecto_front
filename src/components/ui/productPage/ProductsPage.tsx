import CardProduct from '../cardProduct/cardProduct';
import Filters from '../filters/filters';
import ProductControls from './ProductControls';
import styles from './productsPage.module.css';

{/* Borrar */}
const mockProducts = [
    {
        title: 'Artículo 1',
        price: 39.99,
        image: '/imgs/shoe1.png'
    },
    {
        title: 'Artículo 2',
        price: 29.99,
        image: '/imgs/shoe2.png'
    },
    {
        title: 'Artículo 3',
        price: 24.99,
        oldPrice: 39.99,
        image: '/imgs/shoe3.png'
    },
    {
        title: 'Artículo 4',
        price: 35.99,
        image: '/imgs/shoe4.png'
    },
    {
        title: 'Artículo 5',
        price: 41.99,
        image: '/imgs/shoe5.png'
    },
    {
        title: 'Artículo 6',
        price: 21.04,
        oldPrice: 29.99,
        image: '/imgs/shoe6.png'
    },
];

const ProductsPage = () => {
    return (
        <div className={styles.page}>
            <Filters />
            <div className={styles.right}>
                <ProductControls />
                <div className={styles.productsGrid}>
                    {mockProducts.map((prod, idx) => (
                        <CardProduct
                            key={idx}
                            title={prod.title}
                            price={prod.price}
                            oldPrice={prod.oldPrice}
                            image={prod.image}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;
