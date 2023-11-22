import { Request, Response } from 'express';
import { Controller } from '../common/interfaces/controller.interface';
import { utilities } from '../common/utilities/util';
import {
  Factura,
  Item,
  Producto,
  Categoria,
  Persona,
  FacturaDB,
  DetalleFacturaDB,
  InventarioDB,
} from '../common/interfaces/factura.interface';
import { Result } from 'oracledb';

export const controller: Controller = {
  createFactura: async (req: Request, res: Response) => {
    const factura: Factura = req.body;
    const queriesProductos: string[] = [];
    const paramsProductos: DetalleFacturaDB[] = [];
    try {
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: 'Error' });
    }
  },
};
