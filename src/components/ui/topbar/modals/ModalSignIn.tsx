import React, { useState } from 'react';
import styles from './modalSignin.module.css';
import { loginUser } from '../../../../http/userRequest';

interface ModalSignInProps {
  show: boolean;
  onClose: () => void;
  onLogin: (role: string, token: string) => void;
}

const ModalSignIn: React.FC<ModalSignInProps> = ({ show, onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!show) return null;

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);

  try {
    const data = await loginUser({ email, password });
    onLogin(data.rol, data.token);
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