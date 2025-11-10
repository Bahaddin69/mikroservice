import express, { Request, Response } from 'express';
import CargoRouter from './api/cargo.routes';

const app = express();
app.use(express.json());

app.use('/api/cargos', CargoRouter);

app.use("/", (req: Request, res: Response) => {
    res.json({ message: "hello world" });
});

export default app;
