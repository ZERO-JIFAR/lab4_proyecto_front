import React, { useEffect, useState } from "react";
import { getCategorias } from "../../../http/categoryRequest";
import { getTipos } from "../../../http/typeRequest";
import axios from "axios";
import { ICategory } from "../../../types/ICategory";
import { ITipo } from "../../../types/IType";
import styles from "./AdminCaTaTiTitaPage.module.css";

const APIURL = import.meta.env.VITE_API_URL;

const AdminCategoriaPage: React.FC = () => {
    const [categorias, setCategorias] = useState<ICategory[]>([]);
    const [tipos, setTipos] = useState<ITipo[]>([]);
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [tipoId, setTipoId] = useState<number | "">("");
    const [editId, setEditId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setCategorias(await getCategorias());
            setTipos(await getTipos());
        } catch (e: any) {
            setError("Error al cargar datos");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nombre || !tipoId) {
            setError("Nombre y tipo son obligatorios");
            return;
        }
        setError(null);
        try {
            const token = localStorage.getItem("token");
            if (editId) {
                await axios.put(
                    `${APIURL}/categorias/${editId}`,
                    { nombre, descripcion, tipo: { id: tipoId } },
                    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
                );
            } else {
                await axios.post(
                    `${APIURL}/categorias`,
                    { nombre, descripcion, tipo: { id: tipoId } },
                    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
                );
            }
            setNombre("");
            setDescripcion("");
            setTipoId("");
            setEditId(null);
            fetchData();
        } catch (e: any) {
            setError("Error al guardar la categoría");
        }
    };

    const handleEdit = (cat: ICategory) => {
        setEditId(cat.id);
        setNombre(cat.nombre);
        setDescripcion(cat.descripcion || "");
        setTipoId(cat.tipo.id);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("¿Seguro que deseas eliminar esta categoría?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${APIURL}/categorias/${id}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            fetchData();
        } catch {
            setError("Error al eliminar");
        }
    };

    const handleCancel = () => {
        setEditId(null);
        setNombre("");
        setDescripcion("");
        setTipoId("");
        setError(null);
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                <h2 className={styles.title}>Administrar Categorías</h2>
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
                    <div className={styles.formRow}>
                        <label>Descripción:</label>
                        <input
                            type="text"
                            value={descripcion}
                            onChange={e => setDescripcion(e.target.value)}
                        />
                    </div>
                    <div className={styles.formRow}>
                        <label>Tipo:</label>
                        <select
                            value={tipoId}
                            onChange={e => setTipoId(Number(e.target.value))}
                            required
                        >
                            <option value="">Seleccionar</option>
                            {tipos.map(tipo => (
                                <option key={tipo.id} value={tipo.id}>
                                    {tipo.nombre}
                                </option>
                            ))}
                        </select>
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
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Tipo</th>
                                <th>Descripción</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categorias.map(cat => (
                                <tr key={cat.id} className={cat.eliminado ? styles.eliminado : ""}>
                                    <td>{cat.id}</td>
                                    <td>{cat.nombre}</td>
                                    <td>{cat.tipo?.nombre}</td>
                                    <td>{cat.descripcion}</td>
                                    <td>{cat.eliminado ? "Eliminada" : "Activa"}</td>
                                    <td>
                                        <button
                                            className={styles.editBtn}
                                            onClick={() => handleEdit(cat)}
                                            disabled={cat.eliminado}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className={styles.deleteBtn}
                                            onClick={() => handleDelete(cat.id)}
                                        >
                                            {cat.eliminado ? "Restaurar" : "Eliminar"}
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

export default AdminCategoriaPage;