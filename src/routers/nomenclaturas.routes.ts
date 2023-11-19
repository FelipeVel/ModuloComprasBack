import express, { Router } from 'express';
import { controller as nomenclaturasController } from '../controllers/nomenclaturas.controller';

const router: Router = express.Router();

router.get('/', nomenclaturasController.getAll);

export default router;
