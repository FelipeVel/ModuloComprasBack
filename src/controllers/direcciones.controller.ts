import { Request, Response } from 'express';
import { Result } from 'oracledb';
import { Controller } from '../common/interfaces/controller.interface';
import { utilities } from '../common/utilities/util';
import { CompDireccion, CompDireccionDB } from '../common/interfaces/componenteDireccion.dto';

export const controller: Controller = {
  async get(req: Request, res: Response) {
    const result: Result<CompDireccionDB> = await utilities.executeQuery(
      'SELECT * FROM COMPONENTEDIRECC',
      {}
    );
    const list: CompDireccion[] = result.rows!.map((row: any) => {
      const componenteDirecc: CompDireccion = {
        posicion: row[0],
        descripcion: row[1],
        obligatoriedad: row[2],
      };
      return componenteDirecc;
    });
    res.send(list);
  },
};
