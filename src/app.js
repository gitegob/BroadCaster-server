/* eslint-disable no-console */
import 'colors';
import express from 'express';
import { json, urlencoded } from 'body-parser';
import helmet from 'helmet';
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
import limiter from './config/limiter';

const app = express();
const port = env.PORT;
const origin = env.NODE_ENV === 'production' ? env.FRONTEND_URL || 'https://broadcaster.netlify.app' : '*';

app.use(helmet());
if (env.NODE_ENV === 'production') app.use(limiter);
app.use(cors({
  origin,
  methods: 'GET,POST,PATCH,DELETE',
}));
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https' && (env.NODE_ENV === 'production')) {
    res.redirect(`https://${req.get('host') + req.originalUrl}`);
  }
  next();
});
app.use(json());
app.use(
  urlencoded({
    extended: false,
  }),
);
app.use(morgan('dev'));
app.get('/', async (_req, res) => {
  await notifySlack('App GET /');
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
