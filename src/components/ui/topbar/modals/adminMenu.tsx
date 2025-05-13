import React from 'react';
import styles from './adminMenu.module.css';

interface AdminMenuProps {
  visible: boolean;
}

const AdminMenu: React.FC<AdminMenuProps> = ({ visible }) => {
  if (!visible) return null;

  return (
    <div className={styles.menuContainer}>
      <button className={styles.menuButton}>Agregar Producto</button>
      <button className={styles.menuButton}>Editar Producto</button>
      <button className={styles.menuButton}>Ver Estadísticas</button>
    </div>
  );
};

export default AdminMenu;
