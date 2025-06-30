import { ITalleStock } from "../types/IProduct";

export interface IColorProductRequest {
  color: string;
  imagenUrl: string;
  imagenesAdicionales: string[];
  talles: {
    talleId: number;
    stock: number;
  }[];
}