import React, { useState } from 'react';
import styles from './modalRegister.module.css';
import { registerUser, loginUser } from '../../../../http/userRequest';
import { useAuth } from '../../../../context/AuthContext';

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
  const { login } = useAuth();

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

    // Limpia el token antes de registrar
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('email');
    localStorage.removeItem('user');

    try {
      await registerUser({ nombre: username, email, password });
      const data = await loginUser({ email, password });
      // Usa el contexto para guardar el usuario completo
      login(data.rol, data.token, { id: data.id, email: data.email, rol: data.rol });
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