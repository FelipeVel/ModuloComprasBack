import express, { Router } from 'express';
import { controller as direccionesController } from '../controllers/direcciones.controller';

const router: Router = express.Router();

router.get('/', direccionesController.get);

export default router;
