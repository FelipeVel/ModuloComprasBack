import oracledb, { Connection, Result } from 'oracledb';

oracledb.autoCommit = true;

export const utilities = {
  async executeQuery(query: string, params: any, autocommit: boolean = true): Promise<Result<any>> {
    let connection: Connection | null = null;
    let result: Result<any>;
    try {
      connection = await oracledb.getConnection({
        user: 'felipe',
        password: 'felipe',
        connectString: '172.24.96.1:1521/XE',
      });
      console.log(`Ejecutando query: ${query} con parametros ${JSON.stringify(params)}`);
      result = await connection.execute(query, params, { autoCommit: autocommit });
      connection.close();
      return result;
    } catch (error) {
      console.log(`!- Error ejecutando query ${query} con parametros ${JSON.stringify(params)}`);
      console.log(`!- Error: ${error}`);
      if (connection) {
        try {
          console.log(`Cerrando conexion`);
          await connection.close();
        } catch (error) {
          console.log(`!- Error cerrando conexion: ${error}`);
        }
      }
      throw error;
    }
  },

  async executeTransaction(queries: string[], params: any[]): Promise<Result<any>> {
    console.log('-------------------INICIO DE TRANSACCION-------------------');
    let connection: Connection | null = null;
    let result: Result<any> | void;
    try {
      connection = await oracledb.getConnection({
        user: 'felipe',
        password: 'felipe',
        connectString: '172.24.96.1:1521/XE',
      });
      for (let i = 0; i < queries.length; i++) {
        console.log(`Ejecutando query: ${queries[i]} con parametros: ${JSON.stringify(params[i])}`);
        result = await connection
          .execute(queries[i], params[i], { autoCommit: false })
          .catch((error) => {
            console.log('!- Error ejecutando query ', queries[i], ' con parametros ', params[i]);
            console.log('!- Error:', error);
            throw error;
          });
      }
      console.log(`Ejecutando commit`);
      await connection.execute('commit');
      connection.close();

      console.log('-------------------FIN DE TRANSACCION-------------------');
      return result!;
    } catch (error) {
      console.log(error);
      if (connection) {
        try {
          console.log(`Ejecutando rollback`);
          await connection.execute('rollback');
          console.log(`Cerrando conexion`);
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
