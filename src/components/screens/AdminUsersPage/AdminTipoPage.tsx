import React, { useEffect, useState } from "react";
import { getTipos } from "../../../http/typeRequest";
import axios from "axios";
import { ITipo } from "../../../types/IType";

const APIURL = import.meta.env.VITE_API_URL;

const AdminTipoPage: React.FC = () => {
    const [tipos, setTipos] = useState<ITipo[]>([]);
    const [nombre, setNombre] = useState("");
    const [editId, setEditId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showEliminados, setShowEliminados] = useState(false);

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
            fetchData();
        } catch {
            setError("Error al guardar el tipo");
        }
    };

    const handleEdit = (tipo: ITipo) => {
        setEditId(tipo.id);
        setNombre(tipo.nombre);
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
    };

    const tiposFiltrados = tipos.filter(t => showEliminados ? true : !t.eliminado);

    return (
        <div style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
            <h2>Administrar Tipos</h2>
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
                Mostrar tipos deshabilitados
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
                    {tiposFiltrados.map(tipo => (
                        <tr key={tipo.id} style={tipo.eliminado ? { opacity: 0.5 } : {}}>
                            <td>{tipo.id}</td>
                            <td>{tipo.nombre}</td>
                            <td>{tipo.eliminado ? "Deshabilitado" : "Activo"}</td>
                            <td>
                                <button onClick={() => handleEdit(tipo)} disabled={tipo.eliminado}>Editar</button>
                                <button
                                    onClick={() => handleToggleActivo(tipo)}
                                    style={{
                                        background: tipo.eliminado ? "#4caf50" : "#f44336",
                                        color: "#fff",
                                        marginLeft: 8
                                    }}
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