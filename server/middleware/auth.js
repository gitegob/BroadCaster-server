import jwt from 'jsonwebtoken';
import { sendError } from '../helpers/senders';
import { queryDB } from '../db/dbConfig';

export const auth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return sendError(res, 401, 'Please log in or signup first');
  }
  let decoded = {};
  try {
    const token = authorization.split(' ')[1];
    decoded = jwt.verify(token, process.env.JWT_KEY);
  } catch (error) {
    return sendError(res, 401, 'Invalid token');
  }
  const match = (await queryDB(res, 'select email from users where email=$1', [decoded.email]))[0];
  if (!match) {
    return sendError(res, 401, 'Invalid token');
  }
  req.payload = decoded;
  next();
};

export const adminAuth = (req, res, next) => {
  if (req.payload.isAdmin) next();
  else {
    sendError(res, 403, 'This request requires Administrator privileges');
  }
};
