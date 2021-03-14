import { Pool } from 'pg';
import 'colors';
import { sendError } from '../helpers/senders';
import { debugDb, debugError } from '../config/debug';
import env from '../config/env';
import notifySlack from '../config/slack';

const createQueries = `
CREATE TABLE IF NOT EXISTS users (
    id serial PRIMARY KEY UNIQUE,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    "isAdmin" BOOLEAN DEFAULT false,
    district TEXT,
    sector TEXT,
    cell TEXT,
    dp TEXT,
    "allowEmails" BOOLEAN DEFAULT false,
    "recoveryEmail" TEXT
  );
CREATE TABLE IF NOT EXISTS records (
    id serial PRIMARY KEY UNIQUE,
    "createdOn" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "authorId" INTEGER REFERENCES users (id) ON DELETE CASCADE,
    "authorName" TEXT,
    "authorDP" TEXT,
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
let connectionString;
if (env.NODE_ENV === 'test') connectionString = env.MOCK_DATABASE_URL;
else connectionString = env.DATABASE_URL;

const db = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});
try {
  // eslint-disable-next-line no-console
  db.connect(() => debugDb(`Database Connected in ${env.NODE_ENV} mode...`.yellow.bold));
} catch (error) {
  (async () => notifySlack(`DB connection error: ${error.message}, ${error.stack}`))();
  debugError(error.stack);
}

const queryDB = async (res, query, values) => {
  try {
    const result = values.length ? await db.query(query, values) : await db.query(query);
    return result.rows;
  } catch (error) {
    await notifySlack(`Querying DB error: ${error.message}, ${error.stack}`);
    debugError(error);
    return sendError(res, 500, `DATABASE ERROR: ${error.message}`);
  }
};

export {
  db, createQueries, deleteQueries, clearQueries, queryDB,
};
