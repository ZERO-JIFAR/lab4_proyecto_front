import Footer from '../../ui/footer/footer';
import styles from './searchItem.module.css';
import Topbar from '../../ui/topbar/topbar';
import ProductsPage from '../../ui/productPage/ProductsPage';


const SearchItem = () => {
  return (
    <div className={styles.container}>
      <Topbar />
      <ProductsPage />
      <section className={styles.results}>
      </section>
      <Footer />
    </div>
  );
};

export default SearchItem;
