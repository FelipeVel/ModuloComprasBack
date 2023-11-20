import express, { Router } from 'express';
import { controller as personasController } from '../controllers/personas.controller';

const router: Router = express.Router();

router.get('/', personasController.getAll);

router.get('/tipos', personasController.getTipos);

router.get('/:tipoPersona', personasController.getByType);

router.get('/:tipoPersona/:tipoDocumento/:numeroDocumento', personasController.getByKeys);

router.post('/', personasController.create);

export default router;
