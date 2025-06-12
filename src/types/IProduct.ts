import { ICategory } from "./ICategory";
import { ITalleProducto } from "./ITalleProducto";

export interface IProduct {
  id: number;
  nombre: string;
  cantidad: number;
  precio: number;
  descripcion?: string;
  color?: string;
  marca?: string;
  eliminado: boolean;
  categoria: ICategory;
  imagenUrl?: string; // <-- CAMBIO AQUÍ
  talles: ITalleProducto[];
}