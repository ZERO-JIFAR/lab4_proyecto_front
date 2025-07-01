import React, { useEffect, useState } from "react";
import { getTalles } from "../../../http/talleRequest";
import { getWaistTypes } from "../../../http/waistTypeRequest";
import axios from "axios";
import { ITalle } from "../../../types/ITalle";
import { IWaistType } from "../../../types/IWaistType";
import styles from "./AdminTallePage.module.css";

const APIURL = import.meta.env.VITE_API_URL;

const AdminTallePage: React.FC = () => {
    const [talles, setTalles] = useState<ITalle[]>([]);
    const [waistTypes, setWaistTypes] = useState<IWaistType[]>([]);
    const [valor, setValor] = useState(""); // Nombre visible del talle
    const [nombre, setNombre] = useState(""); // Descripción del talle
    const [waistTypeId, setWaistTypeId] = useState<number | "">("");
    const [editId, setEditId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showEliminados, setShowEliminados] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

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
        if (!valor || !nombre || !waistTypeId) {
            setError("Todos los campos son obligatorios");
            return;
        }
        setError(null);
        try {
            const token = localStorage.getItem("token");
            if (editId) {
                await axios.put(
                    `${APIURL}/talles/${editId}`,
                    { valor, nombre, tipoTalle: { id: waistTypeId } },
                    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
                );
            } else {
                await axios.post(
                    `${APIURL}/talles`,
                    { valor, nombre, tipoTalle: { id: waistTypeId } },
                    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
                );
            }
            setValor("");
            setNombre("");
            setWaistTypeId("");
            setEditId(null);
            setModalOpen(false);
            fetchData();
        } catch {
            setError("Error al guardar el talle");
        }
    };

    const handleEdit = (talle: ITalle) => {
        setEditId(talle.id);
        setValor(talle.valor);
        setNombre(talle.nombre);
        setWaistTypeId(talle.tipoTalle?.id || "");
        setModalOpen(true);
    };

    // Soft delete/habilitar
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
        setValor("");
        setNombre("");
        setWaistTypeId("");
        setError(null);
        setModalOpen(false);
    };

    const tallesFiltrados = talles.filter(t => showEliminados ? true : !t.eliminado);

    // Modal centrado y con fondo oscuro
    const Modal = ({ children }: { children: React.ReactNode }) => (
        <div
            style={{
                position: "fixed",
                top: 0, left: 0, right: 0, bottom: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(0,0,0,0.45)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000
            }}
        >
            <div
                style={{
                    background: "#fff",
                    borderRadius: "16px",
                    boxShadow: "0 4px 32px rgba(0,0,0,0.18)",
                    padding: "2vw 2vw 1vw 2vw",
                    minWidth: 320,
                    maxWidth: "95vw",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}
            >
                {children}
            </div>
        </div>
    );

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Administrar Talles</h2>
            <button
                className={styles.formButton}
                style={{
                    marginBottom: "24px",
                    padding: "1vw 2vw",
                    borderRadius: "0.8vw",
                    border: "none",
                    background: "#ef4444",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "1.08rem",
                    cursor: "pointer",
                    transition: "background 0.2s, box-shadow 0.2s",
                    boxShadow: "0 2px 8px rgba(239,68,68,0.10)"
                }}
                onClick={() => {
                    setEditId(null);
                    setValor("");
                    setNombre("");
                    setWaistTypeId("");
                    setError(null);
                    setModalOpen(true);
                }}
            >
                + Agregar Talle
            </button>
            {modalOpen && (
                <Modal>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <label htmlFor="talleValorUnico">Nombre (visible):</label>
                        <input
                            id="talleValorUnico"
                            type="text"
                            value={valor}
                            onChange={e => setValor(e.target.value)}
                            required
                            placeholder="Ej: S, M, L, 38, 40, 42..."
                        />
                        <label htmlFor="talleNombreUnico">Descripción:</label>
                        <input
                            id="talleNombreUnico"
                            type="text"
                            value={nombre}
                            onChange={e => setNombre(e.target.value)}
                            required
                            placeholder="Descripción del talle (opcional)"
                        />
                        <label htmlFor="talleTipoUnico">Tipo de Talle:</label>
                        <select
                            id="talleTipoUnico"
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
                        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                            <button type="submit" className={styles.formButton}>
                                {editId ? "Actualizar" : "Agregar"}
                            </button>
                            <button type="button" className={styles.formButton} style={{ background: "#fff", color: "#ef4444", border: "2px solid #ef4444", marginLeft: 8 }} onClick={handleCancel}>
                                Cancelar
                            </button>
                        </div>
                        {error && <div style={{ color: "#ef4444", marginTop: 10, fontWeight: 600 }}>{error}</div>}
                    </form>
                </Modal>
            )}
            <label>
                <input
                    type="checkbox"
                    checked={showEliminados}
                    onChange={e => setShowEliminados(e.target.checked)}
                    style={{ marginRight: 8 }}
                />
                Mostrar talles deshabilitados
            </label>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Tipo de Talle</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {tallesFiltrados.map(talle => (
                        <tr key={talle.id} style={talle.eliminado ? { opacity: 0.5 } : {}}>
                            <td>{talle.id}</td>
                            <td>{talle.valor}</td>
                            <td>{talle.nombre}</td>
                            <td>{talle.tipoTalle?.nombre || "-"}</td>
                            <td>{talle.eliminado ? "Deshabilitado" : "Activo"}</td>
                            <td>
                                <button
                                    className={styles.actionBtn}
                                    onClick={() => handleEdit(talle)}
                                    disabled={talle.eliminado}
                                >
                                    Editar
                                </button>
                                <button
                                    className={`${styles.actionBtn} ${talle.eliminado ? styles.enable : styles.disable}`}
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
    );
};

export default AdminTallePage;