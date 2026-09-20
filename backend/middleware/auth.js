const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to authenticate requests using JWT Bearer token.
 * Header format: Authorization: Bearer <token>
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. No JWT token provided in Authorization header.',
      });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'OceanFusion@2026!Secure#JWT$VeryLongRandomKey';

    const decoded = jwt.verify(token, secret);

    // Attach decoded user data
    req.user = decoded;

    // Optionally attach fresh DB user if available
    try {
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
      }
    } catch (dbErr) {
      // If DB lookup fails, use token payload
    }

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'JWT token has expired. Please sign in again.',
      });
    }
    return res.status(401).json({
      success: false,
      error: 'Invalid or malformed JWT token.',
    });
  }
};

/**
 * Middleware to restrict access strictly to Administrators.
 */
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Forbidden. Administrator privileges required.',
    });
  }
  next();
};

/**
 * Middleware factory to restrict access to specific roles.
 */
const requireRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Forbidden. Requires one of the following roles: ${allowedRoles.join(', ')}`,
      });
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireRoles,
};
