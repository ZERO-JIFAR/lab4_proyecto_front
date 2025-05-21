import React from 'react';
import FiltroLateral from '../../ui/filters/filters';
import Footer from '../../ui/footer/footer';
import styles from './searchItem.module.css';
import Topbar from '../../ui/topbar/topbar';


const SearchItem = () => {
  return (
    <div className={styles.container}>
      <Topbar />
      <FiltroLateral />
      <section className={styles.results}>
      </section>
      <Footer />
    </div>
  );
};

export default SearchItem;
