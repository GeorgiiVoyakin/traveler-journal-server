import Router from 'express';
const router = new Router();
import { registration, login, getUsers } from '../controllers/authController';
import { check } from 'express-validator';
import authMiddleware from '../middleware/authMiddleware';
import roleMiddleware from '../middleware/roleMiddleware';

router.post(
  '/registration',
  [
    check('username', 'Username cannot be empty').notEmpty(),
    check(
      'password',
      'Password cannot be less than 4 or greater than 10 character'
    ).isLength({ min: 4, max: 10 }),
  ],
  registration
);
router.post('/login', login);
router.get('/users', roleMiddleware(['ADMIN']), getUsers);

export default router;
