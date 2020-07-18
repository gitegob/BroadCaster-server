import jwt from 'jsonwebtoken';
import { sendError } from './senders';

export const checkJoiError = (error, res, next) => {
  if (error) {
    sendError(res, 400, error.details[0].message.replace(/[/"]/g, ''));
  } else next();
};

export const genToken = ({
  id, firstName, lastName, userName, email, isAdmin,
}) => jwt.sign(
  {
    id,
    firstName,
    lastName,
    userName,
    email,
    isAdmin,
  },
  process.env.JWT_KEY,
  { expiresIn: '5h' },
);

export const serverError = (status, message) => {
  const error = new Error();
  error.status = status;
  error.message = message;
  throw error;
};
