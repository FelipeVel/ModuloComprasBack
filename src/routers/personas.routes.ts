import express, { Router } from 'express';
import { controller as personasController } from '../controllers/personas.controller';

const router: Router = express.Router();

router.get('/', personasController.getAll);

router.get('/tipos', personasController.getTipos);

router.post('/', personasController.create);

export default router;
