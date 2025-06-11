import React, { useState } from 'react';
import styles from './modalSignin.module.css';
import { loginUser } from '../../../../http/userRequest';

interface ModalSignInProps {
  show: boolean;
  onClose: () => void;
  onLogin: (isAdmin: boolean) => void;
}

const ModalSignIn: React.FC<ModalSignInProps> = ({ show, onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!show) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Limpia el token antes de intentar loguear
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('email');

    try {
      const data = await loginUser({ email, password });

      localStorage.setItem('token', data.token);
      localStorage.setItem('rol', data.rol);
      localStorage.setItem('email', data.email);

      onLogin(data.rol === 'ADMIN');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Usuario o contraseña incorrectos. Por favor verifica tus datos.');
    }
  };

  return (
    <div className={styles.modalContainer}>
      <form className={styles.modalForm} onSubmit={handleSubmit}>
        <h3>Iniciar sesión</h3>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className={styles.modalSigninError}>{error}</p>}
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default ModalSignIn;