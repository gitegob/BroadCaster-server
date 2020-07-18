import { db, clearQueries } from './dbConfig';

const clearTables = async () => {
  try {
    await db.query(clearQueries);
    process.exit(0);
  } catch (error) {
    console.log('error', error);
    process.exit(0);
  }
};

clearTables();
