import 'dotenv/config';
import express, { Request, Response } from 'express';
import authRoutes from './routes/auth.route';
import merchantRoutes from './routes/merchant.route';
import merchantDocumentRoutes from './routes/merchant_document.route';
import notificationRoutes from './routes/notification.route';
import { errorHandler, unknownEndpoint } from './middleware/errorhandler.middleware';
import cookieParser from 'cookie-parser';
import { httpLogger } from "./middleware/logger.middleware";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(httpLogger);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.use('/api/auth', authRoutes);
app.use('/api/merchants', merchantRoutes);
app.use('/api/merchants', merchantDocumentRoutes);
app.use('/api/notifications', notificationRoutes);

app.use(errorHandler)
app.use(unknownEndpoint)

export default app;