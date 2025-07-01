import React, { useEffect, useState } from "react";
import { getCategorias } from "../../../http/categoryRequest";
import { getTipos } from "../../../http/typeRequest";
import axios from "axios";
import { ICategory } from "../../../types/ICategory";
import { ITipo } from "../../../types/IType";
import styles from "./AdminCategoriaPage.module.css";

const APIURL = import.meta.env.VITE_API_URL;

const AdminCategoriaPage: React.FC = () => {
    const [categorias, setCategorias] = useState<ICategory[]>([]);
    const [tipos, setTipos] = useState<ITipo[]>([]);
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [tipoId, setTipoId] = useState<number | "">("");
    const [editId, setEditId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const fetchData = async () => {
        try {
            setCategorias(await getCategorias());
            const tiposData = await getTipos();
            setTipos(tiposData.filter(t => !t.eliminado));
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
            setModalOpen(false);
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
        setModalOpen(true);
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
        setModalOpen(false);
    };

    // Modal centrado y con fondo oscuro
    const Modal = ({ children }: { children: React.ReactNode }) => (
        <div className={styles.categoriaModalOverlayUnico}>
            <div className={styles.categoriaModalUnico}>
                {children}
            </div>
        </div>
    );

    return (
        <div className={styles.categoriaContainerUnico}>
            <h2 className={styles.categoriaTitleUnico}>Administrar Categorías</h2>
            <button
                className={styles.categoriaBtnAgregarUnico}
                onClick={() => {
                    setEditId(null);
                    setNombre("");
                    setDescripcion("");
                    setTipoId("");
                    setError(null);
                    setModalOpen(true);
                }}
            >
                + Agregar Categoría
            </button>
            {modalOpen && (
                <Modal>
                    <form onSubmit={handleSubmit} className={styles.categoriaFormUnico}>
                        <label htmlFor="categoriaNombreUnico">Nombre de la categoría:</label>
                        <input
                            id="categoriaNombreUnico"
                            type="text"
                            value={nombre}
                            onChange={e => setNombre(e.target.value)}
                            required
                            placeholder="Ej: Zapatillas, Remeras, Accesorios..."
                            className={styles.categoriaInputUnico}
                        />
                        <label htmlFor="categoriaDescripcionUnico">Descripción de la categoría:</label>
                        <input
                            id="categoriaDescripcionUnico"
                            type="text"
                            value={descripcion}
                            onChange={e => setDescripcion(e.target.value)}
                            placeholder="Describe brevemente la categoría"
                            className={styles.categoriaInputUnico}
                        />
                        <label htmlFor="categoriaTipoUnico">Tipo de producto:</label>
                        <select
                            id="categoriaTipoUnico"
                            value={tipoId}
                            onChange={e => setTipoId(Number(e.target.value))}
                            required
                            className={styles.categoriaSelectUnico}
                        >
                            <option value="">Selecciona el tipo de producto</option>
                            {tipos.map(tipo => (
                                <option key={tipo.id} value={tipo.id}>
                                    {tipo.nombre}
                                </option>
                            ))}
                        </select>
                        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                            <button type="submit" className={styles.categoriaBtnUnico}>
                                {editId ? "Actualizar" : "Agregar"}
                            </button>
                            <button type="button" className={styles.categoriaBtnCancelUnico} onClick={handleCancel}>
                                Cancelar
                            </button>
                        </div>
                        {error && <div className={styles.categoriaErrorUnico}>{error}</div>}
                    </form>
                </Modal>
            )}
            <table className={styles.categoriaTableUnico}>
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
                        <tr key={cat.id} style={{ opacity: cat.eliminado ? 0.5 : 1 }}>
                            <td>{cat.id}</td>
                            <td>{cat.nombre || <span className={styles.categoriaPlaceholderUnico}>Nombre de la categoría</span>}</td>
                            <td>{cat.tipo?.nombre || <span className={styles.categoriaPlaceholderUnico}>Tipo</span>}</td>
                            <td>{cat.descripcion || <span className={styles.categoriaPlaceholderUnico}>Descripción</span>}</td>
                            <td>{cat.eliminado ? "Eliminada" : "Activa"}</td>
                            <td>
                                <button
                                    className={styles.categoriaActionBtnUnico}
                                    onClick={() => handleEdit(cat)}
                                    disabled={cat.eliminado}
                                >
                                    Editar
                                </button>
                                <button
                                    className={`${styles.categoriaActionBtnUnico} ${cat.eliminado ? styles.categoriaEnableUnico : styles.categoriaDisableUnico}`}
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
    );
};

export default AdminCategoriaPage;