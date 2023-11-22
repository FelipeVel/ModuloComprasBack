import { Request, Response } from 'express';
import { Controller } from '../common/interfaces/controller.interface';
import { Factura, DetalleFactura, Item, Inventario } from '../common/interfaces/factura.interface';
import { utilities } from '../common/utilities/util';
import oracledb, { Result } from 'oracledb';

interface RegFactura {
  idFactura: any;
  tipoDocumento: string;
  tipoPersona: string;
  codigoEmpleado: string;
  numDocumento: string;
  totalFactura: number;
}

export const controller: Controller = {
  createFacturaVenta: async (req: Request, res: Response) => {
    const factura: Factura = req.body;
    const queriesProductos: string[] = [];
    const queriesInventario: string[] = [];
    const paramsProductos: DetalleFactura[] = [];
    const paramsInventario: Inventario[] = [];
    try {
      const resultNFactura: Result<any> = await utilities.executeQuery(
        'SELECT seq_nfactura.NEXTVAL FROM dual',
        {}
      );
      const idFactura = resultNFactura.rows![0][0];
      const regFactura: RegFactura = {
        idFactura: idFactura,
        tipoDocumento: factura.persona.tipoDocumento,
        tipoPersona: factura.persona.tipoPersona,
        codigoEmpleado: factura.empleado.codigo,
        numDocumento: factura.persona.numeroDocumento,
        totalFactura: 0,
      };
      let i = 1;
      for (const producto of factura.items) {
        queriesProductos.push(
          `INSERT INTO DETALLEFACTURA (IDTIPOFAC, NFACTURA, ITEM, IDCATPRODUCTO, PRODUCTO, CANTIDAD, PRECIO) VALUES ('VE', :numFactura, :item, :categoriaProducto, :idProducto, :cantidad, :precio)`
        );
        paramsProductos.push({
          numFactura: idFactura,
          item: i,
          categoriaProducto: producto.producto.categoria.id,
          idProducto: producto.producto.id,
          cantidad: producto.cantidad,
          precio: parseFloat(producto.producto.precio.toFixed(2)),
        });
        queriesInventario.push(
          `INSERT INTO INVENTARIO (IDTIPOFAC, NFACTURA, ITEM, IDCATPRODUCTO, PRODUCTO, FECHAINVE, SALEN, EXISTENCIA) VALUES ('VE', :numFactura, :item, :categoriaProducto, :idProducto, SYSDATE, :cantidad, :existencia)`
        );
        paramsInventario.push({
          numFactura: idFactura,
          item: i,
          categoriaProducto: producto.producto.categoria.id,
          idProducto: producto.producto.id,
          cantidad: producto.cantidad,
          existencia: producto.producto.stock - producto.cantidad,
        });
        i++;
      }
      utilities
        .executeTransaction(
          [
            "INSERT INTO FACTURA (NFACTURA, IDTIPOFAC, IDTIPODOC, IDTIPOPERSONA, NDOCUMENTO, CODEMPLEADO, FECHAFACTURA, TOTALFACTURA) VALUES (:idFactura, 'VE', :tipoDocumento, :tipoPersona, :numDocumento, :codigoEmpleado, SYSDATE, :totalFactura)",
            ...queriesProductos,
            ...queriesInventario,
          ],
          [regFactura, ...paramsProductos, ...paramsInventario]
        )
        .then(() => {
          res.status(201).send({ message: 'Factura creada' });
        });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: 'Error' });
    }
  },

  createFacturaCompra: async (req: Request, res: Response) => {
    const factura: Factura = req.body;
    const queriesProductos: string[] = [];
    const queriesInventario: string[] = [];
    const paramsProductos: DetalleFactura[] = [];
    const paramsInventario: Inventario[] = [];
    try {
      const resultNFactura: Result<any> = await utilities.executeQuery(
        'SELECT seq_nfactura.NEXTVAL FROM dual',
        {}
      );
      const idFactura = resultNFactura.rows![0][0];
      const regFactura: RegFactura = {
        idFactura: idFactura,
        tipoDocumento: factura.persona.tipoDocumento,
        tipoPersona: factura.persona.tipoPersona,
        codigoEmpleado: factura.empleado.codigo,
        numDocumento: factura.persona.numeroDocumento,
        totalFactura: 0,
      };
      let i = 1;
      for (const producto of factura.items) {
        queriesProductos.push(
          `INSERT INTO DETALLEFACTURA (IDTIPOFAC, NFACTURA, ITEM, IDCATPRODUCTO, PRODUCTO, CANTIDAD, PRECIO) VALUES ('CO', :numFactura, :item, :categoriaProducto, :idProducto, :cantidad, :precio)`
        );
        paramsProductos.push({
          numFactura: idFactura,
          item: i,
          categoriaProducto: producto.producto.categoria.id,
          idProducto: producto.producto.id,
          cantidad: producto.cantidad,
          precio: parseFloat(producto.producto.precio.toFixed(2)),
        });
        queriesInventario.push(
          `INSERT INTO INVENTARIO (IDTIPOFAC, NFACTURA, ITEM, IDCATPRODUCTO, PRODUCTO, FECHAINVE, ENTRAN, EXISTENCIA) VALUES ('CO', :numFactura, :item, :categoriaProducto, :idProducto, SYSDATE, :cantidad, :existencia)`
        );
        paramsInventario.push({
          numFactura: idFactura,
          item: i,
          categoriaProducto: producto.producto.categoria.id,
          idProducto: producto.producto.id,
          cantidad: producto.cantidad,
          existencia: producto.producto.stock + producto.cantidad,
        });
        i++;
      }
      utilities
        .executeTransaction(
          [
            "INSERT INTO FACTURA (NFACTURA, IDTIPOFAC, IDTIPODOC, IDTIPOPERSONA, NDOCUMENTO, CODEMPLEADO, FECHAFACTURA, TOTALFACTURA) VALUES (:idFactura, 'CO', :tipoDocumento, :tipoPersona, :numDocumento, :codigoEmpleado, SYSDATE, :totalFactura)",
            ...queriesProductos,
            ...queriesInventario,
          ],
          [regFactura, ...paramsProductos, ...paramsInventario]
        )
        .then(() => {
          res.status(201).send({ message: 'Factura creada' });
        });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: 'Error' });
    }
  },
};
