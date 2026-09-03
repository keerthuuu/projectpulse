import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import env from '../config/env.js';

const SALT_ROUNDS = 10;

export const register = async (req, res, next) => {
  try {
    const { email, password, fullName, role = 'employee' } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed: Email, password, and full_name are required.'
      });
    }

    const normalizedRole = role.toLowerCase().replace(' ', '_');

    // 1. Check whether this email is already registered
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.'
      });
    }

    // 2. Hash the password and create the new user
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await User.create({
      full_name: fullName,
      email: email.toLowerCase(),
      role: normalizedRole,
      password_hash: passwordHash
    });

    const userProfile = {
      id: newUser._id.toString(),
      full_name: newUser.full_name,
      name: newUser.full_name,
      email: newUser.email,
      role: newUser.role,
      created_at: newUser.created_at
    };

    // 3. Issue a JWT for this session
    const token = jwt.sign(
      { id: userProfile.id, email: userProfile.email, role: userProfile.role },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      data: {
        token,
        user: userProfile
      }
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed: Email and password are required.'
      });
    }

    // Mongoose .select('+password_hash') needed since toJSON transform strips it
    const userRow = await User.findOne({ email: email.toLowerCase() }).select('+password_hash');

    if (!userRow || !userRow.password_hash) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const passwordMatches = await bcrypt.compare(password, userRow.password_hash);
    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = jwt.sign(
      { id: userRow._id.toString(), email: userRow.email, role: userRow.role },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: userRow._id.toString(),
          email: userRow.email,
          full_name: userRow.full_name,
          name: userRow.full_name,
          role: userRow.role,
          avatar: userRow.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100'
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Signed out successfully.'
    });
  } catch (err) {
    next(err);
  }
};

export const me = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      data: req.user
    });
  } catch (err) {
    next(err);
  }
};
