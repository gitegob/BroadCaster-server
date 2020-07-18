import { config } from 'dotenv';
import { queryDB } from '../db/dbConfig';

config();

export const mockData = {
  admin: {
    firstName: process.env.A_FNAME,
    lastName: process.env.A_LNAME,
    email: process.env.A_EMAIL,
    password: process.env.A_PASSWORD,
  },
  benSignup: {
    firstName: 'Ben Fabregas',
    lastName: 'Gisa',
    email: 'gitegobtech@gmail.com',
    password: 'Password@123',
  },
  bruceSignup: {
    firstName: 'Bruce Johnson',
    lastName: 'Sangwa',
    email: 'bruceSangwa@gmail.com',
    password: 'Password@123',
  },
  benSignupInc: {
    firstName: 'Ben',
    email: 'gitegobtech@gmail.com',
    password: 'Password@123',
  },
  benSignupBad: {
    firstName: 'B',
    lastName: 'Gisa',
    email: 'gitegobtech@gmail.com',
    password: 'Password@123',
  },
  benLogin: {
    email: 'gitegobtech@gmail.com',
    password: 'Password@123',
  },
  adminLogin: {
    email: process.env.A_EMAIL,
    password: process.env.A_PASSWORD,
  },
  benLoginNotFound: {
    email: 'gisabena@gmail.com',
    password: 'Password@123',
  },
  benLoginIncPwd: {
    email: 'gitegobtech@gmail.com',
    password: 'Password@100',
  },
  benLoginBad: {
    email: 'bengisa  @gmail.com',
    password: 'Password@123',
  },
  newIntRecord: {
    title: 'Corruption   somewhere',
    type: 'intervention',
    district: 'Kicukiro',
    sector: 'Niboye',
    cell: 'Gatare',
    description: 'There is   corruption in my neighborhood and it has got to stop',
  },
  newRecordEdited: {
    title: 'Corruption somewhere edited',
    type: 'intervention',
    district: 'Kicukiro',
    sector: 'Niboye',
    cell: 'Gatare',
    description: 'There is corruption in my neighborhood and it has got to stop',
  },
  newRecordEditedNoChange: {
    title: '',
    type: '',
    district: '',
    sector: '',
    cell: '',
    description: '',
  },
  newRecordEditedWrong: {
    title: 'Corruption somewhere edited',
    type: 'foo',
    district: 'Kicukiro',
    sector: 'Niboye',
    cell: 'Gatare',
    description: 'There is   corruption in my neighborhood and it has got to stop edited',
  },
  newRedRecord: {
    title: 'Corruption somewhere',
    type: 'red-flag',
    district: 'Kicukiro',
    sector: 'Niboye',
    cell: 'Gatare',
    description: 'There is   corruption in my neighborhood and it has got to stop',
  },
  newRecordInc: {
    type: 'intervention',
    district: 'Kicukiro',
    sector: 'Niboye',
    cell: 'Gatare',
    description: 'There is   corruption in my neighborhood and it has got to stop',
  },
  invalidToken: 'eyhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3ROYW1lIjoiQmVuIiwibGFzdE5hbWUiOiJHaXNhIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTU3Mjg4MzQ4MX0.WviyBGlvr1y0KNfcxwDwjtw8JwmJ8GCe6N5wk-OPSgk',
  nonExistToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3ROYW1lIjoiQmVuIiwibGFzdE5hbWUiOiJHaXNhIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTU3Mjk1NjY3NH0.8Rt05JoON0ayCTtetWWelYh4q9sz-NLLZJOUEqJ79Ig',
};

export const clearUsers = async () => {
  await queryDB(null, 'delete from users', []);
};

export const clearRecords = async () => {
  await queryDB(null, 'delete from records', []);
};
