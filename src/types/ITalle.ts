export interface ITalle {
    id: number;
    nombre: string;
    valor: string; // <-- ahora puedes usar t.valor en el modal
    tipoTalle?: any; // opcional, si necesitas acceder al tipo de talle
}