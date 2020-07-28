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
router.get('/:id', auth, validateParams, checkRecord, getARecord);
router.patch('/:id', auth, validateParams, checkRecord, validateRecord, updateARecord);
router.delete('/:id', auth, validateParams, checkRecord, deleteARecord);
router.patch('/:id/status', auth, validateParams, adminAuth, checkRecord, validateStatus, updateStatus);

export default router;
