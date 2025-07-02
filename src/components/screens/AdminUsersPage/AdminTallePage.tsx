import React, { useEffect, useState } from "react";
import { getTalles } from "../../../http/talleRequest";
import { getWaistTypes } from "../../../http/waistTypeRequest";
import axios from "axios";
import { ITalle } from "../../../types/ITalle";
import { IWaistType } from "../../../types/IWaistType";
import styles from "./AdminCaTaTiTitaPage.module.css";

const APIURL = import.meta.env.VITE_API_URL;

const AdminTallePage: React.FC = () => {
    const [talles, setTalles] = useState<ITalle[]>([]);
    const [waistTypes, setWaistTypes] = useState<IWaistType[]>([]);
    const [nombre, setNombre] = useState("");
    const [valor, setValor] = useState("");
    const [waistTypeId, setWaistTypeId] = useState<number | "">("");
    const [editId, setEditId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showEliminados, setShowEliminados] = useState(false);

    const fetchData = async () => {
        try {
            setTalles(await getTalles());
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
        if (!nombre || !valor || !waistTypeId) {
            setError("Todos los campos son obligatorios");
            return;
        }
        setError(null);
        try {
            const token = localStorage.getItem("token");
            if (editId) {
                await axios.put(
                    `${APIURL}/talles/${editId}`,
                    { nombre, valor, tipoTalle: { id: waistTypeId } },
                    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
                );
            } else {
                await axios.post(
                    `${APIURL}/talles`,
                    { nombre, valor, tipoTalle: { id: waistTypeId } },
                    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
                );
            }
            setNombre("");
            setValor("");
            setWaistTypeId("");
            setEditId(null);
            fetchData();
        } catch {
            setError("Error al guardar el talle");
        }
    };

    const handleEdit = (talle: ITalle) => {
        setEditId(talle.id);
        setNombre(talle.nombre);
        setValor(talle.valor);
        setWaistTypeId(talle.tipoTalle?.id || "");
    };

    const handleToggleActivo = async (talle: ITalle) => {
        if (!window.confirm(
            talle.eliminado
                ? "¿Seguro que deseas habilitar este talle?"
                : "¿Seguro que deseas deshabilitar este talle?"
        )) return;
        try {
            const token = localStorage.getItem("token");
            await axios.patch(
                `${APIURL}/talles/${talle.id}`,
                { eliminado: !talle.eliminado },
                { headers: token ? { Authorization: `Bearer ${token}` } : {} }
            );
            fetchData();
        } catch {
            setError("Error al actualizar el talle");
        }
    };

    const handleCancel = () => {
        setEditId(null);
        setNombre("");
        setValor("");
        setWaistTypeId("");
        setError(null);
    };

    const tallesFiltrados = talles.filter(t => showEliminados ? true : !t.eliminado);

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                <h2 className={styles.title}>Administrar Talles</h2>
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
                        <label>Valor:</label>
                        <input
                            type="text"
                            value={valor}
                            onChange={e => setValor(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.formRow}>
                        <label>Tipo de Talle:</label>
                        <select
                            value={waistTypeId}
                            onChange={e => setWaistTypeId(Number(e.target.value))}
                            required
                        >
                            <option value="">Seleccionar</option>
                            {waistTypes.map(wt => (
                                <option key={wt.id} value={wt.id}>
                                    {wt.nombre}
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
                <label style={{ marginBottom: 15, color: "#222"}}>
                    <input
                        type="checkbox"
                        checked={showEliminados}
                        onChange={e => setShowEliminados(e.target.checked)}
                        style={{ marginRight: 8 }}
                    />
                    Mostrar talles deshabilitados
                </label>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Valor</th>
                                <th>Tipo de Talle</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tallesFiltrados.map(talle => (
                                <tr key={talle.id} className={talle.eliminado ? styles.eliminado : ""}>
                                    <td>{talle.id}</td>
                                    <td>{talle.nombre}</td>
                                    <td>{talle.valor}</td>
                                    <td>{talle.tipoTalle?.nombre || "-"}</td>
                                    <td>{talle.eliminado ? "Deshabilitado" : "Activo"}</td>
                                    <td>
                                        <button
                                            className={styles.editBtn}
                                            onClick={() => handleEdit(talle)}
                                            disabled={talle.eliminado}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className={styles.deleteBtn}
                                            onClick={() => handleToggleActivo(talle)}
                                        >
                                            {talle.eliminado ? "Habilitar" : "Deshabilitar"}
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

export default AdminTallePage;