import { Result } from 'oracledb';
import { Controller } from '../common/interfaces/controller.interface';
import { utilities } from '../common/utilities/util';
import { Request, Response } from 'express';

interface Producto {
  id: string;
  categoria: Categoria;
  nombre: string;
  precio: number;
  stock: number;
}

interface Categoria {
  id: string;
  nombre: string;
}

export const controller: Controller = {
  getByKeys: async (req: Request, res: Response) => {
    const { producto } = req.params;
    const result: Result<any> = await utilities.executeQuery(
      `SELECT A.*, NVL(I.EXISTENCIA,0) EXISTENCIA FROM (
        SELECT P.*, C.DESCATPRODUCTO, HP.VALOR
        FROM PRODUCTO P, CATPRODUCTO C, HISTORICOPRECIO HP
        WHERE P.PRODUCTO = :producto AND 
          P.IDCATPRODUCTO = C.IDCATPRODUCTO
          AND P.PRODUCTO = HP.PRODUCTO
          AND P.IDCATPRODUCTO = HP.IDCATPRODUCTO
          AND HP.FECHAFIN IS NULL
        ) A LEFT JOIN INVENTARIO I ON A.PRODUCTO = I.PRODUCTO
      WHERE ROWNUM <= 1
      ORDER BY I.FECHAINVE DESC`,
      { producto }
    );
    const list: Producto[] = result.rows!.map((row: any) => {
      return {
        id: row[1],
        categoria: {
          id: row[0],
          nombre: row[3],
        },
        precio: row[4],
        nombre: row[2],
        stock: row[5],
      };
    });
    res.send(list);
  },
};
