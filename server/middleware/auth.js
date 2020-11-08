import jwt from 'jsonwebtoken';
import { sendError } from '../helpers/senders';
import { queryDB } from '../db/dbConfig';
import env from '../config/env';

export const auth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return sendError(res, 401, 'Please log in or signup first');
  }
  try {
    const token = authorization.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_KEY);
    if (decoded) {
      const match = (await queryDB(res, 'select email from users where email=$1', [decoded.email]))[0];
      if (!match) {
        return sendError(res, 401, 'Invalid token');
      }
      req.payload = decoded;
      next();
    } else sendError(res, 401, 'Invalid token');
  } catch (error) {
    return sendError(res, 401, 'Invalid token');
  }
};

export const adminAuth = (req, res, next) => {
  if (req.payload.isAdmin) next();
  else return sendError(res, 403, 'This request requires Administrator privileges');
};
