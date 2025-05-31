import React from 'react';
import styles from './modalLogout.module.css';

interface ModalLogoutProps {
    show: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const ModalLogout: React.FC<ModalLogoutProps> = ({ show, onConfirm, onCancel }) => {
    if (!show) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.container}>
                <h2 className={styles.title}>¿Seguro que desea salir?</h2>
                <div className={styles.actions}>
                    <button className={styles.yesButton} onClick={onConfirm}>Sí</button>
                    <button className={styles.noButton} onClick={onCancel}>No</button>
                </div>
            </div>
        </div>
    );
};

export default ModalLogout;
