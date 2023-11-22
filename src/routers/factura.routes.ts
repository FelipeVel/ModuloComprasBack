import express, { Router } from 'express';
import { controller as facturaController } from '../controllers/factura.controller';

const router: Router = express.Router();

router.post('/VE', facturaController.createFacturaVenta);
router.post('/CO', facturaController.createFacturaCompra);

export default router;
