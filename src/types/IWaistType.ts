export interface IWaistType {
  id: number;
  nombre: string;
  descripcion?: string;
  eliminado?: boolean; // <-- Agregado para soportar soft delete
}