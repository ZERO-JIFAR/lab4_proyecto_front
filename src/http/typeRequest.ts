import axios from "axios";
import { ITipo } from "../types/IType";

const APIURL = import.meta.env.VITE_API_URL;
const baseURL = `${APIURL}/tipos`;

export const getTipos = async (): Promise<ITipo[]> => {
  const token = localStorage.getItem('token');
  const response = await axios.get<ITipo[]>(baseURL, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
};

export const getTipoById = async (id: number): Promise<ITipo | null> => {
  const response = await axios.get<ITipo>(`${baseURL}/${id}`);
  return response.data;
};

export const createTipo = async (tipo: Omit<ITipo, "id">): Promise<ITipo> => {
  const token = localStorage.getItem('token');
  const response = await axios.post<ITipo>(baseURL, tipo, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
};

export const updateTipo = async (id: number, tipo: Omit<ITipo, "id">): Promise<ITipo> => {
  const token = localStorage.getItem('token');
  const response = await axios.put<ITipo>(`${baseURL}/${id}`, tipo, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
};

export const deleteTipo = async (id: number): Promise<void> => {
  const token = localStorage.getItem('token');
  await axios.delete(`${baseURL}/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};