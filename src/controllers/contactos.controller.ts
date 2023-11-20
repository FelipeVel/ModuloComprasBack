import { Result } from 'oracledb';
import { Controller } from '../common/interfaces/controller.interface';
import { utilities } from '../common/utilities/util';
import { Request, Response } from 'express';
import { TipoContacto, TipoContactoDB } from '../common/interfaces/tipoContacto.interface';

export const controller: Controller = {
  getTipos: async (req: Request, res: Response) => {
    const result: Result<TipoContactoDB[]> = await utilities.executeQuery(
      'SELECT * FROM TIPOCONTACTO',
      {}
    );
    const list: TipoContacto[] = result.rows!.map((row: any) => {
      const tipo: TipoContacto = {
        valor: row[0],
        nombre: row[1],
      };
      return tipo;
    });
    res.send(list);
  },
};
