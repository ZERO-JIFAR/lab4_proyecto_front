import axios from "axios";
import { IProduct } from "../types/IProduct";

const APIURL = import.meta.env.VITE_API_URL;
const productosURL = `${APIURL}/productos`;

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

export const applyDiscount = async (id: number, discount: number): Promise<IProduct> => {
  const token = localStorage.getItem('token');
  // Obtén el producto actual para saber el precio original
  const producto = await getProductoById(id);
  if (!producto) throw new Error("Producto no encontrado");

  // Si ya tiene precioOriginal, úsalo, si no, guarda el precio actual como original
  const precioOriginal = producto.precioOriginal ?? producto.precio;

  // Calcula el nuevo precio con descuento
  const nuevoPrecio = Math.round(precioOriginal * (1 - discount / 100));

  // Actualiza el producto
  const response = await axios.put<IProduct>(
    `${productosURL}/${id}`,
    {
      ...producto,
      precio: nuevoPrecio,
      precioOriginal: precioOriginal,
    },
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );
  return response.data;
};

export const removeDiscount = async (id: number): Promise<IProduct> => {
  const token = localStorage.getItem('token');
  const producto = await getProductoById(id);
  if (!producto) throw new Error("Producto no encontrado");

  // Si no hay precioOriginal, no hay nada que restaurar
  if (!producto.precioOriginal) return producto;

  // Restaurar el precio original
  const response = await axios.put<IProduct>(
    `${productosURL}/${id}`,
    {
      ...producto,
      precio: producto.precioOriginal,
      precioOriginal: undefined, // Limpia el campo si quieres
    },
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );
  return response.data;
};