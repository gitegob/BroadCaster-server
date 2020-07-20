import { Router } from 'express';
import {
  createRecord, getRecords, getARecord, updateARecord, deleteARecord, updateStatus,
} from '../controllers/recordController';
import {
  validateParams, validateRecord, validateStatus, validateQueryParams,
} from '../middleware/validators';
import { auth, adminAuth } from '../middleware/auth';
import { checkRecord } from '../middleware/checkers';

const router = Router();

router.post('/', auth, validateRecord, createRecord);
router.get('/', auth, validateQueryParams, getRecords);
router.get('/:recordID', auth, validateParams, checkRecord, getARecord);
router.patch('/:recordID', auth, validateParams, checkRecord, validateRecord, updateARecord);
router.delete('/:recordID', auth, validateParams, checkRecord, deleteARecord);
router.patch('/:recordID/status', auth, validateParams, adminAuth, checkRecord, validateStatus, updateStatus);

export default router;
