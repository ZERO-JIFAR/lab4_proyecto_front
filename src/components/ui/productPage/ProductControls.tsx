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
                <option value="fechaDesc">Fecha: nuevo a viejo</option>
                <option value="fechaAsc">Fecha: viejo a nuevo</option>
                <option value="precioAsc">Precio: menor a mayor</option>
                <option value="precioDesc">Precio: mayor a menor</option>
                <option value="relevantes">Mas relevantes</option>
            </select>
        </section>
    );
};

export default ProductControls;
