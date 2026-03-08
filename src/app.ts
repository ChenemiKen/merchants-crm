import 'dotenv/config';
import express, { Request, Response } from 'express';
import authRoutes from './routes/auth.route';
import { drizzle } from 'drizzle-orm/node-postgres';

const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.use('/api/v1/auth', authRoutes);


// You can specify any property from the node-postgres connection options
const db = drizzle({
    connection: {
        connectionString: process.env.DATABASE_URL!,
        ssl: true
    }
});

export default app;