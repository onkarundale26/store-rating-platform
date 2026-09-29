import express from 'express';
import { getStores, submitRating, modifyRating } from '../controllers/store.controller.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { ratingSchema } from '../validators/store.validator.js';

const router = express.Router();

router.use(authenticate);
router.use(authorize('NORMAL_USER'));

router.get('/', getStores);
router.post('/:id/ratings', validate(ratingSchema), submitRating);
router.put('/:id/ratings', validate(ratingSchema), modifyRating);

export default router;
