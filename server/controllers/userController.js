import logger from '#utils/logger.js';
import User from '../models/User.js';

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        logger.error(error, 'Error UserProfile:');
        res.status(500).json({ message: 'Error UserProfile', error: error.message });
    }
}

export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { username, email, password, currentPassword } = req.body;

        if (!currentPassword) {
            return res.status(400).json({ message: 'Current password is required' });
        }

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        if (username) {
            const existingUser = await User.findOne({ username });
            if (existingUser && existingUser.id !== user.id) {
                return res.status(400).json({ message: 'Username already exists', error: 'Duplicate username' });
            }
            user.username = username;
        }

        if (email) user.email = email;
        if (password) user.password = password;

        await user.save();

        const userResponse = user.toObject();
        delete userResponse.password;

        res.json(userResponse);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Error updating profile' });
    }
};
