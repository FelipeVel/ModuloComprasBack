import { Result } from 'oracledb';
import { Controller } from '../common/interfaces/controller.interface';
import { utilities } from '../common/utilities/util';
import { Empleado } from '../common/interfaces/empleado.interface';

export const controller: Controller = {
  getByCodigo: async (req, res) => {
    const codigo: string = req.params.codigo;
    const result: Result<any> = await utilities.executeQuery(
      `SELECT E.*, C.CODCARGO, C.NOMCARGO FROM EMPLEADO E,EMPLEADO_CARGO EC, CARGO C  WHERE E.CODEMPLEADO = :codigo AND EC.CODEMPLEADO = E.CODEMPLEADO AND EC.CODCARGO = C.CODCARGO`,
      { codigo }
    );
    const empleado: Empleado = {
      codigo: result.rows![0][0],
      nombre: result.rows![0][1],
      apellido: result.rows![0][2],
      correo: result.rows![0][3],
      cargo: {
        codigo: result.rows![0][4],
        nombre: result.rows![0][5],
      },
    };
    res.send(empleado);
  },
};
