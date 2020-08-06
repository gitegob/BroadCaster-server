import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { sendSuccess, sendError } from '../helpers/senders';
import { genToken, genVerificationToken } from '../helpers/helpers';
import { queryDB } from '../db/dbConfig';
import {
  uploadFile, verificationEmail, feedbackSender, recoveryEmail,
} from '../helpers/networkers';

export const signUp = async (req, res) => {
  const {
    firstName, lastName, email, password,
  } = req.body;
  const verificationToken = genVerificationToken({
    firstName, lastName, email, password: bcrypt.hashSync(password, 10), unverified: 'YES',
  });
  const result = await verificationEmail(email, firstName, verificationToken);
  if (result.accepted) {
    const notified = !!result.accepted.length;
    if (notified) sendSuccess(res, 200, 'Check your email');
  } else sendError(res, 502, 'Failed to send you an email, Try again');
};

export const verifySignup = async (req, res) => {
  const {
    firstName, lastName, email, password,
  } = req.unverified;
  await queryDB(res, 'insert into users ("firstName", "lastName", "email", "password") values ($1,$2,$3,$4)', [firstName, lastName, email, password]);
  sendSuccess(res, 201, 'User created successfully');
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
export const getUserData = async (req, res) => {
  const [userData] = await queryDB(res, 'select id,"firstName","lastName",email,district,sector,cell,dp,"isAdmin","allowEmails" from users where id=$1', [req.payload.id]);
  sendSuccess(res, 200, 'Profile retrieved successfully', { userData });
};
export const getProfile = async (req, res) => {
  if (req.payload.isAdmin) {
    const [userData] = await queryDB(res, 'select id,"firstName","lastName",email,district,sector,cell,dp,"isAdmin" from users where id=$1', [req.params.id]);
    if (!userData) return res.sendStatus(404);
    sendSuccess(res, 200, 'Profile retrieved successfully', { userData });
  } else if (`${req.payload.id}` !== req.params.id) sendError(res, 403, 'Forbidden');
  else {
    const [userData] = await queryDB(res, 'select id,"firstName","lastName",email,district,sector,cell,dp,"isAdmin","allowEmails" from users where id=$1', [req.params.id]);
    if (!userData) return res.sendStatus(404);
    sendSuccess(res, 200, 'Profile retrieved successfully', { userData });
  }
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

export const updateProfile = async (req, res) => {
  const { id } = req.params;
  if (`${req.payload.id}` === req.params.id) {
    const [r] = await queryDB(res, 'select * from users where id=$1', [req.payload.id]);
    const {
      firstName = r.firstName, lastName = r.lastName,
      email = r.email, district = r.district, sector = r.sector,
      cell = r.cell, allowEmails = r.allowEmails,
    } = req.body;
    const image = await uploadFile(req);
    let uploaded;
    if (image) uploaded = image.url;
    else uploaded = null;
    await queryDB(res, 'update users set "firstName"=$1,"lastName"=$2,email=$3, district=$4, sector=$5, cell=$6, dp=$7,"allowEmails"=$8 where id=$9', [firstName, lastName, email, district, sector, cell, uploaded || r.dp, allowEmails, id]);
    await queryDB(res, 'update records set "authorName"=$1,"authorDP"=$2 where "authorId"=$3', [`${firstName} ${lastName}`, uploaded || r.dp, id]);
    sendSuccess(res, 200, 'Profile updated successfully', { upload: uploaded ? 'success' : 'failed' });
  } else sendError(res, 403, 'Forbidden');
};

export const sendFeedback = async (req, res) => {
  const { email, name, feedback } = req.body;
  const { accepted } = await feedbackSender(email, name, feedback);
  const success = !!accepted.length;
  if (success) sendSuccess(res, 200, 'Feedback sent successfully');
  else return res.sendStatus(502).send('Email sending failed');
};

export const recoverPwd = async (req, res) => {
  const { email } = req.body;
  if (!email) sendError(res, 400, 'Please submit an email');
  else {
    const [user] = await queryDB(res, 'select * from users where email = $1', [email]);
    if (!user) {
      sendError(res, 404, "Email doesn't exist here");
    } else {
      const newPwd = `PWD-${uuid()}`;
      await queryDB(res, 'update users set password=$1 where id=$2', [bcrypt.hashSync(newPwd, 10), user.id]);
      const { accepted } = await recoveryEmail(email, user.firstName, newPwd);
      if (accepted) {
        const notified = !!accepted.length;
        if (notified) sendSuccess(res, 200, 'Check your email');
      } else sendError(res, 502, 'Failed to send you an email, Try again');
    }
  }
};

export const resetPassword = async (req, res) => {
  const { oldPwd, newPwd } = req.body;
  const [result] = await queryDB(res, 'select password from users where id = $1', [req.payload.id]);
  try {
    const match = bcrypt.compareSync(oldPwd, result.password);
    if (!match) {
      sendError(res, 401, 'The old password is incorrect');
    } else {
      await queryDB(res, 'update users set password=$1 where id=$2', [bcrypt.hashSync(newPwd, 10), req.payload.id]);
      sendSuccess(res, 200, 'Password successfully changed');
    }
  } catch (error) {
    console.log(error);
    sendError(res, 500, 'Server error');
  }
};
