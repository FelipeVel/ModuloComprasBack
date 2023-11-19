import oracledb, { Connection, Result } from 'oracledb';
import { unknown } from 'zod';

oracledb.autoCommit = true;

export const utilities = {
  async executeQuery(query: string, params: any): Promise<Result<any>> {
    let connection: Connection | null = null;
    let result: Result<any>;
    try {
      connection = await oracledb.getConnection({
        user: 'felipe',
        password: 'felipe',
        connectString: '172.24.96.1:1521/XE',
      });
      result = await connection.execute(query, params);
      connection.close();
      return result;
    } catch (error) {
      console.log(error);
      if (connection) {
        try {
          await connection.close();
        } catch (error) {
          console.log(error);
        }
      }
      throw error;
    }
  },

  async executeTransaction(queries: string[], params: any[]): Promise<Result<any>> {
    console.log('-------------------START TRANSACTION-------------------');
    let connection: Connection | null = null;
    let result: Result<any> | void;
    try {
      connection = await oracledb.getConnection({
        user: 'felipe',
        password: 'felipe',
        connectString: '172.24.96.1:1521/XE',
      });
      for (let i = 0; i < queries.length; i++) {
        console.log(`Executing query: ${queries[i]}`);
        console.log(`With params: ${JSON.stringify(params[i])}`);
        result = await connection
          .execute(queries[i], params[i], { autoCommit: false })
          .catch((error) => {
            console.log('!- Error executing query ', queries[i], ' with params ', params[i]);
            console.log('!- error:', error);
            throw error;
          });
      }
      console.log(`Executing query: commit`);
      await connection.execute('commit');
      connection.close();

      console.log('-------------------END TRANSACTION-------------------');
      return result!;
    } catch (error) {
      console.log(error);
      if (connection) {
        try {
          console.log(`Executing query: rollback`);
          await connection.execute('rollback');
          console.log(`Closing connection`);
          await connection.close();
        } catch (error) {
          console.log(error);
        }
      }
      throw error;
    }
  },
};

type Diccionario = {
  [key: string]: string;
};

export const componenteDict: Diccionario = {
  tipoVia: 'TIPO VIA',
  viaPrincipal: 'NUMERO VIA PRINCIPAL',
  letraVia: 'LETRA VIA PRINCIPAL',
  prefijo: 'PREFIJO BIS',
  letraPrefijo: 'LETRA PREFIJO',
  cuadrante: 'CUADRANTE',
  viaGeneradora: 'NUMERO VIA GENERADORA',
  letraViaGeneradora: 'LETRA VIA GENERADORA',
  sufijo: 'SUFIJO BIS',
  letraSufijo: 'LETRA SUFIJO',
  placa: 'NUMERO PLACA',
  cuadrantePlaca: 'CUADRANTE PLACA',
  barrio: 'BARRIO',
  nombreBarrio: 'NOMBRE BARRIO',
  manzana: 'MANZANA',
  numeroManzana: 'IDENTIFICADOR MANZANA',
  urbanizacion: 'URBANIZACION',
  nombreUrbanizacion: 'NOMBRE URBANIZACION',
  tipoPredio: 'TIPO PREDIO',
  identificadorPredio: 'IDENTIFICADOR PREDIO',
  complemento: 'COMPLEMENTO',
};
