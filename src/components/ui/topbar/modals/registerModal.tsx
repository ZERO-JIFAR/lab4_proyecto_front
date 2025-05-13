// src/components/modals/RegisterModal.tsx
import React, { useState } from 'react';
import styles from './registerModal.module.css';

interface RegisterModalProps {
  show: boolean;
  onClose: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ show, onClose }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState('');

  if (!show) return null;

  const handleRegister = () => {
    if (!username || !email || !password || !repeatPassword) {
      setError('Completa todos los campos.');
      return;
    }
    if (password !== repeatPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = existingUsers.find((user: any) => user.email === email);

    if (userExists) {
      setError('Este correo ya está registrado.');
      return;
    }

    const newUser = { username, email, password, isAdmin: false };
    localStorage.setItem('users', JSON.stringify([...existingUsers, newUser]));
    alert('Usuario registrado correctamente 🎉');
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <h2 className={styles.title}>Registro</h2>

        <input
          type="text"
          placeholder="Nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Correo Electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Repetir Contraseña"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
        />

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <button onClick={handleRegister}>Registrarse</button>
          <button className={styles.cancel} onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
