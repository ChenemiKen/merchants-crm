import 'dotenv/config';
import express, { Request, Response } from 'express';
import authRoutes from './routes/auth.route';
import { drizzle } from 'drizzle-orm/node-postgres';
import { errorHandler, unknownEndpoint } from './middleware/errorhandler.middleware';

const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.use('/api/v1/auth', authRoutes);

app.use(errorHandler)
app.use(unknownEndpoint)

export default app;