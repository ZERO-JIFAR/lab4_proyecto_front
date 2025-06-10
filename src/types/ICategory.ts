import { ITipo } from "./IType";

export interface ICategory {
  id: number;
  nombre: string;
  descripcion?: string;
  eliminado: boolean;
  idTipo: ITipo; 
}