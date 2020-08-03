import { queryDB } from '../db/dbConfig';

export const findRecords = async (req, res, id, isAdmin) => {
  const { type, search } = req.query;
  let query;
  let values;
  if (isAdmin) {
    if (search) {
      query = 'select * from records where title ilike $1 order by "createdOn" desc';
      values = [`%${search}%`];
    } else {
      query = type ? 'select * from records where type=$1 order by "createdOn" desc' : 'select * from records order by "createdOn" desc';
      values = type ? [(type === 'red') ? 'red-flag' : 'intervention'] : [];
    }
  } else if (search) {
    query = 'select * from records where title like $1 order by "createdOn" desc';
    values = [`%${search}%`];
  } else {
    query = type ? 'select * from records where "authorId" = $1 and type=$2 order by "createdOn" desc' : 'select * from records where "authorId" = $1 order by "createdOn" desc';
    values = type ? [id, (type === 'red') ? 'red-flag' : 'intervention'] : [id];
  }
  const result = await queryDB(res, query, values);
  return result;
};

export const findUserRecords = async (res, id) => {
  const result = await queryDB(res, 'select * from records where "authorId"=$1', [id]);
  return result;
};

export const findRecord = async (res, recordId, isAdmin, authorId) => {
  const query = isAdmin ? 'select * from records where id=$1' : 'select * from records where id=$1 and "authorId"=$2';
  const values = isAdmin ? [recordId] : [recordId, authorId];
  const [result] = await queryDB(res, query, values);
  if (!result) return null;
  return result;
};
