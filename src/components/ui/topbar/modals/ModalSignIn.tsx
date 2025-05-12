import React, { useState } from 'react';
import styles from './modalSignIn.module.css';

interface ModalSignInProps {
  show: boolean;
  onClose: () => void;
  onLogin: (isAdmin: boolean) => void;
}

const ModalSignIn: React.FC<ModalSignInProps> = ({ show, onClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  if (!show) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isAdminLogin = username === 'admin' && password === 'admin';
    onLogin(isAdminLogin);
    onClose(); // Cierra el modal después del intento de inicio de sesión
  };

  return (
    <div className={styles.modalContainer}>
      <form className={styles.modalForm} onSubmit={handleSubmit}>
        <h3>Iniciar sesión</h3>
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className={styles.actions}>
          <button type="submit">Entrar</button>
          <button type="button" onClick={onClose}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default ModalSignIn;
