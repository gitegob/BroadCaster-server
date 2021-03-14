import { clearQueries, manipTables } from './dbConfig';

const clearTables = async () => {
  await manipTables(clearQueries);
};

clearTables();
