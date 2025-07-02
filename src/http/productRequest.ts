import axios from "axios";
import { IProduct } from "../types/IProduct";

const APIURL = import.meta.env.VITE_API_URL;
const productosURL = `${APIURL}/productos`;

export interface IProductRequest {
  nombre: string;
  precio: number;
  precioOriginal?: number;
  descripcion?: string;
  marca?: string;
  imagenUrl?: string;
  categoriaId: number;
  colores: {
    color: string;
    imagenUrl: string;
    imagenesAdicionales: string[];
    talles: {
      talleId: number;
      stock: number;
    }[];
  }[];
}

// Obtener todos los productos (DTO estructurado)
export const getProductos = async (): Promise<IProduct[]> => {
  const token = localStorage.getItem('token');
  const response = await axios.get<IProduct[]>(`${productosURL}/dto`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
};

// Obtener producto por ID (DTO estructurado)
export const getProductoById = async (id: number): Promise<IProduct | null> => {
  const token = localStorage.getItem('token');
  const response = await axios.get<IProduct>(`${productosURL}/dto/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
};

// Crear producto con colores y talles
export const createProducto = async (producto: IProductRequest): Promise<IProduct> => {
  const token = localStorage.getItem('token');
  const response = await axios.post<IProduct>(
    `${productosURL}/con-colores`,
    producto,
    {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );
  return response.data;
};

// Actualizar producto (solo campos simples)
export const updateProducto = async (id: number, producto: Partial<IProduct>): Promise<IProduct> => {
  const token = localStorage.getItem('token');
  const response = await axios.put<IProduct>(`${productosURL}/${id}`, producto, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
};

// Eliminar producto
export const deleteProducto = async (id: number): Promise<void> => {
  const token = localStorage.getItem('token');
  await axios.delete(`${productosURL}/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

// Aplicar descuento a un producto (solo campos de precio, usando PATCH)
export const applyDiscount = async (id: number, discount: number): Promise<IProduct> => {
  const token = localStorage.getItem('token');
  const producto = await getProductoById(id);
  if (!producto) throw new Error("Producto no encontrado");

  const precioOriginal = producto.precioOriginal ?? producto.precio;
  const nuevoPrecio = Math.round(precioOriginal * (1 - discount / 100));

  // PATCH al endpoint correcto
  const response = await axios.patch<IProduct>(
    `${productosURL}/${id}/descuento`,
    {
      precio: nuevoPrecio,
      precioOriginal: precioOriginal,
    },
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );
  return response.data;
};

// Quitar descuento (restaurar precio original, usando PATCH)
export const removeDiscount = async (id: number): Promise<IProduct> => {
  const token = localStorage.getItem('token');
  const producto = await getProductoById(id);
  if (!producto) throw new Error("Producto no encontrado");

  if (!producto.precioOriginal) return producto;

  const response = await axios.patch<IProduct>(
    `${productosURL}/${id}/descuento`,
    {
      precio: producto.precioOriginal,
      precioOriginal: null,
    },
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );
  return response.data;
};
