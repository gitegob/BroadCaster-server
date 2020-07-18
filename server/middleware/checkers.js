import bcrypt from 'bcrypt';
import { sendError } from '../helpers/senders';
import { queryDB } from '../db/dbConfig';

export const checkSignup = async (req, res, next) => {
  const match = (await queryDB(res, 'select email from users where email=$1', [req.body.email]))[0];
  if (match)sendError(res, 409, 'Email already exists');
  else next();
};

export const checkLogin = async (req, res, next) => {
  const user = (await queryDB(res, 'select * from users where email = $1', [req.body.email]))[0];
  if (!user) {
    sendError(res, 404, "User doesn't exist");
  } else {
    const password = bcrypt.compareSync(req.body.password, user.password);
    if (!password) {
      sendError(res, 401, 'Incorrect password');
    } else { req.user = user; next(); }
  }
};
