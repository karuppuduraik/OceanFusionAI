const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'OceanFusion@2026!Secure#JWT$VeryLongRandomKey';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

/**
 * Generate signed JWT token for a user.
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
};

/**
 * Register a new user with bcrypt password hashing and JWT issuance.
 * Endpoint: POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide name, email, and password.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if email already registered
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'An account with this email address already exists.',
      });
    }

    // Role assignment
    const isAdmin =
      normalizedEmail === 'karuppuduraikece@gmail.com' ||
      normalizedEmail.includes('admin@');
    const role = isAdmin ? 'admin' : 'user';

    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      role,
      authProvider: 'local',
    });

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: user.toAuthJSON(token),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Authenticate user credentials and return signed JWT token.
 * Endpoint: POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide both email and password.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find user by email
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.',
      });
    }

    // Compare bcrypt password hash
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.',
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Signed in successfully',
      token,
      user: user.toAuthJSON(token),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Authenticate or provision user via Google OAuth and issue JWT.
 * Endpoint: POST /api/auth/google
 */
const googleLogin = async (req, res, next) => {
  try {
    const { email, name, avatar } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Google authentication payload missing email address.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: normalizedEmail });

    if (user) {
      // Update avatar or name if provided
      if (avatar && user.avatar !== avatar) user.avatar = avatar;
      if (name && user.name !== name) user.name = name;
      await user.save();
    } else {
      const isAdmin =
        normalizedEmail === 'karuppuduraikece@gmail.com' ||
        normalizedEmail.includes('admin');
      
      user = await User.create({
        name: name || normalizedEmail.split('@')[0],
        email: normalizedEmail,
        password: `oauth_${Date.now()}_${Math.random().toString(36)}`,
        role: isAdmin ? 'admin' : 'user',
        avatar: avatar || null,
        authProvider: 'google',
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Google login successful',
      token,
      user: user.toAuthJSON(token),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve authenticated user profile from verified JWT.
 * Endpoint: GET /api/auth/me
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id || req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found.',
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all registered users from MongoDB Atlas (Admin only).
 * Endpoint: GET /api/auth/users
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a user's role (Admin only).
 * Endpoint: PUT /api/auth/users/:id/role
 */
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const { id } = req.params;

    if (!['admin', 'researcher', 'coast_guard', 'user'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid role specified.',
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a user account (Admin only).
 * Endpoint: DELETE /api/auth/users/:id
 */
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (req.user.id === id || req.user._id?.toString() === id) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete your own active administrative account.',
      });
    }

    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'User not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  googleLogin,
  getMe,
  getAllUsers,
  updateUserRole,
  deleteUser,
};
