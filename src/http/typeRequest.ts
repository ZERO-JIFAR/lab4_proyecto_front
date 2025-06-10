import axios from "axios";
import { ITipo } from "../types/IType";

const APIURL = import.meta.env.VITE_API_URL;
const baseURL = `${APIURL}/tipos`;

export const getTipos = async (): Promise<ITipo[]> => {
  const response = await axios.get<ITipo[]>(baseURL);
  return response.data;
};


export const getTipoById = async (id: number): Promise<ITipo | null> => {
  const response = await axios.get<ITipo>(`${baseURL}/${id}`);
  return response.data;
};


export const createTipo = async (tipo: Omit<ITipo, "id">): Promise<ITipo> => {
  const response = await axios.post<ITipo>(baseURL, tipo);
  return response.data;
};


export const updateTipo = async (id: number, tipo: Omit<ITipo, "id">): Promise<ITipo> => {
  const response = await axios.put<ITipo>(`${baseURL}/${id}`, tipo);
  return response.data;
};

export const deleteTipo = async (id: number): Promise<void> => {
  await axios.delete(`${baseURL}/${id}`);
};