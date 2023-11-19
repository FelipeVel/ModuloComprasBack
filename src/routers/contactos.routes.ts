import express, { Router } from 'express';
import { controller as contactosController } from '../controllers/contactos.controller';

const router: Router = express.Router();

router.get('/tipos', contactosController.getTipos);

export default router;
