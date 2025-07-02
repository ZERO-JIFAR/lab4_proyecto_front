import React, { useEffect, useState } from "react";
import { getTipos } from "../../../http/typeRequest";
import axios from "axios";
import { ITipo } from "../../../types/IType";
import styles from "./AdminCaTaTiTitaPage.module.css";

const APIURL = import.meta.env.VITE_API_URL;

const AdminTipoPage: React.FC = () => {
    const [tipos, setTipos] = useState<ITipo[]>([]);
    const [nombre, setNombre] = useState("");
    const [editId, setEditId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showEliminados, setShowEliminados] = useState(false);

    const fetchData = async () => {
        try {
            setTipos(await getTipos());
        } catch {
            setError("Error al cargar datos");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nombre) {
            setError("El nombre es obligatorio");
            return;
        }
        setError(null);
        try {
            const token = localStorage.getItem("token");
            if (editId) {
                await axios.put(
                    `${APIURL}/tipos/${editId}`,
                    { nombre },
                    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
                );
            } else {
                await axios.post(
                    `${APIURL}/tipos`,
                    { nombre },
                    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
                );
            }
            setNombre("");
            setEditId(null);
            fetchData();
        } catch {
            setError("Error al guardar el tipo");
        }
    };

    const handleEdit = (tipo: ITipo) => {
        setEditId(tipo.id);
        setNombre(tipo.nombre);
    };

    const handleToggleActivo = async (tipo: ITipo) => {
        if (!window.confirm(
            tipo.eliminado
                ? "¿Seguro que deseas habilitar este tipo?"
                : "¿Seguro que deseas deshabilitar este tipo?"
        )) return;
        try {
            const token = localStorage.getItem("token");
            await axios.patch(
                `${APIURL}/tipos/${tipo.id}`,
                { eliminado: !tipo.eliminado },
                { headers: token ? { Authorization: `Bearer ${token}` } : {} }
            );
            fetchData();
        } catch {
            setError("Error al actualizar el tipo");
        }
    };

    const handleCancel = () => {
        setEditId(null);
        setNombre("");
        setError(null);
    };

    const tiposFiltrados = tipos.filter(t => showEliminados ? true : !t.eliminado);

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                <h2 className={styles.title}>Administrar Tipos</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formRow}>
                        <label>Nombre:</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={e => setNombre(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.buttonGroup}>
                        <button type="submit" className={styles.button}>
                            {editId ? "Actualizar" : "Agregar"}
                        </button>
                        {editId && (
                            <button
                                type="button"
                                className={styles.cancelButton}
                                onClick={handleCancel}
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                    {error && <div className={styles.error}>{error}</div>}
                </form>
                <label style={{ marginBottom: 15, color: "#222" }}>
                    <input
                        type="checkbox"
                        checked={showEliminados}
                        onChange={e => setShowEliminados(e.target.checked)}
                        style={{ marginRight: 8 }}
                    />
                    Mostrar tipos deshabilitados
                </label>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tiposFiltrados.map(tipo => (
                                <tr key={tipo.id} className={tipo.eliminado ? styles.eliminado : ""}>
                                    <td>{tipo.id}</td>
                                    <td>{tipo.nombre}</td>
                                    <td>{tipo.eliminado ? "Deshabilitado" : "Activo"}</td>
                                    <td>
                                        <button
                                            className={styles.editBtn}
                                            onClick={() => handleEdit(tipo)}
                                            disabled={tipo.eliminado}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className={styles.deleteBtn}
                                            onClick={() => handleToggleActivo(tipo)}
                                        >
                                            {tipo.eliminado ? "Habilitar" : "Deshabilitar"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminTipoPage;