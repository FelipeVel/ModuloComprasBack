export interface Empleado {
  codigo: string;
  nombre: string;
  apellido: string;
  correo: string;
  cargo: Cargo;
}

export interface Cargo {
  codigo: string;
  nombre: string;
}
