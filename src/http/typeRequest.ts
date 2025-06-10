import axios from "axios";
import { ITipo } from "../types/IType";


const API_URL = "http://localhost:9000/api/tipos";


export const getTipos = async (): Promise<ITipo[]> => {
  const response = await axios.get<ITipo[]>(API_URL);
  return response.data;
};


export const getTipoById = async (id: number): Promise<ITipo | null> => {
  const response = await axios.get<ITipo>(`${API_URL}/${id}`);
  return response.data;
};


export const createTipo = async (tipo: Omit<ITipo, "id">): Promise<ITipo> => {
  const response = await axios.post<ITipo>(API_URL, tipo);
  return response.data;
};


export const updateTipo = async (id: number, tipo: Omit<ITipo, "id">): Promise<ITipo> => {
  const response = await axios.put<ITipo>(`${API_URL}/${id}`, tipo);
  return response.data;
};

export const deleteTipo = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};