const Router = require('express');
const router = new Router();
const controller = require('../controllers/authController');
const { check } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post(
  '/registration',
  [
    check('username', 'Username cannot be empty').notEmpty(),
    check(
      'password',
      'Password cannot be less than 4 or greater than 10 character'
    ).isLength({ min: 4, max: 10 }),
  ],
  controller.registration
);
router.post('/login', controller.login);
router.get('/users', roleMiddleware(['ADMIN']), controller.getUsers);

module.exports = router;
