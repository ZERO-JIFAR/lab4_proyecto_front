import React, { useEffect, useState } from "react";
import { getWaistTypes } from "../../../http/waistTypeRequest";
import axios from "axios";
import { IWaistType } from "../../../types/IWaistType";

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

    // Soft delete/habilitar
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
        <div style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
            <h2>Administrar Tipos de Talle</h2>
            <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
                <div>
                    <label>Nombre:</label>
                    <input
                        type="text"
                        value={nombre}
                        onChange={e => setNombre(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">{editId ? "Actualizar" : "Agregar"}</button>
                {editId && <button type="button" onClick={handleCancel}>Cancelar</button>}
                {error && <div style={{ color: "red" }}>{error}</div>}
            </form>
            <label>
                <input
                    type="checkbox"
                    checked={showEliminados}
                    onChange={e => setShowEliminados(e.target.checked)}
                    style={{ marginRight: 8 }}
                />
                Mostrar tipos de talle deshabilitados
            </label>
            <table border={1} cellPadding={8} style={{ width: "100%", marginTop: 12 }}>
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
                        <tr key={wt.id} style={wt.eliminado ? { opacity: 0.5 } : {}}>
                            <td>{wt.id}</td>
                            <td>{wt.nombre}</td>
                            <td>{wt.eliminado ? "Deshabilitado" : "Activo"}</td>
                            <td>
                                <button onClick={() => handleEdit(wt)} disabled={wt.eliminado}>Editar</button>
                                <button
                                    onClick={() => handleToggleActivo(wt)}
                                    style={{
                                        background: wt.eliminado ? "#4caf50" : "#f44336",
                                        color: "#fff",
                                        marginLeft: 8
                                    }}
                                >
                                    {wt.eliminado ? "Habilitar" : "Deshabilitar"}
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