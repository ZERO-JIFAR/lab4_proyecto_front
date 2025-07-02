import { ICategory } from "./ICategory";

export interface IProduct {
  id: number;
  nombre: string;
  cantidad?: number;
  precio: number;
  precioOriginal?: number;
  descripcion?: string;
  marca?: string;
  eliminado: boolean;
  categoria: ICategory;
  imagenUrl?: string;
  colores: IColorProducto[];
}

export interface IColorProducto {
  id?: number;
  color: string;
  imagenUrl: string;
  imagenesAdicionales: string[];
  talles: ITalleStock[];
}

export interface ITalleStock {
  talleId: number;
  talleValor?: string;
  stock: number;
}