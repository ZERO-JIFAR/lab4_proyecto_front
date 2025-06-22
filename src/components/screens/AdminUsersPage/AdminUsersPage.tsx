import React, { useEffect, useState } from 'react';
import { getAllUsers, updateUser } from '../../../http/userRequest';
import styles from './AdminUserPage.module.css';

interface Usuario {
  id: number;
  nombre: string;
  apellido?: string;
  email: string;
  rol: string;
  eliminado: boolean;
  contrasena?: string;
}

const AdminUsersPage: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsuarios = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllUsers();
      setUsuarios(data);
    } catch (err: any) {
      setError(err.message || 'Error al obtener usuarios');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleToggleActivo = async (usuario: Usuario) => {
    try {
      await updateUser(usuario.id, {
        nombre: usuario.nombre,
        email: usuario.email,
        contrasena: usuario.contrasena || '1234',
        rol: usuario.rol,
        eliminado: !usuario.eliminado
      });
      fetchUsuarios();
    } catch (err: any) {
      setError(err.message || 'Error al actualizar usuario');
    }
  };

  const handleToggleRol = async (usuario: Usuario) => {
    try {
      await updateUser(usuario.id, {
        nombre: usuario.nombre,
        email: usuario.email,
        contrasena: usuario.contrasena || '1234',
        rol: usuario.rol === 'ADMIN' ? 'USER' : 'ADMIN',
        eliminado: usuario.eliminado
      });
      fetchUsuarios();
    } catch (err: any) {
      setError(err.message || 'Error al cambiar rol');
    }
  };

  // Mostrar todos los usuarios, sin filtrar
  const usuariosFiltrados = usuarios;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Administrar Usuarios</h2>
      {loading && <p>Cargando usuarios...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuariosFiltrados.map((usuario) => (
            <tr key={usuario.id} className={usuario.eliminado ? styles.disabled : ''}>
              <td>{usuario.id}</td>
              <td>{usuario.nombre}</td>
              <td>{usuario.email}</td>
              <td>{usuario.rol === 'ADMIN' ? 'Admin' : 'Cliente'}</td>
              <td>{usuario.eliminado ? 'Deshabilitado' : 'Activo'}</td>
              <td>
                <button
                  className={styles.button}
                  onClick={() => handleToggleActivo(usuario)}
                >
                  {usuario.eliminado ? 'Habilitar' : 'Deshabilitar'}
                </button>
                <button
                  className={`${styles.button} ${styles.secondary}`}
                  onClick={() => handleToggleRol(usuario)}
                  disabled={usuario.eliminado}
                >
                  Cambiar a {usuario.rol === 'ADMIN' ? 'Cliente' : 'Admin'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsersPage;