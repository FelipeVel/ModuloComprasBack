import express, { Router } from 'express';
import { controller as productosController } from '../controllers/productos.controller';

const router: Router = express.Router();

router.get('/:producto', productosController.getByKeys);

export default router;
