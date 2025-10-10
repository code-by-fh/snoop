import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import logger from '#utils/logger.js';

export const me = async (req, res) => {
    try {
        // Extract token from Authorization header
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user by ID from the token
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return user information
        res.json({ user });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        logger.error(error, 'Token verification error:');
        res.status(500).json({ message: 'Server error during token verification' });
    }
};


export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        logger.info('Login attempt with:', { username, password });

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
          return res.status(401).json({ 
            message: 'Invalid email or password' 
          });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        // Remove password from response
        const userResponse = {
            ...user.toObject(),
            password: undefined
        };

        res.json({
            token,
            user: userResponse
        });
    } catch (error) {
        logger.error(error, 'Login error:');
        res.status(500).json({
            message: 'Server error during login',
            error: error.message
        });
    }
};