import { ICategory } from "./ICategory";
import { ITalleProducto } from "./ITalleProducto";

export interface IProduct {
  imagenesAdicionales: any;
  id: number;
  nombre: string;
  cantidad: number;
  precio: number;
  precioOriginal?: number; 
  descripcion?: string;
  color?: string;
  marca?: string;
  eliminado: boolean;
  categoria: ICategory;
  imagenUrl?: string;
  talles: ITalleProducto[];
  tallesProducto?: ITalleProducto[]; // <-- AGREGA ESTA LÍNEA
}