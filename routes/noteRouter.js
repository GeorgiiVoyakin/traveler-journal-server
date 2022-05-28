const Router = require('express');
const router = new Router();
const controller = require('../controllers/noteController');
// const roleMiddleware = require('../middleware/roleMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create', authMiddleware, controller.create);
// router.get('/note', roleMiddleware(['ADMIN']), controller.getNotes);

module.exports = router;
