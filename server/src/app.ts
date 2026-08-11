import express from 'express';
import cors from 'cors';
import { healthRouter } from './features/health/health.routes';
import { authRouter } from './features/auth/auth.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', healthRouter);
app.use('/api/auth', authRouter);

export default app;
