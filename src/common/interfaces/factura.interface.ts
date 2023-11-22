export interface Factura {
  items?: Item[];
  persona?: Persona[];
  randomNumber: string;
}

export interface Item {
  cantidad: number;
  producto: Producto[];
}

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  categoria: Categoria[];
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
