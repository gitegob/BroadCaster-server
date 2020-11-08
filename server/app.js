/* eslint-disable no-console */
import 'colors';
import express from 'express';
import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import { sendSuccess, sendError } from './helpers/senders';
import userRoutes from './routes/userRoutes';
import recordRoutes from './routes/recordRoutes';
import { sendFeedback } from './controllers/userController';
// eslint-disable-next-line no-unused-vars
import { db } from './db/dbConfig';
import { debugApp, debugError } from './config/debug';
import env from './config/env';
import notifySlack from './config/slack';

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(json());
app.use(
  urlencoded({
    extended: false,
  }),
);
app.use(morgan('dev'));
app.get('/', (_req, res) => {
  sendSuccess(res, 200, `Welcome to BroadCaster ${env.NODE_ENV} mode`);
});
app.post('/api/v1/feedback', sendFeedback);
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/records', recordRoutes);
app.use('/*', (_req, res) => {
  sendError(res, 404, 'Not Found');
});

// eslint-disable-next-line no-unused-vars
app.use(async (error, req, res, next) => {
  await notifySlack(error);
  debugError('error => ', error.message);
  sendError(res, error.status || 500, `SERVER DOWN!: ${error.message}`);
});

app.listen(port, () => {
  notifySlack('App Started');
  debugApp(`Server running on ${port}...`.cyan.bold);
});

export default app;
