import express from 'express';
import { getDashboard } from '../controllers/owner.controller.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

router.use(authenticate);
router.use(authorize('STORE_OWNER'));

router.get('/dashboard', getDashboard);

export default router;
