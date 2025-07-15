const express = require('express');
const router = express.Router();
const {
  getCurrentUser,
  getAllUsers,
  filterUsersByRole,
  updateUser,
  deleteUser,
  blockUser,
  unblockUser,
  uploadProfileImage,
} = require('../controllers/userController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const upload = require('../middleware/multer');

router.get('/current', auth, getCurrentUser);
router.get('/all', auth, role('admin'), getAllUsers);
router.get('/filter', auth, role('admin'), filterUsersByRole);
router.put('/:id', auth, role('admin'), updateUser);
router.delete('/:id', auth, role('admin'), deleteUser);
router.put('/:id/block', auth, role('admin'), blockUser);
router.put('/:id/unblock', auth, role('admin'), unblockUser);
router.post('/profile/image', auth, upload, uploadProfileImage);

module.exports = router;