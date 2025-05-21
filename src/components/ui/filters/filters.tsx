import React from 'react';
import styles from './filters.module.css';

const Filters = () => {
  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.titulo}>Filtrar</h2>

      <div className={styles.seccion}>
        <h4>Descuentos</h4>
        <label><input type="checkbox" /> 40% - 60%</label>
        <label><input type="checkbox" /> 30% - 40%</label>
        <label><input type="checkbox" /> 20% - 30%</label>
        <label><input type="checkbox" /> Hasta 20%</label>
      </div>

      <div className={styles.seccion}>
        <h4>Géneros</h4>
        <label><input type="checkbox" /> Hombre</label>
        <label><input type="checkbox" /> Mujer</label>
        <label><input type="checkbox" /> Unisex</label>
        <label><input type="checkbox" /> Niño/a</label>
      </div>

      <div className={styles.seccion}>
        <h4>Talles</h4>
        <div className={styles.talles}>
          {['3.5Y', '4Y', '4.5Y', '5Y', '5.5Y', '6Y', '6.5Y', '7Y', '7.5Y', '8Y', '8.5Y', '9Y', '9.5Y', '10Y', '10.5Y', '11Y', '11.5Y', '12Y', 'S', 'L'].map(talle => (
            <button key={talle}>{talle}</button>
          ))}
        </div>
      </div>

      <div className={styles.seccion}>
        <h4>Categorías</h4>
        <label><input type="checkbox" /> Running</label>
        <label><input type="checkbox" /> Casual</label>
        <label><input type="checkbox" /> Urbano</label>
        <label><input type="checkbox" /> Trail</label>
      </div>

      <div className={styles.seccion}>
        <h4>Tipos</h4>
        <label><input type="checkbox" /> Zapatillas</label>
        <label><input type="checkbox" /> Botas</label>
        <label><input type="checkbox" /> Remeras</label>
        <label><input type="checkbox" /> Buzos</label>
      </div>
    </aside>
  );
};

export default Filters;
