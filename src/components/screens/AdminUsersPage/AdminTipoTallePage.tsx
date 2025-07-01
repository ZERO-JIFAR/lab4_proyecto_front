import React, { useEffect, useState } from "react";
import { getTipos } from "../../../http/typeRequest";
import axios from "axios";
import { ITipo } from "../../../types/IType";
import styles from "./AdminTipoPage.module.css";

const APIURL = import.meta.env.VITE_API_URL;

const AdminTipoPage: React.FC = () => {
    const [tipos, setTipos] = useState<ITipo[]>([]);
    const [nombre, setNombre] = useState("");
    const [editId, setEditId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showEliminados, setShowEliminados] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

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
            setModalOpen(false);
            fetchData();
        } catch {
            setError("Error al guardar el tipo");
        }
    };

    const handleEdit = (tipo: ITipo) => {
        setEditId(tipo.id);
        setNombre(tipo.nombre);
        setModalOpen(true);
    };

    // Soft delete/habilitar
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
        setModalOpen(false);
    };

    const tiposFiltrados = tipos.filter(t => showEliminados ? true : !t.eliminado);

    // Modal centrado y con fondo oscuro
    const Modal = ({ children }: { children: React.ReactNode }) => (
        <div className={styles.tipoModalOverlayUnico}>
            <div className={styles.tipoModalUnico}>
                {children}
            </div>
        </div>
    );

    return (
        <div className={styles.tipoContainerUnico}>
            <h2 className={styles.tipoTitleUnico}>Administrar Tipos</h2>
            <button
                className={styles.tipoBtnAgregarUnico}
                onClick={() => {
                    setEditId(null);
                    setNombre("");
                    setError(null);
                    setModalOpen(true);
                }}
            >
                + Agregar Tipo
            </button>
            {modalOpen && (
                <Modal>
                    <form onSubmit={handleSubmit} className={styles.tipoFormUnico}>
                        <label htmlFor="tipoNombreUnico">Nombre del tipo:</label>
                        <input
                            id="tipoNombreUnico"
                            type="text"
                            value={nombre}
                            onChange={e => setNombre(e.target.value)}
                            required
                            placeholder="Ej: Calzado, Indumentaria, Accesorios..."
                            className={styles.tipoInputUnico}
                        />
                        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                            <button type="submit" className={styles.tipoBtnUnico}>
                                {editId ? "Actualizar" : "Agregar"}
                            </button>
                            <button type="button" className={styles.tipoBtnCancelUnico} onClick={handleCancel}>
                                Cancelar
                            </button>
                        </div>
                        {error && <div className={styles.tipoErrorUnico}>{error}</div>}
                    </form>
                </Modal>
            )}
            <label className={styles.tipoShowEliminadosLabel}>
                <input
                    type="checkbox"
                    checked={showEliminados}
                    onChange={e => setShowEliminados(e.target.checked)}
                    style={{ marginRight: 8 }}
                />
                Mostrar tipos deshabilitados
            </label>
            <table className={styles.tipoTableUnico}>
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
                        <tr key={tipo.id} style={tipo.eliminado ? { opacity: 0.5 } : {}}>
                            <td>{tipo.id}</td>
                            <td>{tipo.nombre}</td>
                            <td>{tipo.eliminado ? "Deshabilitado" : "Activo"}</td>
                            <td>
                                <button
                                    className={styles.actionBtn}
                                    onClick={() => handleEdit(tipo)}
                                    disabled={tipo.eliminado}
                                >
                                    Editar
                                </button>
                                <button
                                    className={`${styles.actionBtn} ${tipo.eliminado ? styles.enable : styles.disable}`}
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
    );
};

export default AdminTipoPage;