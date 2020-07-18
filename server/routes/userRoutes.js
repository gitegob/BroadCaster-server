import { Router } from 'express';
import {
  signUp, logIn, getProfile, makeAdmin,
} from '../controllers/userController';
import { validateSignup, validateLogin } from '../middleware/validators';
import { checkSignup, checkLogin } from '../middleware/checkers';
import { auth } from '../middleware/auth';
import serverError from '../controllers/serverController';

const router = Router();

router.get('/profile', auth, getProfile);
router.post('/make-admin', makeAdmin);
router.post('/signup', validateSignup, checkSignup, signUp);
router.post('/login', validateLogin, checkLogin, logIn);
router.post('/error', serverError);

export default router;
