import styles from './productControls.module.css';
import { useState } from 'react';

const ProductControls = () => {
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('fechaDesc');

    return (
        <section className={styles.topBar}>
            <span className={styles.resultado}>100 productos encontrados</span>

            <input
                type="text"
                placeholder="Buscar producto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.buscador}
            />

            <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className={styles.select}
            >
                <option value="fechaDesc">Fecha: Nuevo a Viejo</option>
                <option value="fechaAsc">Fecha: Viejo a Nuevo</option>
                <option value="precioAsc">Precio: Menor a Mayor</option>
                <option value="precioDesc">Precio: Mayor a Menor</option>
                <option value="precioDesc">Mas Relevantes</option>
            </select>
        </section>
    );
};

export default ProductControls;
