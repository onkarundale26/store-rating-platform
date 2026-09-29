import express from 'express';
import { getDashboard, createUser, getUsers, getUserById, createStore, getStores } from '../controllers/admin.controller.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { createUserSchema } from '../validators/user.validator.js';
import { createStoreSchema } from '../validators/store.validator.js';

const router = express.Router();

router.use(authenticate);
router.use(authorize('ADMIN'));

router.get('/dashboard', getDashboard);

router.post('/users', validate(createUserSchema), createUser);
router.get('/users', getUsers);
router.get('/users/:id', getUserById);

router.post('/stores', validate(createStoreSchema), createStore);
router.get('/stores', getStores);

export default router;
