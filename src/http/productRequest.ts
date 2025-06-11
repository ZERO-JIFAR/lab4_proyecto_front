import axios from "axios";
import { IProduct } from "../types/IProduct";

const productosURL = "http://localhost:9000/productos";

export const getProductos = async (): Promise<IProduct[]> => {
  const token = localStorage.getItem('token');
  const response = await axios.get<IProduct[]>(productosURL, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
};

export const getProductoById = async (id: number): Promise<IProduct | null> => {
  const token = localStorage.getItem('token');
  const response = await axios.get<IProduct>(`${productosURL}/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
};

export const createProducto = async (producto: Omit<IProduct, "id">): Promise<IProduct> => {
  const token = localStorage.getItem('token');
  const response = await axios.post<IProduct>(productosURL, producto, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
};

export const updateProducto = async (id: number, producto: Omit<IProduct, "id">): Promise<IProduct> => {
  const token = localStorage.getItem('token');
  const response = await axios.put<IProduct>(`${productosURL}/${id}`, producto, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
};

export const deleteProducto = async (id: number): Promise<void> => {
  const token = localStorage.getItem('token');
  await axios.delete(`${productosURL}/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};