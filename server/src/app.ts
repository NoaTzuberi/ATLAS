import express from 'express';
import cors from 'cors';
import { healthRouter } from './features/health/health.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', healthRouter);

export default app;
