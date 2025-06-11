import axios from "axios";
import { ITipo } from "../types/IType";

// Usar la URL directa para tipos, sin /api
const tiposURL = "http://localhost:9000/tipos";

export const getTipos = async (): Promise<ITipo[]> => {
  const token = localStorage.getItem('token');
  const response = await axios.get<ITipo[]>(tiposURL, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
};

export const getTipoById = async (id: number): Promise<ITipo | null> => {
  const response = await axios.get<ITipo>(`${tiposURL}/${id}`);
  return response.data;
};

export const createTipo = async (tipo: Omit<ITipo, "id">): Promise<ITipo> => {
  const token = localStorage.getItem('token');
  const response = await axios.post<ITipo>(tiposURL, tipo, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
};

export const updateTipo = async (id: number, tipo: Omit<ITipo, "id">): Promise<ITipo> => {
  const token = localStorage.getItem('token');
  const response = await axios.put<ITipo>(`${tiposURL}/${id}`, tipo, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
};

export const deleteTipo = async (id: number): Promise<void> => {
  const token = localStorage.getItem('token');
  await axios.delete(`${tiposURL}/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};