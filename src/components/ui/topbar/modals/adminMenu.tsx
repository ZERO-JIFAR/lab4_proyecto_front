import React, { useState } from 'react';
import styles from './adminMenu.module.css';
import ModalAddProd from './modalAddProd';
import { useNavigate } from 'react-router-dom';

interface AdminMenuProps {
  visible: boolean;
}

const AdminMenu: React.FC<AdminMenuProps> = ({ visible }) => {
  const [modalAdd, setModalAdd] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  if (!visible) return null;

  return (
    <div className={styles.adminMenuContainerUnico}>
      <div className={styles.adminMenuDropdownWrapperUnico}>
        <button
          className={styles.adminMenuDropdownButtonUnico}
          onClick={() => setShowDropdown((prev) => !prev)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
        >
          AGREGAR...
        </button>
        {showDropdown && (
          <div className={styles.adminMenuDropdownUnico}>
            <button
              className={styles.adminMenuDropdownItemUnico}
              onClick={() => {
                setModalAdd(true);
                setShowDropdown(false);
              }}
            >
              Producto
            </button>
            <button
              className={styles.adminMenuDropdownItemUnico}
              onClick={() => {
                navigate('/admin/tipos');
                setShowDropdown(false);
              }}
            >
              Tipo
            </button>
            <button
              className={styles.adminMenuDropdownItemUnico}
              onClick={() => {
                navigate('/admin/categorias');
                setShowDropdown(false);
              }}
            >
              Categoría
            </button>
            <button
              className={styles.adminMenuDropdownItemUnico}
              onClick={() => {
                navigate('/admin/tipo-talles');
                setShowDropdown(false);
              }}
            >
              Tipo Talle
            </button>
            <button
              className={styles.adminMenuDropdownItemUnico}
              onClick={() => {
                navigate('/admin/talles');
                setShowDropdown(false);
              }}
            >
              Talle
            </button>
          </div>
        )}
      </div>
      <button
        className={styles.adminMenuButtonUnico}
        style={{ marginTop: '18px' }}
        onClick={() => navigate('/admin-usuarios')}
      >
        Administrar Usuarios
      </button>
      <ModalAddProd isOpen={modalAdd} onClose={() => setModalAdd(false)} />
    </div>
  );
};

export default AdminMenu;