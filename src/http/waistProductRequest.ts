import axios from "axios";
import { IWaistProduct } from "../types/IWaistProduct";

const APIURL = import.meta.env.VITE_API_URL;
const waistProductsURL = `${APIURL}/talleProducto`;

export const getWaistProducts = async (): Promise<IWaistProduct[]> => {
  const token = localStorage.getItem('token');
  const response = await axios.get<IWaistProduct[]>(waistProductsURL, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
};

export const getWaistProductById = async (id: number): Promise<IWaistProduct | null> => {
  const token = localStorage.getItem('token');
  const response = await axios.get<IWaistProduct>(`${waistProductsURL}/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
};

export const createWaistProduct = async (waistProduct: Omit<IWaistProduct, "id">): Promise<IWaistProduct> => {
  const token = localStorage.getItem('token');
  const response = await axios.post<IWaistProduct>(waistProductsURL, waistProduct, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
};

export const updateWaistProduct = async (id: number, waistProduct: Omit<IWaistProduct, "id">): Promise<IWaistProduct> => {
  const token = localStorage.getItem('token');
  const response = await axios.put<IWaistProduct>(`${waistProductsURL}/${id}`, waistProduct, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
};

export const deleteWaistProduct = async (id: number): Promise<void> => {
  const token = localStorage.getItem('token');
  await axios.delete(`${waistProductsURL}/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};