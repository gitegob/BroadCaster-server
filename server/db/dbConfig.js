import { Pool } from 'pg';
import 'colors';
import { config } from 'dotenv';
import { sendError } from '../helpers/senders';

config();

const createQueries = `
CREATE TABLE IF NOT EXISTS users (
    id serial PRIMARY KEY UNIQUE,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    "isAdmin" BOOLEAN DEFAULT false
  );
CREATE TABLE IF NOT EXISTS records (
    id serial PRIMARY KEY UNIQUE,
    "createdOn" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "authorId" INTEGER REFERENCES users (id) ON DELETE CASCADE,
    "authorName" TEXT,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    district TEXT NOT NULL,
    sector TEXT NOT NULL,
    cell TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    "updatedOn" TIMESTAMP
)`;
const deleteQueries = `
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS records CASCADE;`;
const clearQueries = `
delete from users;
delete from records`;
const connectionString = process.env.NODE_ENV === 'testing' ? process.env.MOCK_DATABASE_URL : process.env.DEV_DATABASE_URL;

const db = new Pool({
  connectionString,
});
// eslint-disable-next-line no-console
db.connect(() => console.log(`Database Connected in ${process.env.NODE_ENV} mode...`.yellow.bold));

const queryDB = async (res, query, values) => {
  try {
    const result = values.length ? await db.query(query, values) : await db.query(query);
    return result.rows;
  } catch (error) {
    return sendError(res, 500, `DATABASE ERROR: ${error}`);
  }
};

const manipTables = async (queries) => {
  try {
    await db.query(queries);
    process.exit(0);
  } catch (error) {
    console.log('error', error);
    process.exit(0);
  }
};

export {
  db, createQueries, deleteQueries, clearQueries, queryDB, manipTables,
};
