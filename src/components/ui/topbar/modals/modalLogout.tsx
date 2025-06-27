import React from 'react';
import styles from './modalLogout.module.css';
import { useCart } from '../../../../context/CartContext';

interface ModalLogoutProps {
    show: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const ModalLogout: React.FC<ModalLogoutProps> = ({ show, onConfirm, onCancel }) => {
    const { clearCart } = useCart();

    if (!show) return null;

    const handleConfirm = () => {
        clearCart(); // Vacía el carrito al desloguear
        onConfirm();
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.container}>
                <h2 className={styles.title}>¿Seguro que desea salir?</h2>
                <div className={styles.actions}>
                    <button className={styles.yesButton} onClick={handleConfirm}>Sí</button>
                    <button className={styles.noButton} onClick={onCancel}>No</button>
                </div>
            </div>
        </div>
    );
};

export default ModalLogout;