export interface Factura {
  items: Item[];
  persona: Persona;
  empleado: Empleado;
  randomNumber: string;
}

// Generated by https://quicktype.io
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

export interface Item {
  cantidad: number;
  producto: Producto;
}

export interface Producto {
  id: string;
  nombre: string;
  precio: number;
  stock: number;
  categoria: Categoria;
}

export interface Categoria {
  id: string;
  nombre: string;
}

export interface Persona {
  nombreCompleto: string;
  tipoPersona: string;
  tipoDocumento: string;
  numeroDocumento: string;
}

export interface FacturaDB {
  IDTIPOFAC: string;
  NFACTURA: string;
  IDTIPODOC: string;
  IDTIPOPERSONA: string;
  NDOCUMENTO: string;
  FAC_IDTIPOFAC: string;
  FAC_NFACTURA: string;
  CODEMPLEADO: string;
  FECHAFACTURA: Date;
  TOTALFACTURA: number;
}

export interface DetalleFacturaDB {
  IDTIPOFAC: string;
  NFACTURA: string;
  IDCATPRODUCTO: string;
  PRODUCTO: string;
  ITEM: number;
  CANTIDAD: number;
  PRECIO: number;
}

export interface DetalleFactura {
  numFactura: string;
  item: number;
  categoriaProducto: string;
  idProducto: string;
  cantidad: number;
  precio: number;
}

export interface InventarioDB {
  CONSECINVEN: number;
  IDTIPOFAC: string;
  NFACTURA: string;
  IDCATPRODUCTO: string;
  PRODUCTO: string;
  INV_CONSECINVEN: number;
  FECHAINVE: Date;
  SALEN: number;
  ENTRAN: number;
  EXISTENCIA: number;
}

export interface Inventario {
  numFactura: string;
  categoriaProducto: string;
  item: number;
  idProducto: string;
  inventarioPadre?: number;
  cantidad: number;
  existencia: number;
}
