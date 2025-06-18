import axios from "axios";
import { ITalle } from "../types/ITalle";

const APIURL = import.meta.env.VITE_API_URL;
const tallesURL = `${APIURL}/talles`;

// Obtener todos los talles
export const getTalles = async (): Promise<ITalle[]> => {
    const token = localStorage.getItem('token');
    const response = await axios.get<ITalle[]>(tallesURL, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
};

// Obtener talles por tipoTalle (CORREGIDO)
export const getTallesByTipoId = async (tipoTalleId: number): Promise<ITalle[]> => {
    const token = localStorage.getItem('token');
    const response = await axios.get<ITalle[]>(`${tallesURL}/tipoTalle/${tipoTalleId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
};