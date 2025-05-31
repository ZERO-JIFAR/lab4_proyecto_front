
import Filters from '../filters/filters';
import ProductControls from './ProductControls';
import styles from './productsPage.module.css';

const ProductsPage = () => {
    return (
        <div className={styles.page}>
            <Filters />
            <div className={styles.right}>
                <ProductControls />
                {/* Aquí va el listado de productos */}
            </div>
        </div>
    );
};

export default ProductsPage;
