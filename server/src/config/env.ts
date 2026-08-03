import dotenv from 'dotenv';

dotenv.config();

const DEFAULT_PORT = 5002;

export const config = {
  port: Number(process.env.PORT) || DEFAULT_PORT,
  databaseUrl: process.env.DATABASE_URL || '',
};
