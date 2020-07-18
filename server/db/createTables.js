import { db, createQueries } from './dbConfig';

const createTables = async () => {
  try {
    await db.query(createQueries);
    process.exit(0);
  } catch (error) {
    console.log('error', error);
    process.exit(0);
  }
};
createTables();
