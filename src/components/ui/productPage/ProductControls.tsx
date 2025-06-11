import styles from './productControls.module.css';
import { useState } from 'react';

interface ProductControlsProps {
    total: number;
    onSortChange: (sort: string) => void;
    search: string;
    onSearchChange: (text: string) => void;
}

const ProductControls: React.FC<ProductControlsProps> = ({ total, onSortChange, search, onSearchChange }) => {
    const [sort, setSort] = useState('relevantes');

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSort(e.target.value);
        onSortChange(e.target.value);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSearchChange(e.target.value);
    };

    return (
        <section className={styles.topBar}>
            <span className={styles.resultado}>{total} productos encontrados</span>

            <input
                type="text"
                placeholder="Buscar producto..."
                value={search}
                onChange={handleSearchChange}
                className={styles.buscador}
            />

            <select
                value={sort}
                onChange={handleSortChange}
                className={styles.select}
            >
                <option value="relevantes">Más relevantes</option>
                <option value="precioAsc">Precio: menor a mayor</option>
                <option value="precioDesc">Precio: mayor a menor</option>
            </select>
        </section>
    );
};

export default ProductControls;