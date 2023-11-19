import express, { Application } from 'express';
import cors from 'cors';
import personasRouter from './routers/personas.routes';
import nomenclaturasRouter from './routers/nomenclaturas.routes';
import documentosRouter from './routers/documentos.routes';
import contactosRouter from './routers/contactos.routes';

const app: Application = express();

app.use(express.json());
app.use(cors());

app.use('/personas', personasRouter);
app.use('/nomenclaturas', nomenclaturasRouter);
app.use('/documentos', documentosRouter);
app.use('/contactos', contactosRouter);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
