import sendEmail from '../helpers/networkers';
import { sendSuccess, sendError } from '../helpers/senders';
import { findRecordsByType, findRecords } from '../helpers/finders';
import { queryDB } from '../db/dbConfig';

export const createRecord = async (req, res) => {
  const { id, firstName, lastName } = req.payload;
  const {
    title, type, description, district, sector, cell,
  } = req.body;

  const newRecord = (await queryDB(res,
    'insert into records ("authorId","authorName",title, type, description, district, sector, cell) values($1,$2,$3,$4,$5,$6,$7,$8) returning *',
    [id, `${firstName} ${lastName}`, title.replace(/\s+/, ' ').trim(), type, description.replace(/\s+/, ' ').trim(), district, sector, cell]))[0];
  sendSuccess(res, 201, 'Record created successfully', { record: newRecord });
};

export const getRecords = async (req, res) => {
  const { id, isAdmin } = req.payload;
  const result = await findRecords(res, id, isAdmin);
  sendSuccess(res, 200, 'Records fetched successfully', { records: result });
};

export const getRedFlags = async (req, res) => {
  const result = await findRecordsByType(res, req.payload.id, req.payload.isAdmin, 'red-flag');
  sendSuccess(res, 200, 'Records fetched successfully', { records: result });
};

export const getInterventions = async (req, res) => {
  const result = await findRecordsByType(res, req.payload.id, req.payload.isAdmin, 'intervention');
  sendSuccess(res, 200, 'Records fetched successfully', { records: result });
};

export const getARecord = async (req, res) => {
  const { record } = req;
  sendSuccess(res, 200, 'Record fetched successfully', { record });
};

export const updateARecord = async (req, res) => {
  const {
    title, type, district, sector, cell, description,
  } = req.body;
  const { record } = req;
  if (record.status === 'pending') {
    const newTitle = title ? title.replace(/\s+/, ' ').trim() : record.title;
    const newType = type || record.type;
    const newDistrict = district || record.district;
    const newSector = sector || record.sector;
    const newCell = cell || record.cell;
    const newDescription = description ? description.replace(/\s+/, ' ').trim() : record.description;
    const values = [
      newTitle, newType, newDistrict, newSector, newCell, newDescription, req.params.recordID];
    const result = (await queryDB(res, 'update records set title=$1,type=$2,district=$3, sector=$4, cell=$5, description=$6, "updatedOn"=current_timestamp WHERE id=$7 returning *', values))[0];
    sendSuccess(res, 200, 'Record edited successfully', { record: result });
  } else sendError(res, 403, 'Record cannot be edited');
};

export const updateStatus = async (req, res) => {
  const { status } = req.body;
  const { recordID } = req.params;
  const result = (await queryDB(res, 'update records set status=$1 where id=$2 returning *', [status, recordID]))[0];
  sendSuccess(res, 200, 'Record status updated successfully', {
    status: result.status,
  });
  const {
    authorId, title: recordTitle, status: recordStatus,
  } = result;
  const result2 = (await queryDB(res, 'select email,"firstName" from users where id=$1', [authorId]))[0];
  const { email, firstName } = result2;
  await sendEmail(email, firstName, recordTitle, recordStatus);
};

export const deleteARecord = async (req, res) => {
  const { record } = req;
  if (record.status.toLowerCase() === 'pending') {
    await queryDB(res, 'delete from records where id=$1', [req.params.recordID]);
    sendSuccess(res, 200, 'Record deleted successfully');
  } else sendError(res, 403, 'Record cannot be deleted');
};
