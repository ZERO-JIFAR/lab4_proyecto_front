import { ICategory } from "./ICategory";

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
  image?: string;
}