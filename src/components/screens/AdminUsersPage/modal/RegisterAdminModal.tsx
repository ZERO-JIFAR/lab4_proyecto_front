import React, { useState } from 'react';
import styles from './RegisterAdminModal.module.css';

interface RegisterAdminModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const APIURL = import.meta.env.VITE_API_URL;

const RegisterAdminModal: React.FC<RegisterAdminModalProps> = ({ show, onClose, onSuccess }) => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Registrar usuario (cliente)
      const response = await fetch(`${APIURL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al registrar usuario');
      }

      // 2. Buscar el usuario recién creado por email (requiere token)
      const token = localStorage.getItem('token');
      const usersResponse = await fetch(`${APIURL}/usuarios`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      if (!usersResponse.ok) {
        throw new Error('No se pudo obtener la lista de usuarios');
      }
      const users = await usersResponse.json();
      const newUser = users.find((u: any) => u.email === email);

      if (!newUser || !newUser.id) {
        throw new Error('No se pudo obtener el ID del usuario creado');
      }

      // 3. Actualizar usuario a ADMIN (requiere token)
    // ...existing code...
        const putResponse = await fetch(`${APIURL}/usuarios/${newUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({
          id: newUser.id,
          nombre,
          email,
          contrasena: newUser.contrasena, // Usar la contraseña ya almacenada (hasheada)
          rol: 'ADMIN'
        }),
      });
// ...existing code...

      if (!putResponse.ok) {
        const errorData = await putResponse.json();
        throw new Error(errorData.message || 'Error al actualizar rol a ADMIN');
      }

      setNombre('');
      setEmail('');
      setPassword('');
      onSuccess();
      onClose();
      alert('¡Admin registrado correctamente!');
    } catch (err: any) {
      setError(err.message || 'Error al registrar admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>✖</button>
        <h2>Registrar Nuevo Admin</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label>Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
          />
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.yesButton} disabled={loading}>
              {loading ? 'Registrando...' : 'Registrar'}
            </button>
            <button type="button" className={styles.noButton} onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterAdminModal;