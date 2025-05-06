import React from 'react';
import styles from './modalFooter.module.css';

interface ModalFooterProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

const ModalFooter: React.FC<ModalFooterProps> = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>{title}</h2>
        <p>{content}</p>
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default ModalFooter;
