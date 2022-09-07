const Router = require('express');
const router = new Router();
const controller = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/username', authMiddleware, controller.getUsername);

module.exports = router;
