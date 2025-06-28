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
                    `${APIURL}/tipo-talles/${editId}`,
                    { nombre },
                    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
                );
            } else {
                await axios.post(
                    `${APIURL}/tipo-talles`,
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

    const handleDelete = async (id: number) => {
        if (!window.confirm("¿Seguro que deseas eliminar este tipo de talle?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${APIURL}/tipo-talles/${id}`, {
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
        setError(null);
    };

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
            <table border={1} cellPadding={8} style={{ width: "100%" }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {waistTypes.map(wt => (
                        <tr key={wt.id}>
                            <td>{wt.id}</td>
                            <td>{wt.nombre}</td>
                            <td>
                                <button onClick={() => handleEdit(wt)}>Editar</button>
                                <button onClick={() => handleDelete(wt.id)}>
                                    Eliminar
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