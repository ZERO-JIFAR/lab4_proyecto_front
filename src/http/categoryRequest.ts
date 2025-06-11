import axios from "axios";
import { ICategory } from "../types/ICategory";


const categoriasURL = "http://localhost:9000/categorias";

export const getCategorias = async (): Promise<ICategory[]> => {
  const token = localStorage.getItem('token');
  const response = await axios.get<ICategory[]>(categoriasURL, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
};