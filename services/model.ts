import { Sequelize } from 'sequelize';
import User from '@/services/model/User';
import Recipe from '@/services/model/Recipe';
import pg from 'pg';

const databaseUrl =
  process.env.DATABASE_URL ?? 'postgres://user:password@localhost:5432/db';
const connection = new Sequelize(databaseUrl, {
  dialectModule: pg,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

const db = {
  User: User(connection),
  Recipe: Recipe(connection),
};

await connection.sync();

export { connection, db };
