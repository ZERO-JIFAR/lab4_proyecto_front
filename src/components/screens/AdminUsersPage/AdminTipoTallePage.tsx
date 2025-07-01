import React, { useEffect, useState, useRef, memo } from "react";
import { getTipos } from "../../../http/typeRequest";
import axios from "axios";
import { ITipo } from "../../../types/IType";
import styles from "./AdminTipoPage.module.css";

const APIURL = import.meta.env.VITE_API_URL;

// ✅ Modal completamente desacoplado y memoizado
const Modal = memo(({
    children,
    onClose,
}: {
    children: React.ReactNode;
    onClose: () => void;
}) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    return (
        <div className={styles.tipoModalOverlayUnico} onClick={onClose}>
            <div className={styles.tipoModalUnico} onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
});

const AdminTipoTallePage: React.FC = () => {
    const [tipos, setTipos] = useState<ITipo[]>([]);
    const [inputNombre, setInputNombre] = useState<string>("");
    const [editId, setEditId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showEliminados, setShowEliminados] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

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
            fetchData();
        } catch {
            setError("Error al guardar el tipo");
        }
    };

    const handleEdit = (tipo: ITipo) => {
        setEditId(tipo.id);
        setInputNombre(tipo.nombre);
        setModalOpen(true);
    };

    const handleAgregar = () => {
        setEditId(null);
        setInputNombre("");
        setError(null);
        setModalOpen(true);
    };

    const handleToggleActivo = async (tipo: ITipo) => {
        if (!window.confirm(tipo.eliminado ? "¿Seguro que deseas habilitar este tipo?" : "¿Seguro que deseas deshabilitar este tipo?")) return;
        try {
            const token = localStorage.getItem("token");
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            await axios.patch(`${APIURL}/tipos/${tipo.id}`, { eliminado: !tipo.eliminado }, { headers });
            fetchData();
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

            {/* ✅ Renderiza el modal solo si está abierto */}
            {modalOpen && (
                <Modal onClose={handleCancel}>
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

export default AdminTipoTallePage;