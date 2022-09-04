const Router = require('express');
const router = new Router();
const controller = require('../controllers/noteController');
const roleMiddleware = require('../middleware/roleMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create', authMiddleware, controller.create);
router.delete('/delete', authMiddleware, controller.remove);
router.put('/update', authMiddleware, controller.update);
// router.get('/note', roleMiddleware(['ADMIN']), controller.getNotes);
router.get('/get-by-user', roleMiddleware(['ADMIN']), controller.getAllByUser);
router.get(
  '/get-all-current-user',
  authMiddleware,
  controller.getAllNotesForCurrentUser
);

module.exports = router;
