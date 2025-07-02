import React, { useEffect, useState, useRef } from "react";
import { getTipos } from "../../../http/typeRequest";
import axios from "axios";
import { ITipo } from "../../../types/IType";
import styles from "./AdminTipoPage.module.css";

const APIURL = import.meta.env.VITE_API_URL;

// --- Mueve Modal FUERA del componente principal ---
const Modal = ({
    children,
    isOpen,
}: {
    children: React.ReactNode;
    isOpen: boolean;
}) => {
    return (
        <div
            className={styles.tipoModalOverlayUnico}
            style={{ display: isOpen ? "flex" : "none" }}
        >
            <div className={styles.tipoModalUnico}>
                {children}
            </div>
        </div>
    );
};

const AdminTipoPage: React.FC = () => {
    const [tipos, setTipos] = useState<ITipo[]>([]);
    const [inputNombre, setInputNombre] = useState<string>("");
    const [editId, setEditId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showEliminados, setShowEliminados] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    const fetchData = async () => {
        try {
            const data = await getTipos();
            setTipos(data);
        } catch {
            setError("Error al cargar datos");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (modalOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [modalOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputNombre.trim()) {
            setError("El nombre es obligatorio");
            return;
        }

        setError(null);

        try {
            const token = localStorage.getItem("token");
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            if (editId) {
                await axios.put(`${APIURL}/tipos/${editId}`, { nombre: inputNombre }, { headers });
            } else {
                await axios.post(`${APIURL}/tipos`, { nombre: inputNombre }, { headers });
            }

            setInputNombre("");
            setEditId(null);
            setModalOpen(false);

            await fetchData();
        } catch (err) {
            setError("Error al guardar el tipo");
        }
    };

    const handleEdit = (tipo: ITipo) => {
        setEditId(tipo.id);
        setInputNombre(typeof tipo.nombre === "string" ? tipo.nombre : "");
        setError(null);
        setModalOpen(true);
    };

    const handleAgregar = () => {
        setEditId(null);
        setInputNombre("");
        setError(null);
        setModalOpen(true);
    };

    const handleToggleActivo = async (tipo: ITipo) => {
        const confirmMessage = tipo.eliminado
            ? "¿Seguro que deseas habilitar este tipo?"
            : "¿Seguro que deseas deshabilitar este tipo?";
        if (!window.confirm(confirmMessage)) return;

        try {
            const token = localStorage.getItem("token");
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            await axios.patch(`${APIURL}/tipos/${tipo.id}`, { eliminado: !tipo.eliminado }, { headers });
            await fetchData();
        } catch {
            setError("Error al actualizar el tipo");
        }
    };

    const handleCancel = () => {
        setEditId(null);
        setInputNombre("");
        setError(null);
        setModalOpen(false);
    };

    const tiposFiltrados = tipos.filter(t => showEliminados || !t.eliminado);

    return (
        <div className={styles.tipoContainerUnico}>
            <h2 className={styles.tipoTitleUnico}>Administrar Tipos</h2>

            <button
                className={styles.tipoBtnAgregarUnico}
                onClick={handleAgregar}
            >
                + Agregar Tipo
            </button>

            <Modal isOpen={modalOpen}>
                <form onSubmit={handleSubmit} className={styles.tipoFormUnico}>
                    <label htmlFor="tipoNombreUnico">Nombre del tipo:</label>
                    <input
                        id="tipoNombreUnico"
                        type="text"
                        ref={inputRef}
                        value={inputNombre}
                        onChange={e => setInputNombre(e.target.value)}
                        required
                        placeholder="Ej: Calzado, Indumentaria, Accesorios..."
                        className={styles.tipoInputUnico}
                        autoComplete="off"
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