import { Sequelize } from 'sequelize';
import User from '@/services/model/User';

const databaseUrl =
  process.env.DATABASE_URL ?? 'postgres://user:password@localhost:5432/db';
const connection = new Sequelize(databaseUrl);

const db = {
  User: User(connection),
};

await connection.sync();

export { connection, db };
