import express, { Router } from 'express';
import { controller as facturaController } from '../controllers/factura.controller';

const router: Router = express.Router();

router.get('/:tipoFactura/:numFactura', facturaController.getFacturaByNum);
router.post('/VE', facturaController.createFacturaVenta);
router.post('/CO', facturaController.createFacturaCompra);
router.post('/DV', facturaController.createFacturaDevolucionVenta);
router.post('/DC', facturaController.createFacturaDevolucionCompra);

export default router;
