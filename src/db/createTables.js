import { debugApp, debugError } from '../config/debug';
import notifySlack from '../config/slack';
import { db, createQueries } from './dbConfig';

const createTables = async () => {
  try {
    await db.query(createQueries);
    debugApp('done');
    process.exit();
  } catch (error) {
    debugError(error);
    await notifySlack(`Create tables error: ${error.message}, ${error.stack}`);
    process.exit();
  }
};
createTables();
