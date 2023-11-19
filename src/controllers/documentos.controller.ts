import { Result } from 'oracledb';
import { Controller } from '../common/interfaces/controller.interface';
import { utilities } from '../common/utilities/util';
import { TipoDocumento, TipoDocumentoDB } from '../common/interfaces/tipoDocumento.interface';
import { Request, Response } from 'express';

export const controller: Controller = {
  getTipos: async (req: Request, res: Response) => {
    const result: Result<TipoDocumentoDB[]> = await utilities.executeQuery(
      'SELECT * FROM TIPODOC',
      {}
    );
    console.log(result);
    const list: TipoDocumento[] = result.rows!.map((row: any) => {
      const tipo: TipoDocumento = {
        valor: row[0],
        nombre: row[1],
      };
      return tipo;
    });
    res.send(list);
  },
};
