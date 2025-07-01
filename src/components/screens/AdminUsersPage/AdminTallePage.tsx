import React, { useEffect, useState } from "react";
import { getTalles } from "../../../http/talleRequest";
import { getWaistTypes } from "../../../http/waistTypeRequest";
import axios from "axios";
import { ITalle } from "../../../types/ITalle";
import { IWaistType } from "../../../types/IWaistType";

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
        setNombre("");
        setValor("");
        setWaistTypeId("");
        setError(null);
    };

    const tallesFiltrados = talles.filter(t => showEliminados ? true : !t.eliminado);

    return (
        <div style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
            <h2>Administrar Talles</h2>
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
                <div>
                    <label>Valor:</label>
                    <input
                        type="text"
                        value={valor}
                        onChange={e => setValor(e.target.value)}
                        required
                    />
                </div>
                <div>
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
                Mostrar talles deshabilitados
            </label>
            <table border={1} cellPadding={8} style={{ width: "100%", marginTop: 12 }}>
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
                        <tr key={talle.id} style={talle.eliminado ? { opacity: 0.5 } : {}}>
                            <td>{talle.id}</td>
                            <td>{talle.nombre}</td>
                            <td>{talle.valor}</td>
                            <td>{talle.tipoTalle?.nombre || "-"}</td>
                            <td>{talle.eliminado ? "Deshabilitado" : "Activo"}</td>
                            <td>
                                <button onClick={() => handleEdit(talle)} disabled={talle.eliminado}>Editar</button>
                                <button
                                    onClick={() => handleToggleActivo(talle)}
                                    style={{
                                        background: talle.eliminado ? "#4caf50" : "#f44336",
                                        color: "#fff",
                                        marginLeft: 8
                                    }}
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