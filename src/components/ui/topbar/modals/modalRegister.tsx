// src/components/modals/RegisterModal.tsx
import React, { useState } from 'react';
import styles from './modalRegister.module.css';

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

  const handleRegister = async () => {
    setError('');

    if (!username || !email || !password || !repeatPassword) {
      setError('Completa todos los campos.');
      return;
    }

    if (password !== repeatPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      const response = await fetch('http://localhost:9000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: username,
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al registrar usuario');
      }

    alert('Usuario registrado correctamente');
    onClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className={styles['registerModal-overlay']}>
      <div className={styles['registerModal-container']}>
        <h2 className={styles['registerModal-title']}>Registro</h2>

        <input
          type="text"
          placeholder="Nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={styles['registerModal-input']}
        />
        <input
          type="email"
          placeholder="Correo Electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles['registerModal-input']}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles['registerModal-input']}
        />
        <input
          type="password"
          placeholder="Repetir Contraseña"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
          className={styles['registerModal-input']}
        />

        {error && <p className={styles['registerModal-error']}>{error}</p>}

        <div className={styles['registerModal-actions']}>
          <button
            className={styles['registerModal-button']}
            onClick={handleRegister}
          >
            Registrarse
          </button>
          <button
            className={`${styles['registerModal-button']} ${styles['registerModal-cancel']}`}
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
