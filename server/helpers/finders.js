import { queryDB } from '../db/dbConfig';

export const findRecords = async (req, res, id, isAdmin) => {
  const { type, page } = req.query;
  const p = page || 1;
  const queryObj = {};
  if (isAdmin) {
    queryObj.query = type ? 'select * from records where type=$1 order by "createdOn" desc limit $2 offset $3' : 'select * from records order by "createdOn" desc limit $1 offset $2';
    queryObj.values = type ? [type === 'red' ? 'red-flag' : 'intervention', 10, (p - 1) * 10] : [10, (p - 1) * 10];
  } else {
    queryObj.query = type ? 'select * from records where "authorId" = $1 and type=$2 order by "createdOn" desc limit $3 offset $4' : 'select * from records where "authorId" = $1 order by "createdOn" desc limit $2 offset $3';
    queryObj.values = type ? [id, type === 'red' ? 'red-flag' : 'intervention', 10, (p - 1) * 10] : [id, 10, (p - 1) * 10];
  }
  const result = await queryDB(res, queryObj.query, queryObj.values);
  return result;
};
export const findRecord = async (res, recordId, isAdmin, authorId) => {
  const query = isAdmin ? 'select * from records where id=$1' : 'select * from records where id=$1 and "authorId"=$2';
  const values = isAdmin ? [recordId] : [recordId, authorId];
  const result = (await queryDB(res, query, values))[0];
  if (!result) return null;
  return result;
};
