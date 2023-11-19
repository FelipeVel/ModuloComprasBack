import express, { Router } from 'express';
import { controller as nomenclaturasController } from '../controllers/empleados.controller';

const router: Router = express.Router();

router.get('/:correo', nomenclaturasController.getAll);

export default router;
