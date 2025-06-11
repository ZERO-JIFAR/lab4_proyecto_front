import styles from './filters.module.css';
import { ITipo } from '../../../types/IType';
import { ICategory } from '../../../types/ICategory';

interface FiltersProps {
    tipos: ITipo[];
    categorias: ICategory[];
    selectedTipo: number | "";
    setSelectedTipo: (id: number | "") => void;
    selectedCategoria: number | "";
    setSelectedCategoria: (id: number | "") => void;
    selectedTalle: string;
    setSelectedTalle: (talle: string) => void;
}

const tallesDisponibles = [
    '3.5Y', '4Y', '4.5Y', '5Y', '5.5Y', '6Y',
    '6.5Y', '7Y', '7.5Y', '8Y', '8.5Y', '9Y',
    '9.5Y', '10Y', '10.5Y', '11Y', '11.5Y', '12Y', 'S', 'L'
];

const Filters: React.FC<FiltersProps> = ({
    tipos,
    categorias,
    selectedTipo,
    setSelectedTipo,
    selectedCategoria,
    setSelectedCategoria,
    selectedTalle,
    setSelectedTalle
}) => {
    return (
        <aside className={styles.sidebar}>
            <h2 className={styles.titulo}>Filtrar</h2>

            <div className={styles.seccion}>
                <h4>Tipo</h4>
                <select
                    value={selectedTipo}
                    onChange={e => {
                        setSelectedTipo(e.target.value ? Number(e.target.value) : "");
                        setSelectedCategoria(""); // Reset categoría al cambiar tipo
                    }}
                >
                    <option value="">Todos</option>
                    {tipos.map(tipo => (
                        <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                    ))}
                </select>
            </div>

            <div className={styles.seccion}>
                <h4>Categoría</h4>
                <select
                    value={selectedCategoria}
                    onChange={e => setSelectedCategoria(e.target.value ? Number(e.target.value) : "")}
                    disabled={categorias.length === 0}
                >
                    <option value="">Todas</option>
                    {categorias.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                </select>
            </div>

            <div className={styles.seccion}>
                <h4>Talles</h4>
                <div className={styles.talles}>
                    {tallesDisponibles.map(talle => (
                        <button
                            key={talle}
                            className={selectedTalle === talle ? styles.selectedTalle : ''}
                            onClick={() => setSelectedTalle(selectedTalle === talle ? "" : talle)}
                            type="button"
                        >
                            {talle}
                        </button>
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default Filters;