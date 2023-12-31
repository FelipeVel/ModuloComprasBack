import { z } from 'zod';

// Generated by https://quicktype.io

export const PersonaInSchema = z.object({
  nombre: z.string(),
  apellido: z.string(),
  tipoPersona: z.string(),
  tipoDocumento: z.string(),
  numeroDocumento: z.string(),
  direcciones: z.array(
    z.object({
      tipoVia: z.string(),
      viaPrincipal: z.string(),
      letraVia: z.string(),
      prefijo: z.array(z.string()),
      letraPrefijo: z.string(),
      cuadrante: z.string(),
      viaGeneradora: z.string(),
      letraViaGeneradora: z.string(),
      sufijo: z.array(z.string()),
      letraSufijo: z.string(),
      placa: z.number(),
      cuadrantePlaca: z.string(),
      barrio: z.string(),
      nombreBarrio: z.string(),
      manzana: z.string(),
      numeroManzana: z.string(),
      urbanizacion: z.string(),
      nombreUrbanizacion: z.string(),
      tipoPredio: z.string(),
      identificadorPredio: z.string(),
      complemento: z.string(),
    })
  ),
  contactos: z.array(
    z.object({
      descContacto: z.string().min(1).max(50),
      tipoContacto: z.string().min(1).max(2),
    })
  ),
});

export interface PersonaIn {
  nombre: string;
  apellido: string;
  tipoPersona: string;
  tipoDocumento: string;
  numeroDocumento: string;
  direcciones?: Direccion[];
  contactos?: Contacto[];
}

export interface Contacto {
  descContacto: string;
  tipoContacto: string;
}

export interface ContactoDB {
  IDTIPOCONTACTO: string;
  IDTIPODOC: string;
  IDTIPOPERSONA: string;
  NDOCUMENTO: string;
  DESCCONTACTO: string;
}

export interface Direccion {
  tipoVia: string;
  viaPrincipal: string;
  letraVia: string;
  prefijo: string;
  letraPrefijo: string;
  cuadrante: string;
  viaGeneradora: string;
  letraViaGeneradora: string;
  sufijo: string;
  letraSufijo: string;
  placa: number;
  cuadrantePlaca: string;
  barrio: string;
  nombreBarrio: string;
  manzana: string;
  numeroManzana: string;
  urbanizacion: string;
  nombreUrbanizacion: string;
  tipoPredio: string;
  identificadorPredio: string;
  complemento: string;
}

export interface DireccionDB {
  IDDIRECCION?: number;
  POSICION: number;
  IDTIPODOC: string;
  IDTIPOPERSONA: string;
  NDOCUMENTO: string;
  IDNOMEN?: number;
  VALORDIREC?: string;
}

export interface PersonaDB {
  NOMBRE: string;
  APELLIDO: string;
  IDTIPOPERSONA: string;
  IDTIPODOC: string;
  NDOCUMENTO: string;
}

export interface TipoPersona {
  id: string;
  nombre: string;
}
