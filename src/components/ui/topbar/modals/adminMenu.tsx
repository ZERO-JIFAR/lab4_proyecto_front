import React, { useState } from 'react';
import styles from './adminMenu.module.css';
import ModalAddProd from './modalAddProd';
import ModalEditProd from './modalEditProd';

interface AdminMenuProps {
  visible: boolean;
}

const AdminMenu: React.FC<AdminMenuProps> = ({ visible }) => {
  const [modalAdd, setModalAdd] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);

  if (!visible) return null;

  return (
    <div className={styles.menuContainer}>
      <button className={styles.menuButton} onClick={() => setModalAdd(true)}>
        Agregar Producto
      </button>
      <button className={styles.menuButton} onClick={() => setModalEdit(true)}>
        Editar Producto
      </button>
      <button className={styles.menuButton}>Ver Estadísticas</button>

      <ModalAddProd isOpen={modalAdd} onClose={() => setModalAdd(false)} />
      <ModalEditProd isOpen={modalEdit} onClose={() => setModalEdit(false)} />
    </div>
  );
};

export default AdminMenu;
