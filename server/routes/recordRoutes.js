import { Router } from 'express';
import {
  createRecord, getRecords, getInterventions, getRedFlags,
  getARecord, updateARecord, deleteARecord, updateStatus,
} from '../controllers/recordController';
import { validateParams, validateRecord, validateStatus } from '../middleware/validators';
import { auth, adminAuth } from '../middleware/auth';
import { checkRecord } from '../middleware/checkers';

const router = Router();

router.post('/', auth, validateRecord, createRecord);
router.get('/', auth, getRecords);
router.get('/red-flags', auth, getRedFlags);
router.get('/interventions', auth, getInterventions);
router.get('/:recordID', auth, validateParams, checkRecord, getARecord);
router.patch('/:recordID', auth, validateParams, checkRecord, validateRecord, updateARecord);
router.delete('/:recordID', auth, validateParams, checkRecord, deleteARecord);
router.patch('/:recordID/status', auth, validateParams, adminAuth, checkRecord, validateStatus, updateStatus);

export default router;
