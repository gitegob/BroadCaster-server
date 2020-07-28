import { db, createQueries } from './dbConfig';

const createTables = async () => {
  try {
    await db.query(createQueries);
    process.exit();
  } catch (error) {
    process.exit();
  }
};
createTables();
