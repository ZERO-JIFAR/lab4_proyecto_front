import React, { useState } from 'react';
import styles from './adminMenu.module.css';
import ModalAddProd from './modalAddProd';

interface AdminMenuProps {
  visible: boolean;
}

const AdminMenu: React.FC<AdminMenuProps> = ({ visible }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!visible) return null;

  return (
    <div className={styles.menuContainer}>
      <button className={styles.menuButton} onClick={() => setIsModalOpen(true)}>
        Agregar Producto
      </button>
      <button className={styles.menuButton}>Editar Producto</button>
      <button className={styles.menuButton}>Ver Estadísticas</button>

      <ModalAddProd isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default AdminMenu;
