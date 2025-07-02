export interface ITalle {
    id: number;
    nombre: string;
    valor: string;
    tipoTalle?: any;
    eliminado?: boolean; // <-- Agregado para soportar soft delete
}