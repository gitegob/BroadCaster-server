import { queryDB } from '../db/dbConfig';

export const findRecords = async (req, res, id, isAdmin) => {
  const { type, page } = req.query;
  const p = (page) || 1;
  const offset = (p - 1) * 10;
  const queryObj = {};
  if (type) {
    const t = (type === 'red') ? 'red-flag' : 'intervention';
    if (isAdmin) {
      queryObj.query = 'select * from records where type=$1 order by "createdOn" desc limit $2 offset $3';
      queryObj.values = [t, 10, offset];
    } else {
      queryObj.query = 'select * from records where "authorId" = $1 and type=$2 order by "createdOn" desc limit $3 offset $4';
      queryObj.values = [id, t, 10, offset];
    }
  } else if (isAdmin) {
    queryObj.query = 'select * from records order by "createdOn" desc limit $1 offset $2';
    queryObj.values = [10, offset];
  } else {
    queryObj.query = 'select * from records where "authorId" = $1 order by "createdOn" desc limit $2 offset $3';
    queryObj.values = [id, 10, offset];
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
