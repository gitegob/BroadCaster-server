import { createQueries, manipTables } from './dbConfig';

const createTables = async () => {
  await manipTables(createQueries);
};
createTables();
