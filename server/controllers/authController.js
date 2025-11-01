import { createHashedToken, createToken } from '#utils/crypt.js';
import { sendActivationEmail, sendResetEmail } from '#utils/email.js';
import logger from '#utils/logger.js';
import jwt from 'jsonwebtoken';
import User, { validatePassword } from '../models/User.js';


export const me = async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

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
        const { identifier, password } = req.body;

        logger.info('Login attempt with:', { identifier });

        if (!identifier || !password) {
            return res.status(400).json({ message: 'Username/email and password are required' });
        }

        const isEmail = identifier.includes('@');

        const user = await User.findOne(isEmail ? { email: identifier } : { username: identifier });

        if (!user) {
            return res.status(401).json({ message: 'Invalid username/email or password' });
        }

        if (!user.isActive && !req.user.role === 'admin') {
            return res.status(403).json({ message: 'Account not activated.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username/email or password' });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        const userResponse = user.toObject();

        res.json({ token, user: userResponse });
    } catch (error) {
        logger.error(error, 'Login error:');
        res.status(500).json({ message: 'Server error during login', error: error.message });
    }
};

export const requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const user = await User.findOne({ email });

        if (user) {
            const { plainToken, hashedToken, expires } = createToken(24);
            const resetActionUrl = `${process.env.SNOOP_FRONTEND_BASE_URL}/reset-password?token=${plainToken}`;

            user.passwordResetToken = hashedToken;
            user.passwordResetExpires = expires;

            await user.save({ validateBeforeSave: false });
            await sendResetEmail(user.email, resetActionUrl);
        }

    } catch (err) {
        logger.error(err);
    } finally {
        res.status(200).json({
            message: 'Your password reset request has been recorded and is pending admin approval.'
        });
    }
};

export const resetPassword = async (req, res) => {

    try {
        const { password } = req.body;
        if (!password) {
            return res.status(400).json({ message: 'Password is required' })
        };

        const { token } = req.params;
        if (!token) {
            return res.status(400).json({ message: 'Token is required' })
        };

        const user = await User.findOne({
            passwordResetToken: createHashedToken(token),
            passwordResetExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Token is invalid or has expired' });
        }

        const validationErrors = validatePassword(password);
        if (validationErrors.length > 0) {
            return res.status(400).json({
                message: 'Password does not meet security requirements',
                errors: validationErrors
            });
        }

        user.password = password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        return res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (err) {
        logger.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Username, email and password are required' });
        }

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });

        if (!existingUser) {

            const user = new User({
                username,
                email,
                password,
                isActive: false
            });

            const { plainToken, hashedToken, expires } = createToken(24);
            const activationUrl = `${process.env.SNOOP_FRONTEND_BASE_URL}/activate-account?token=${plainToken}`;

            user.activationToken = hashedToken;
            user.activationTokenExpires = expires

            await user.save();
            await sendActivationEmail(email, username, activationUrl);
        }
    } catch (error) {
        logger.error(error, 'Error Signup:');
        return res.status(500).json({ message: 'Server error during signup.' });
    } finally {
        res.status(200).json({
            message: 'If this account can be registered, you will receive a confirmation email.'
        });
    }
};

export const activateAccount = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ message: 'Activation token is required.' });
        }

        const user = await User.findOne({
            activationToken: createHashedToken(token),
            activationTokenExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired activation token.' });
        }

        user.isActive = true;
        user.activationToken = undefined;
        user.activationTokenExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Account activated successfully.' });

    } catch (error) {
        logger.error(error, 'Error activating account:');
        res.status(500).json({ message: error.message || 'Error activating account' });
    }
};