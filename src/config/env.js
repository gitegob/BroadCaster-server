import { config } from 'dotenv';

config();

const env = {
  FRONTEND_URL: process.env.FRONTEND_URL,
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_KEY: process.env.JWT_KEY,
  A_FNAME: process.env.A_FNAME,
  A_LNAME: process.env.A_LNAME,
  A_EMAIL: process.env.A_EMAIL,
  A_PASSWORD: process.env.A_PASSWORD,
  G_MAIL: process.env.G_MAIL,
  G_PWD: process.env.G_PWD,
  DATABASE_URL: process.env.DATABASE_URL,
  MOCK_DATABASE_URL: process.env.MOCK_DATABASE_URL,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
  sendgrid_api_key: process.env.sendgrid_api_key,
  sgrid_api_key: process.env.sgrid_api_key,
  SLACK_TOKEN: process.env.SLACK_TOKEN,
  PORT: process.env.PORT,
};

export default env;
