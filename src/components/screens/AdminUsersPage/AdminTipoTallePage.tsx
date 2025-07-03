import React, { useEffect, useState } from "react";
import { getWaistTypes } from "../../../http/waistTypeRequest";
import axios from "axios";
import { IWaistType } from "../../../types/IWaistType";
import styles from "./AdminCaTaTiTitaPage.module.css";
import Topbar from "../../ui/topbar/topbar";

const APIURL = import.meta.env.VITE_API_URL;

const AdminTipoTallePage: React.FC = () => {
    const [waistTypes, setWaistTypes] = useState<IWaistType[]>([]);
    const [nombre, setNombre] = useState("");
    const [editId, setEditId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showEliminados, setShowEliminados] = useState(false);

    const fetchData = async () => {
        try {
            setWaistTypes(await getWaistTypes());
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
                    `${APIURL}/tiposTalle/${editId}`,
                    { nombre },
                    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
                );
            } else {
                await axios.post(
                    `${APIURL}/tiposTalle`,
                    { nombre },
                    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
                );
            }
            setNombre("");
            setEditId(null);
            fetchData();
        } catch {
            setError("Error al guardar el tipo de talle");
        }
    };

    const handleEdit = (wt: IWaistType) => {
        setEditId(wt.id);
        setNombre(wt.nombre);
    };

    const handleToggleActivo = async (wt: IWaistType) => {
        if (!window.confirm(
            wt.eliminado
                ? "¿Seguro que deseas habilitar este tipo de talle?"
                : "¿Seguro que deseas deshabilitar este tipo de talle?"
        )) return;
        try {
            const token = localStorage.getItem("token");
            await axios.patch(
                `${APIURL}/tiposTalle/${wt.id}`,
                { eliminado: !wt.eliminado },
                { headers: token ? { Authorization: `Bearer ${token}` } : {} }
            );
            fetchData();
        } catch {
            setError("Error al actualizar el tipo de talle");
        }
    };

    const handleCancel = () => {
        setEditId(null);
        setNombre("");
        setError(null);
    };

    const waistTypesFiltrados = waistTypes.filter(wt => showEliminados ? true : !wt.eliminado);

    return (
        <div className={styles.pageWrapper}>
            <Topbar />
            <div className={styles.container}>
                <h2 className={styles.title}>Administrar Tipos de Talle</h2>
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
                    Mostrar tipos de talle deshabilitados
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
                            {waistTypesFiltrados.map(wt => (
                                <tr key={wt.id} className={wt.eliminado ? styles.eliminado : ""}>
                                    <td>{wt.id}</td>
                                    <td>{wt.nombre}</td>
                                    <td>{wt.eliminado ? "Deshabilitado" : "Activo"}</td>
                                    <td>
                                        <button
                                            className={styles.editBtn}
                                            onClick={() => handleEdit(wt)}
                                            disabled={wt.eliminado}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className={styles.deleteBtn}
                                            onClick={() => handleToggleActivo(wt)}
                                        >
                                            {wt.eliminado ? "Habilitar" : "Deshabilitar"}
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

export default AdminTipoTallePage;