// src/components/modals/ModalSignIn.tsx
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
  const [error, setError] = useState('');

  if (!show) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Caso especial: admin hardcoded
    if (username === 'admin' && password === 'admin') {
      onLogin(true);
      onClose();
      return;
    }

    // Obtener usuarios registrados desde localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    const matchedUser = users.find(
      (user: any) => user.username === username && user.password === password
    );

    if (matchedUser) {
      onLogin(false);
      onClose();
    } else {
      setError('Usuario o contraseña incorrectos. Por favor verifica tus datos.');
    }
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
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.actions}>
          <button type="submit">Entrar</button>
          <button type="button" onClick={onClose}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default ModalSignIn;
