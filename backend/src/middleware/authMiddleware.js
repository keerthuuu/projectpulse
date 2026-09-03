import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import env from '../config/env.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Authorization token required in header format (Bearer <token>).'
      });
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET);
    } catch (verifyErr) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Invalid or expired authentication token.'
      });
    }

    // Fetch the latest user record & role from MongoDB
    const userProfile = await User.findById(decoded.id);

    if (!userProfile) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: User account no longer exists.'
      });
    }

    req.user = {
      id: userProfile._id.toString(),
      email: userProfile.email,
      full_name: userProfile.full_name,
      role: userProfile.role
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Failed to authenticate user request.'
    });
  }
};

export default authMiddleware;
