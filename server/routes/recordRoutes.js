import { Router } from 'express';
import fileupload from 'express-fileupload';
import {
  createRecord, getRecords, getInterventions, getRedFlags,
  getARecord, updateARecord, deleteARecord, updateStatus,
} from '../controllers/recordController';
import { validateParams, validateRecord, validateStatus } from '../middleware/validators';
import { auth, adminAuth } from '../middleware/auth';

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

router.post('/', auth, validateRecord, createRecord);
router.get('/', auth, getRecords);
router.get('/red-flags', auth, getRedFlags);
router.get('/interventions', auth, getInterventions);
router.get('/:recordID', auth, validateParams, getARecord);
router.patch('/:recordID', auth, validateParams, validateRecord, updateARecord);
router.delete('/:recordID', auth, validateParams, deleteARecord);
router.patch('/:recordID/status', auth, validateParams, adminAuth, validateStatus, updateStatus);

export default router;
