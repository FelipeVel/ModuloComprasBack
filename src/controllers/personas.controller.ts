import { Request, Response } from 'express';
import { Controller } from '../common/interfaces/controller.interface';
import { utilities, componenteDict } from '../common/utilities/util';
import {
  Contacto,
  ContactoDB,
  Direccion,
  DireccionDB,
  PersonaIn,
  TipoPersona,
} from '../common/interfaces/persona.dto';
import { Nomenclatura, NomenclaturaDB } from '../common/interfaces/nomenclatura.dto';
import { Result } from 'oracledb';
import { CompDireccion } from '../common/interfaces/componenteDireccion.dto';

type ParNomenclatura = {
  posicion: number;
  valor: string;
};

type RetDirecciones = {
  queries?: string[];
  params?: DireccionDB[];
};

export const controller: Controller = {
  getAll: async (req: Request, res: Response) => {
    const resultPersona = await utilities.executeQuery('SELECT * FROM PERSONA', {});
    const regs: PersonaIn[] = resultPersona.rows!.map((row: any) => {
      const persona: PersonaIn = {
        nombre: row.NOMBRE,
        apellido: row.APELLIDO,
        tipoPersona: row.IDTIPOPERSONA,
        tipoDocumento: row.IDTIPODOC,
        numeroDocumento: row.NDOCUMENTO,
        direcciones: [],
        contactos: [],
      };
      return persona;
    });
    res.send(regs);
  },

  getByKeys(req: Request, res: Response) {
    const { tipoPersona, tipoDocumento, numeroDocumento } = req.params;
    utilities
      .executeQuery(
        `SELECT * FROM PERSONA WHERE IDTIPOPERSONA = :tipoPersona AND IDTIPODOC = :tipoDocumento AND NDOCUMENTO = :numeroDocumento`,
        { tipoPersona, tipoDocumento, numeroDocumento }
      )
      .then((result: Result<any>) => {
        const row: any = result.rows![0];
        const persona: PersonaIn = {
          nombre: row[3],
          apellido: row[4],
          tipoPersona: row[1],
          tipoDocumento: row[0],
          numeroDocumento: row[2],
        };
        res.send(persona);
      });
  },

  getByType(req: Request, res: Response) {
    const tipoPersona: string = req.params.tipoPersona;
    utilities
      .executeQuery(`SELECT * FROM PERSONA WHERE IDTIPOPERSONA = :tipoPersona`, { tipoPersona })
      .then((result: Result<any>) => {
        const regs: PersonaIn[] = result.rows!.map((row: any) => {
          const persona: PersonaIn = {
            nombre: row[3],
            apellido: row[4],
            tipoPersona: row[1],
            tipoDocumento: row[0],
            numeroDocumento: row[2],
          };
          return persona;
        });
        res.send(regs);
      });
  },

  create: async (req: Request, res: Response) => {
    const persona: PersonaIn = req.body;
    const queriesDirecciones: string[] = [];
    const queriesContactos: string[] = [];
    const paramsDirecciones: DireccionDB[] = [];
    const paramsContactos: ContactoDB[] = [];
    try {
      const componentes: CompDireccion[] = await utilities
        .executeQuery(`SELECT * FROM COMPONENTEDIRECC`, {})
        .then((result: Result<CompDireccion[]>) => {
          return result.rows!.map((row: any[]) => {
            const componente: CompDireccion = {
              POSICION: row[0],
              DESCPOSICION: row[1],
              OBLIGATORIEDAD: row[2],
            };
            return componente;
          });
        });
      const nomenclaturasPosiciones: number[] = await utilities
        .executeQuery('SELECT POSICION FROM NOMENCLATURA GROUP BY POSICION', {})
        .then((result: Result<NomenclaturaDB[]>) => {
          return result.rows!.map((row: any[]) => {
            return row[0];
          });
        });
      for (const direccion of persona.direcciones!) {
        const keys: string[] = Object.keys(direccion);
        for (const key of keys) {
          const comp: CompDireccion | undefined = componentes.find(
            (componente: CompDireccion) => componente.DESCPOSICION === componenteDict[key]
          );
          const posicion: number = comp!.POSICION;
          const dirReg: DireccionDB = {
            POSICION: posicion,
            IDTIPODOC: persona.tipoDocumento,
            IDTIPOPERSONA: persona.tipoPersona,
            NDOCUMENTO: persona.numeroDocumento,
          };
          if (nomenclaturasPosiciones.includes(posicion) && (direccion as any)[key] !== '') {
            const regId: Result<any> = await utilities.executeQuery(
              `SELECT IDNOMEN FROM NOMENCLATURA WHERE ABREVNOMEN = :abreviatura`,
              { abreviatura: (direccion as any)[key] }
            );
            console.log((direccion as any)[key]);
            console.log(regId);
            dirReg.IDNOMEN = regId.rows![0][0];
          } else {
            dirReg.VALORDIREC = (direccion as any)[key];
          }
          paramsDirecciones.push(dirReg);
          const query = `INSERT INTO DIRECCION (POSICION, IDTIPODOC, IDTIPOPERSONA, NDOCUMENTO, ${
            dirReg.IDNOMEN ? 'IDNOMEN' : 'VALORDIREC'
          }) VALUES (:POSICION, :IDTIPODOC, :IDTIPOPERSONA, :NDOCUMENTO, ${
            dirReg.IDNOMEN ? ':IDNOMEN' : ':VALORDIREC'
          })`;
          queriesDirecciones.push(query);
        }
      }
      persona.contactos!.forEach((contacto: Contacto, id: number) => {
        const contactoReg: ContactoDB = {
          IDTIPOCONTACTO: contacto.tipoContacto,
          DESCCONTACTO: contacto.descContacto,
          IDTIPODOC: persona.tipoDocumento,
          IDTIPOPERSONA: persona.tipoPersona,
          NDOCUMENTO: persona.numeroDocumento,
        };
        paramsContactos.push(contactoReg);
        const query = `INSERT INTO CONTACTO (IDTIPOCONTACTO, IDTIPODOC, IDTIPOPERSONA, NDOCUMENTO, DESCCONTACTO) VALUES (:IDTIPOCONTACTO, :IDTIPODOC, :IDTIPOPERSONA, :NDOCUMENTO, :DESCCONTACTO)`;
        queriesContactos.push(query);
      });
      utilities
        .executeTransaction(
          [
            'INSERT INTO PERSONA (NOMBRE, APELLIDO, IDTIPOPERSONA, IDTIPODOC, NDOCUMENTO) VALUES (:nombre, :apellido, :tipoPersona, :tipoDocumento, :numeroDocumento)',
            ...queriesDirecciones,
            ...queriesContactos,
          ],
          [
            {
              nombre: persona.nombre,
              apellido: persona.apellido,
              tipoPersona: persona.tipoPersona,
              tipoDocumento: persona.tipoDocumento,
              numeroDocumento: persona.numeroDocumento,
            },
            ...paramsDirecciones,
            ...paramsContactos,
          ]
        )
        .then(() => res.send({ message: 'Hecho' }));
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: 'Error' });
    }
  },
  getTipos: async (req: Request, res: Response): Promise<void> => {
    const response: TipoPersona[] = await utilities
      .executeQuery('SELECT * FROM TIPOPERSONA', {})
      .then((result: Result<any>) => {
        return result.rows!.map((row: any) => {
          const tipoPersona: TipoPersona = {
            id: row[0],
            nombre: row[1],
          };
          return tipoPersona;
        });
      });
    res.send(response);
  },
};

const translateDireccion = (direcciones: Direccion[]): RetDirecciones => {
  const result: RetDirecciones = {};

  return result;
};
