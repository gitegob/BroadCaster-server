import { queryDB } from '../db/dbConfig';

export const findRecordsByType = async (res, id, isAdmin, type) => {
  const query = isAdmin ? 'select * from records where type=$1 order by "createdOn" desc' : 'select * from records where type=$1 and "authorId"=$2 order by "createdOn" desc';
  const values = isAdmin ? [type] : [type, id];
  const result = await queryDB(res, query, values);
  return result;
};
export const findRecords = async (res, id, isAdmin) => {
  const query = isAdmin ? 'select * from records order by "createdOn" desc' : 'select * from records where "authorId" = $1 order by "createdOn" desc';
  const values = isAdmin ? [] : [id];
  const result = await queryDB(res, query, values);
  return result;
};
export const findRecord = async (res, recordId, isAdmin, authorId) => {
  const query = isAdmin ? 'select * from records where id=$1' : 'select * from records where id=$1 and "authorId"=$2';
  const values = isAdmin ? [recordId] : [recordId, authorId];
  const result = (await queryDB(res, query, values))[0];
  if (!result) return null;
  return result;
};
