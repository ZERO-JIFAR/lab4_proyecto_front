import axios from "axios";

export interface IWaistType {
  id: number;
  nombre: string;
  descripcion?: string;
}

const APIURL = import.meta.env.VITE_API_URL;
const waistTypesURL = `${APIURL}/tiposTalle`; // CORREGIDO

export const getWaistTypes = async (): Promise<IWaistType[]> => {
  const token = localStorage.getItem('token');
  const response = await axios.get<IWaistType[]>(waistTypesURL, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
};

export const getWaistTypeById = async (id: number): Promise<IWaistType | null> => {
  const token = localStorage.getItem('token');
  const response = await axios.get<IWaistType>(`${waistTypesURL}/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
};

export const createWaistType = async (waistType: Omit<IWaistType, "id">): Promise<IWaistType> => {
  const token = localStorage.getItem('token');
  const response = await axios.post<IWaistType>(waistTypesURL, waistType, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
};

// ...otros métodos si los tienes