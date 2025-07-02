import axios from "axios";
import { ICategory } from "../types/ICategory";

const APIURL = import.meta.env.VITE_API_URL;
const categoriasURL = `${APIURL}/categorias`;

export const getCategorias = async (): Promise<ICategory[]> => {
  const token = localStorage.getItem('token');
  const response = await axios.get<ICategory[]>(categoriasURL, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
};