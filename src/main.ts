import express, { Application } from 'express';
import cors from 'cors';
import personasRouter from './routers/personas.routes';
import nomenclaturasRouter from './routers/nomenclaturas.routes';
import documentosRouter from './routers/documentos.routes';
import contactosRouter from './routers/contactos.routes';
import empleadosRouter from './routers/empleados.routes';
import productosRouter from './routers/productos.routes';

const app: Application = express();

app.use(express.json());
app.use(cors());

app.use('/personas', personasRouter);
app.use('/nomenclaturas', nomenclaturasRouter);
app.use('/documentos', documentosRouter);
app.use('/contactos', contactosRouter);
app.use('/empleados', empleadosRouter);
app.use('/productos', productosRouter);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
