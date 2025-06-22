import React, { useState } from 'react';
import styles from './adminMenu.module.css';
import ModalAddProd from './modalAddProd';
import { useNavigate } from 'react-router-dom';

interface AdminMenuProps {
  visible: boolean;
}

const AdminMenu: React.FC<AdminMenuProps> = ({ visible }) => {
  const [modalAdd, setModalAdd] = useState(false);
  const navigate = useNavigate();

  if (!visible) return null;

  return (
    <div className={styles.menuContainer}>
      <button className={styles.menuButton} onClick={() => setModalAdd(true)}>
        Agregar Producto
      </button>
      <button className={styles.menuButton} onClick={() => navigate('/SearchItem')}>
        Productos
      </button>
      <button className={styles.menuButton} onClick={() => navigate('/admin-usuarios')}>
        Administrar Usuarios
      </button>
      <ModalAddProd isOpen={modalAdd} onClose={() => setModalAdd(false)} />
    </div>
  );
};

export default AdminMenu;