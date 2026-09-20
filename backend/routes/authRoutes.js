const express = require('express');
const {
  register,
  login,
  googleLogin,
  getMe,
  getAllUsers,
  updateUserRole,
  updateUser,
  deleteUser,
} = require('../controllers/authController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);

// Protected routes (requires valid JWT token)
router.get('/me', authenticateToken, getMe);

// Admin-only protected routes (requires valid JWT token + admin role)
router.get('/users', authenticateToken, requireAdmin, getAllUsers);
router.put('/users/:id/role', authenticateToken, requireAdmin, updateUserRole);
router.put('/users/:id', authenticateToken, requireAdmin, updateUser);
router.delete('/users/:id', authenticateToken, requireAdmin, deleteUser);

module.exports = router;
