import { Result } from 'oracledb';
import { Controller } from '../common/interfaces/controller.interface';
import { utilities } from '../common/utilities/util';
import { Nomenclatura } from '../common/interfaces/nomenclatura.dto';

export const controller: Controller = {
  getAll: async (req, res) => {
    const result: Result<any> = await utilities.executeQuery('SELECT * FROM NOMENCLATURA', {});
    const list: Nomenclatura[] = result.rows!.map((row: any) => {
      const nomenclatura: Nomenclatura = {
        id: row[0],
        posicion: row[1],
        descripcion: row[2],
        abreviatura: row[3],
      };
      return nomenclatura;
    });
    res.send(list);
  },
};
