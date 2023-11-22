import { Request, Response } from 'express';
import { Controller } from '../common/interfaces/controller.interface';
import { Factura, DetalleFacturaDB } from '../common/interfaces/factura.interface';
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
    const paramsProductos: DetalleFacturaDB[] = [];
    const regFactura: RegFactura = {
      idFactura: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      tipoDocumento: factura.persona.tipoDocumento,
      tipoPersona: factura.persona.tipoPersona,
      codigoEmpleado: factura.empleado.codigo,
      numDocumento: factura.persona.numeroDocumento,
      totalFactura: 0,
    };
    try {
      const result: Result<any> = await utilities.executeQuery(
        "INSERT INTO FACTURA (IDTIPOFAC, IDTIPODOC, IDTIPOPERSONA, NDOCUMENTO, CODEMPLEADO, FECHAFACTURA, TOTALFACTURA) VALUES ('1', :tipoDocumento, :tipoPersona, :codigoEmpleado, :numDocumento, SYSDATE, :totalFactura) RETURNING NFACTURA INTO :idFactura",
        regFactura,
        false
      );
      const idFactura = result.outBinds.idFactura[0];
    } catch (error) {
      console.log(error);
      await res.status(500).send({ message: 'Error' });
    }
  },
};
