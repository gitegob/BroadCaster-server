import { Router } from 'express';
import fileupload from 'express-fileupload';
import {
  signUp, logIn, getProfile, makeAdmin, updateProfile, getUserData,
} from '../controllers/userController';
import { validateSignup, validateLogin } from '../middleware/validators';
import { checkSignup, checkLogin } from '../middleware/checkers';
import { auth } from '../middleware/auth';
import serverError from '../controllers/serverController';

const router = Router();

router.use(
  fileupload({
    useTempFiles: true,
    debug: true,
    limits: {
      fileSize: 2 * 1024 * 1024,
    },
    abortOnLimit: true,
    responseOnLimit: 'File too large',
  }),
);

router.get('/userdata', auth, getUserData);
router.get('/profile/:id', auth, getProfile);
router.post('/make-admin', makeAdmin);
router.post('/signup', validateSignup, checkSignup, signUp);
router.post('/login', validateLogin, checkLogin, logIn);
router.post('/error', serverError);
router.patch('/profile/:id', auth, updateProfile);

export default router;
