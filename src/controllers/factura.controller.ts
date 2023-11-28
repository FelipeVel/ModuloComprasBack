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
  facturaPadre?: string;
  tipoFacturaPadre?: string;
  numDocumento: string;
  totalFactura: number;
}

export const controller: Controller = {
  getFacturaByNum: async (req: Request, res: Response) => {
    const numFactura: string = req.params.numFactura;
    const tipoFactura: string = req.params.tipoFactura;
    try {
      const result: Result<any> = await utilities.executeQuery(
        `SELECT DF.CANTIDAD, P.PRODUCTO, P.NOMPRODUCTO, DF.PRECIO, CP.IDCATPRODUCTO, CP.DESCATPRODUCTO, DF.IDTIPOFAC
        FROM DETALLEFACTURA DF, PRODUCTO P, CATPRODUCTO CP
        WHERE DF.NFACTURA = :numFactura AND
        DF.PRODUCTO = P.PRODUCTO AND
        DF.IDCATPRODUCTO =P.IDCATPRODUCTO AND
        P.IDCATPRODUCTO = CP.IDCATPRODUCTO`,
        { numFactura }
      );
      if (
        (tipoFactura === 'DV' && result.rows![0][6] !== 'VE') ||
        (tipoFactura === 'DC' && result.rows![0][6] !== 'CO')
      ) {
        throw new Error('La devolucion no corresponde con el tipo de factura');
      }
      const items: Item[] = [];
      for (const row of result.rows!) {
        const item: Item = {
          cantidad: row[0],
          producto: {
            id: row[1],
            nombre: row[2],
            precio: row[3],
            stock: row[0],
            categoria: {
              id: row[4],
              nombre: row[5],
            },
          },
        };
        items.push(item);
      }
      res.status(200).send(items);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: 'Error', error });
    }
  },

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
        tipoDocumento: factura.persona!.tipoDocumento,
        tipoPersona: factura.persona!.tipoPersona,
        codigoEmpleado: factura.empleado!.codigo,
        numDocumento: factura.persona!.numeroDocumento,
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
          res.status(201).send({ message: 'Factura creada', numFactura: idFactura });
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
        tipoDocumento: factura.persona!.tipoDocumento,
        tipoPersona: factura.persona!.tipoPersona,
        codigoEmpleado: factura.empleado!.codigo,
        numDocumento: factura.persona!.numeroDocumento,
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

  createFacturaDevolucionVenta: async (req: Request, res: Response) => {
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
      const facturaPadreResult: Result<any> = await utilities.executeQuery(
        'SELECT IDTIPODOC, IDTIPOPERSONA, NDOCUMENTO FROM FACTURA WHERE NFACTURA = :numFactura',
        { numFactura: factura.numFactura }
      );
      const regFactura: RegFactura = {
        idFactura: idFactura,
        facturaPadre: factura.numFactura!,
        codigoEmpleado: factura.empleado!.codigo,
        totalFactura: 0,
        tipoDocumento: facturaPadreResult.rows![0][0],
        tipoPersona: facturaPadreResult.rows![0][1],
        numDocumento: facturaPadreResult.rows![0][2],
      };
      let i = 1;
      for (const producto of factura.items) {
        queriesProductos.push(
          `INSERT INTO DETALLEFACTURA (IDTIPOFAC, NFACTURA, ITEM, IDCATPRODUCTO, PRODUCTO, CANTIDAD, PRECIO) VALUES ('DV', :numFactura, :item, :categoriaProducto, :idProducto, :cantidad, :precio)`
        );
        paramsProductos.push({
          numFactura: idFactura,
          item: i,
          categoriaProducto: producto.producto.categoria.id,
          idProducto: producto.producto.id,
          cantidad: producto.cantidad,
          precio: parseFloat(producto.producto.precio.toFixed(2)),
        });
        const existenciaResult: Result<any> = await utilities.executeQuery(
          'SELECT EXISTENCIA FROM INVENTARIO WHERE IDCATPRODUCTO = :categoriaProducto AND PRODUCTO = :idProducto AND FECHAINVE = (SELECT MAX(FECHAINVE) FROM INVENTARIO WHERE IDCATPRODUCTO = :categoriaProducto AND PRODUCTO = :idProducto)',
          {
            categoriaProducto: producto.producto.categoria.id,
            idProducto: producto.producto.id,
          }
        );
        const existencia = existenciaResult.rows![0][0];
        const consecResult: Result<any> = await utilities.executeQuery(
          'SELECT CONSECINVEN FROM INVENTARIO WHERE IDTIPOFAC = "VE" AND NFACTURA = :numFactura',
          { numFactura: factura.numFactura }
        );
        const consec = consecResult.rows![0][0];
        queriesInventario.push(
          `INSERT INTO INVENTARIO (IDTIPOFAC, NFACTURA, ITEM, IDCATPRODUCTO, PRODUCTO, FECHAINVE, SALEN, EXISTENCIA, INV_CONSECINVEN) VALUES ('DV', :numFactura, :item, :categoriaProducto, :idProducto, SYSDATE, :cantidad, :existencia, :consecPadre)`
        );
        paramsInventario.push({
          numFactura: idFactura,
          item: i,
          categoriaProducto: producto.producto.categoria.id,
          idProducto: producto.producto.id,
          cantidad: producto.cantidad,
          existencia: existencia + producto.cantidad,
          consecPadre: consec,
        });
        i++;
      }
      utilities
        .executeTransaction(
          [
            "INSERT INTO FACTURA (NFACTURA, IDTIPOFAC, IDTIPODOC, IDTIPOPERSONA, NDOCUMENTO, CODEMPLEADO, FECHAFACTURA, TOTALFACTURA, FAC_IDTIPOFAC, FAC_NFACTURA) VALUES (:idFactura, 'DV', :tipoDocumento, :tipoPersona, :numDocumento, :codigoEmpleado, SYSDATE, :totalFactura, 'VE', :facturaPadre)",
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

  createFacturaDevolucionCompra: async (req: Request, res: Response) => {
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
      const facturaPadreResult: Result<any> = await utilities.executeQuery(
        'SELECT IDTIPODOC, IDTIPOPERSONA, NDOCUMENTO FROM FACTURA WHERE NFACTURA = :numFactura',
        { numFactura: factura.numFactura }
      );
      const regFactura: RegFactura = {
        idFactura: idFactura,
        facturaPadre: factura.numFactura!,
        codigoEmpleado: factura.empleado!.codigo,
        totalFactura: 0,
        tipoDocumento: facturaPadreResult.rows![0][0],
        tipoPersona: facturaPadreResult.rows![0][1],
        numDocumento: facturaPadreResult.rows![0][2],
      };
      let i = 1;
      for (const producto of factura.items) {
        queriesProductos.push(
          `INSERT INTO DETALLEFACTURA (IDTIPOFAC, NFACTURA, ITEM, IDCATPRODUCTO, PRODUCTO, CANTIDAD, PRECIO) VALUES ('DC', :numFactura, :item, :categoriaProducto, :idProducto, :cantidad, :precio)`
        );
        paramsProductos.push({
          numFactura: idFactura,
          item: i,
          categoriaProducto: producto.producto.categoria.id,
          idProducto: producto.producto.id,
          cantidad: producto.cantidad,
          precio: parseFloat(producto.producto.precio.toFixed(2)),
        });
        const existenciaResult: Result<any> = await utilities.executeQuery(
          'SELECT EXISTENCIA FROM INVENTARIO WHERE IDCATPRODUCTO = :categoriaProducto AND PRODUCTO = :idProducto AND FECHAINVE = (SELECT MAX(FECHAINVE) FROM INVENTARIO WHERE IDCATPRODUCTO = :categoriaProducto AND PRODUCTO = :idProducto)',
          {
            categoriaProducto: producto.producto.categoria.id,
            idProducto: producto.producto.id,
          }
        );
        const existencia = existenciaResult.rows![0][0];
        const consecResult: Result<any> = await utilities.executeQuery(
          "SELECT CONSECINVEN FROM INVENTARIO WHERE IDTIPOFAC = 'CO' AND NFACTURA = :numFactura AND PRODUCTO = :idProducto AND IDCATPRODUCTO = :categoriaProducto",
          {
            numFactura: factura.numFactura,
            idProducto: producto.producto.id,
            categoriaProducto: producto.producto.categoria.id,
          }
        );
        const consec = consecResult.rows![0][0];
        queriesInventario.push(
          `INSERT INTO INVENTARIO (IDTIPOFAC, NFACTURA, ITEM, IDCATPRODUCTO, PRODUCTO, FECHAINVE, SALEN, EXISTENCIA, INV_CONSECINVEN) VALUES ('DC', :numFactura, :item, :categoriaProducto, :idProducto, SYSDATE, :cantidad, :existencia, :consecPadre)`
        );
        paramsInventario.push({
          numFactura: idFactura,
          item: i,
          categoriaProducto: producto.producto.categoria.id,
          idProducto: producto.producto.id,
          cantidad: producto.cantidad,
          existencia: existencia - producto.cantidad,
          consecPadre: consec,
        });
        i++;
      }
      utilities
        .executeTransaction(
          [
            "INSERT INTO FACTURA (NFACTURA, IDTIPOFAC, IDTIPODOC, IDTIPOPERSONA, NDOCUMENTO, CODEMPLEADO, FECHAFACTURA, TOTALFACTURA, FAC_IDTIPOFAC, FAC_NFACTURA) VALUES (:idFactura, 'DC', :tipoDocumento, :tipoPersona, :numDocumento, :codigoEmpleado, SYSDATE, :totalFactura, 'CO', :facturaPadre)",
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
