import bcrypt from 'bcrypt';
import { sendSuccess, sendError } from '../helpers/senders';
import { genToken } from '../helpers/helpers';
import { queryDB } from '../db/dbConfig';

export const signUp = async (req, res) => {
  const {
    firstName, lastName, email, password,
  } = req.body;
  const newUser = (await queryDB(res, 'insert into users ("firstName", "lastName", "email", "password") values ($1,$2,$3,$4) returning *', [firstName, lastName, email, bcrypt.hashSync(password, 10)]))[0];
  sendSuccess(res, 201, 'User created successfully', {
    token: genToken(newUser),
  });
};

export const logIn = (req, res) => {
  const { user } = req;
  if (user.isAdmin) {
    sendSuccess(res, 200, 'Admin logged in successfully', {
      token: genToken(user),
    });
  } else {
    sendSuccess(res, 200, 'User logged in successfully', {
      token: genToken(user),
    });
  }
};
export const getProfile = (req, res) => {
  sendSuccess(res, 200, 'Profile retrieved successfully', { userData: req.payload });
};

export const makeAdmin = async (req, res) => {
  const { password } = req.body;
  const result = (await queryDB(res, 'select email from users where "isAdmin"=$1', [true]))[0];
  if (password === process.env.A_PASSWORD) {
    if (result) sendError(res, 409, `Admin already exists:${result.email}`);
    else {
      const {
        A_FNAME, A_LNAME, A_EMAIL, A_PASSWORD,
      } = process.env;
      await queryDB(res, 'insert into users ("firstName", "lastName", "email", "password", "isAdmin") values ($1,$2,$3,$4,$5)', [A_FNAME, A_LNAME, A_EMAIL, bcrypt.hashSync(A_PASSWORD, 10), true]);
      sendSuccess(res, 201, 'Admin created successfully');
    }
  } else sendError(res, 403, 'Forbidden');
};
