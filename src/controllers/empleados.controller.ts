import { Result } from 'oracledb';
import { Controller } from '../common/interfaces/controller.interface';
import { utilities } from '../common/utilities/util';

export const controller: Controller = {
  getByCorreo: async (req, res) => {
    const correo: string = req.params.correo;
    const result: Result<any> = await utilities.executeQuery(
      `SELECT * FROM EMPLEADOS WHERE CORREO = ':correo'`,
      { correo }
    );
    res.send(result.rows![0]);
  },
};
