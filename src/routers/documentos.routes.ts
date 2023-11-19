import express, { Router } from 'express';
import { controller as documentosController } from '../controllers/documentos.controller';

const router: Router = express.Router();

router.get('/tipos', documentosController.getTipos);

export default router;
