import { config } from 'dotenv';
import { createTransport } from 'nodemailer';

config();

const transporter = createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.G_MAIL,
    pass: process.env.G_PWD,
  },
});

export default transporter;
