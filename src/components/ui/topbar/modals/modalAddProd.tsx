import React, { useEffect, useState } from 'react';
import styles from './modalAddProd.module.css';
import { getTipos } from '../../../../http/typeRequest';
import { getCategorias } from '../../../../http/categoryRequest';
import { ITipo } from '../../../../types/IType';
import { ICategory } from '../../../../types/ICategory';

interface ModalAddProdProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalAddProd: React.FC<ModalAddProdProps> = ({ isOpen, onClose }) => {
  const [tipos, setTipos] = useState<ITipo[]>([]);
  const [categorias, setCategorias] = useState<ICategory[]>([]);
  const [selectedTipoId, setSelectedTipoId] = useState<number | "">("");
  const [filteredCategorias, setFilteredCategorias] = useState<ICategory[]>([]);

  useEffect(() => {
    if (isOpen) {
      getTipos().then(setTipos).catch(() => setTipos([]));
      getCategorias().then(setCategorias).catch(() => setCategorias([]));
      setSelectedTipoId(""); // Reset tipo al abrir modal
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedTipoId === "") {
      setFilteredCategorias([]);
    } else {
      setFilteredCategorias(
        categorias.filter(cat => cat.idTipo.id === selectedTipoId)
      );
    }
  }, [selectedTipoId, categorias]);

  if (!isOpen) return null;

  const handleTipoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedTipoId(value ? Number(value) : "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Producto agregado!');
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>✖</button>
        <h2>Agregar Producto</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGrid}>
            <div>
              <label>Nombre del producto:</label>
              <input type="text" name="nombre" required />

              <label>Precio:</label>
              <input type="number" name="precio" required />

              <label>Stock:</label>
              <input type="number" name="stock" required />

              <label>Subir imagen:</label>
              <input type="file" name="imagen" />
            </div>

            <div>
              <label>Tipo:</label>
              <select
                name="tipo"
                required
                value={selectedTipoId}
                onChange={handleTipoChange}
              >
                <option value="">Seleccionar</option>
                {tipos.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </option>
                ))}
              </select>

              <label>Categoría:</label>
              <select name="categoria" required disabled={selectedTipoId === ""}>
                <option value="">Seleccionar</option>
                {filteredCategorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>

              <label>Género:</label>
              <select name="genero" required>
                <option value="">Seleccionar</option>
                <option value="Hombre">Hombre</option>
                <option value="Mujer">Mujer</option>
                <option value="Unisex">Unisex</option>
                <option value="Niño/a">Niño/a</option>
              </select>

              <label>Talles:</label>
              <select name="talle" required>
                <option value="">Seleccionar</option>
                <option value="3.5Y">3.5Y</option>
                <option value="4Y">4Y</option>
                <option value="4.5Y">4.5Y</option>
                <option value="5Y">5Y</option>
                <option value="5.5Y">5.5Y</option>
                <option value="6Y">6Y</option>
                <option value="6.5Y">6.5Y</option>
                <option value="7Y">7Y</option>
                <option value="7.5Y">7.5Y</option>
                <option value="8Y">8Y</option>
                <option value="8.5Y">8.5Y</option>
                <option value="9Y">9Y</option>
                <option value="9.5Y">9.5Y</option>
                <option value="10Y">10Y</option>
                <option value="10.5Y">10.5Y</option>
                <option value="11Y">11Y</option>
                <option value="11.5Y">11.5Y</option>
                <option value="12Y">12Y</option>
                <option value="S">S</option>
                <option value="L">L</option>
              </select>
            </div>
          </div>

          <p className={styles.confirmText}>¿Guardar?</p>
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.yesButton}>Sí</button>
            <button type="button" className={styles.noButton} onClick={onClose}>No</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAddProd;