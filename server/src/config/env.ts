import dotenv from 'dotenv';

dotenv.config();

const DEFAULT_PORT = 5002;
const DEFAULT_JWT_SECRET = 'JWT_SECRET';

export const config = {
  port: Number(process.env.PORT) || DEFAULT_PORT,
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || DEFAULT_JWT_SECRET,
};
