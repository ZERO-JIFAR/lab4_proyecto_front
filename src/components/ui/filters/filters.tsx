import React, { useEffect, useState } from 'react';
import styles from './filters.module.css';
import { ITipo } from '../../../types/IType';
import { ICategory } from '../../../types/ICategory';
import { IWaistType } from '../../../types/IWaistType';
import { ITalle } from '../../../types/ITalle';
import { getWaistTypes } from '../../../http/waistTypeRequest';
import { getTallesByTipoId } from '../../../http/talleRequest';

interface FiltersProps {
    tipos: ITipo[];
    categorias: ICategory[];
    selectedTipo: number | "";
    setSelectedTipo: (id: number | "") => void;
    selectedCategoria: number | "";
    setSelectedCategoria: (id: number | "") => void;
    selectedWaistType: number | "";
    setSelectedWaistType: (id: number | "") => void;
    selectedTalle: string;
    setSelectedTalle: (talle: string) => void;
    selectedColor: string;
    setSelectedColor: (color: string) => void;
    selectedMarca: string;
    setSelectedMarca: (marca: string) => void;
    colors: string[];
    marcas: string[];
    minPrice: string;
    setMinPrice: (value: string) => void;
    maxPrice: string;
    setMaxPrice: (value: string) => void;
}

const Filters: React.FC<FiltersProps> = ({
    tipos,
    categorias,
    selectedTipo,
    setSelectedTipo,
    selectedCategoria,
    setSelectedCategoria,
    selectedWaistType,
    setSelectedWaistType,
    selectedTalle,
    setSelectedTalle,
    selectedColor,
    setSelectedColor,
    selectedMarca,
    setSelectedMarca,
    colors,
    marcas,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice
}) => {
    const [waistTypes, setWaistTypes] = useState<IWaistType[]>([]);
    const [talles, setTalles] = useState<ITalle[]>([]);

    // Cargar tipos de talle al montar
    useEffect(() => {
        getWaistTypes()
            .then(data => setWaistTypes(Array.isArray(data) ? data.filter(wt => !wt.eliminado) : []))
            .catch(() => setWaistTypes([]));
    }, []);

    // Cargar talles cuando cambia el tipo de talle
    useEffect(() => {
        if (selectedWaistType) {
            getTallesByTipoId(Number(selectedWaistType))
                .then(data => setTalles(Array.isArray(data) ? data.filter(t => !t.eliminado) : []))
                .catch(() => setTalles([]));
            setSelectedTalle(""); // Limpiar talle seleccionado al cambiar tipo
        } else {
            setTalles([]);
            setSelectedTalle("");
        }
    }, [selectedWaistType, setSelectedTalle]);

    // Filtrar tipos, categorías y talles eliminados
    const tiposFiltrados = Array.isArray(tipos) ? tipos.filter(tipo => !tipo.eliminado) : [];
    const categoriasFiltradas = Array.isArray(categorias) ? categorias.filter(cat => !cat.eliminado) : [];

    return (
        <aside className={styles.filtrosSidebarUnico}>
            <h2 className={styles.filtrosTituloUnico}>Filtrar</h2>

            {/* Filtro por Tipo */}
            <div className={styles.filtrosSeccionUnico}>
                <h4>Tipo</h4>
                <select
                    className={styles.filtrosSelectUnico}
                    value={selectedTipo}
                    onChange={e => setSelectedTipo(e.target.value === "" ? "" : Number(e.target.value))}
                >
                    <option value="">Todos</option>
                    {tiposFiltrados.map(tipo => (
                        <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                    ))}
                </select>
            </div>

            {/* Filtro por Categoría */}
            <div className={styles.filtrosSeccionUnico}>
                <h4>Categoría</h4>
                <select
                    className={styles.filtrosSelectUnico}
                    value={selectedCategoria}
                    onChange={e => setSelectedCategoria(e.target.value === "" ? "" : Number(e.target.value))}
                >
                    <option value="">Todas</option>
                    {categoriasFiltradas.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                </select>
            </div>

            {/* Filtro por Tipo de Talle */}
            <div className={styles.filtrosSeccionUnico}>
                <h4>Tipo de Talle</h4>
                <select
                    className={styles.filtrosSelectUnico}
                    value={selectedWaistType}
                    onChange={e => setSelectedWaistType(e.target.value === "" ? "" : Number(e.target.value))}
                >
                    <option value="">Todos</option>
                    {waistTypes.map(wt => (
                        <option key={wt.id} value={wt.id}>{wt.nombre}</option>
                    ))}
                </select>
            </div>

            {/* Filtro por Talle */}
            <div className={styles.filtrosSeccionUnico}>
                <h4>Talles</h4>
                <div className={styles.filtrosTallesUnico}>
                    {talles.length === 0 ? (
                        <span style={{ color: '#aaa', fontSize: 13, gridColumn: '1/-1' }}>Selecciona un tipo de talle</span>
                    ) : (
                        talles.map(talle => (
                            <button
                                key={talle.id}
                                className={
                                    selectedTalle === talle.valor
                                        ? `${styles.filtrosTallesBtnUnico} ${styles.filtrosTalleSelectedUnico}`
                                        : styles.filtrosTallesBtnUnico
                                }
                                onClick={() => setSelectedTalle(selectedTalle === talle.valor ? "" : talle.valor)}
                                type="button"
                            >
                                {talle.valor || talle.nombre}
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Filtro por Precio */}
            <div className={styles.filtrosSeccionUnico}>
                <h4>Precio</h4>
                <div className={styles.filtrosPrecioInputsUnico}>
                    <input
                        type="number"
                        placeholder="Mín"
                        value={minPrice}
                        min={0}
                        onChange={e => setMinPrice(e.target.value)}
                        className={styles.filtrosPrecioInputUnico}
                    />
                    <span>-</span>
                    <input
                        type="number"
                        placeholder="Máx"
                        value={maxPrice}
                        min={0}
                        onChange={e => setMaxPrice(e.target.value)}
                        className={styles.filtrosPrecioInputUnico}
                    />
                </div>
            </div>

            {/* Filtro por Color */}
            <div className={styles.filtrosSeccionUnico}>
                <h4>Color</h4>
                <select
                    className={styles.filtrosSelectUnico}
                    value={selectedColor}
                    onChange={e => setSelectedColor(e.target.value)}
                >
                    <option value="">Todos</option>
                    {colors.map(color => (
                        <option key={color} value={color}>{color}</option>
                    ))}
                </select>
            </div>

            {/* Filtro por Marca */}
            <div className={styles.filtrosSeccionUnico}>
                <h4>Marca</h4>
                <select
                    className={styles.filtrosSelectUnico}
                    value={selectedMarca}
                    onChange={e => setSelectedMarca(e.target.value)}
                >
                    <option value="">Todas</option>
                    {marcas.map(marca => (
                        <option key={marca} value={marca}>{marca}</option>
                    ))}
                </select>
            </div>
        </aside>
    );
};

export default Filters;