import React, { useState } from 'react';
import styles from './modalSignin.module.css';

interface ModalSignInProps {
  show: boolean;
  onClose: () => void;
  onLogin: (isAdmin: boolean) => void;
}

const ModalSignIn: React.FC<ModalSignInProps> = ({ show, onClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);  // Declaración explícita de tipo

  if (!show) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);  // Restablecer el error al enviar el formulario

    // Si vuelve a hacer clic estando ya abierto, cierra el modal
    if (!username && !password) {
      onClose();
      return;
    }

    // admin hardcoded
    if (username === 'admin' && password === 'admin') {
      onLogin(true);
      onClose();
      return;
    }

    // usuarios registrados desde localStorage
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
        
        {/* Verificación de error */}
        {error && <p className={styles.modalSigninError}>{error}</p>} 

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default ModalSignIn;
