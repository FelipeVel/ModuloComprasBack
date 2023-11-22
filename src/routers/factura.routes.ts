import express, { Router } from 'express';
import { controller as facturaController } from '../controllers/factura.controller';

const router: Router = express.Router();

router.post('venta/', facturaController.createFacturaVenta);

export default router;
