import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import personasRouter from './routers/personas.routes';
import nomenclaturasRouter from './routers/nomenclaturas.routes';
import documentosRouter from './routers/documentos.routes';
import contactosRouter from './routers/contactos.routes';
import empleadosRouter from './routers/empleados.routes';
import productosRouter from './routers/productos.routes';
import facturaRouter from './routers/factura.routes';
import direccionesRouter from './routers/direcciones.routes';

const app: Application = express();

app.use(express.json());
app.use(cors());

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`Request URL: ${req.url}`);
  next();
});

app.use('/personas', personasRouter);
app.use('/nomenclaturas', nomenclaturasRouter);
app.use('/documentos', documentosRouter);
app.use('/contactos', contactosRouter);
app.use('/empleados', empleadosRouter);
app.use('/productos', productosRouter);
app.use('/facturas', facturaRouter);
app.use('/direcciones', direccionesRouter);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
