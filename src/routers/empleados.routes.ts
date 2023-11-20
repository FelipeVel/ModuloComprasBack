import express, { Router } from 'express';
import { controller as empleadosController } from '../controllers/empleados.controller';

const router: Router = express.Router();

router.get('/:codigo', empleadosController.getByCodigo);

export default router;
