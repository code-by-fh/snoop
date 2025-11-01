import Job from '../models/Job.js';
import Listing from '../models/Listing.js';
import User from '../models/User.js';
import logger from '#utils/logger.js';

export const getUsers = async (req, res) => {

    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        logger.error(error, 'Error fetching users:');
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
}

export const createUser = async (req, res) => {
    try {
        logger.info('Creating user with body:', req.body);
        const { username, email, password, role } = req.body;

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = new User({
            username,
            email,
            password,
            role: role || 'user',
            isActive: true
        });

        await newUser.save();

        const userResponse = newUser.toObject();
        delete userResponse.password;

        res.status(201).json(userResponse);
    } catch (error) {
        logger.error(error, 'Error creating user:');
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
}

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const jobs = await Job.find({ user: user._id }).populate({
            path: 'providers.listings',
            model: 'Listing'
        });

        const listingIds = jobs.flatMap(job =>
            job.providers.flatMap(p => p.listings || []).map(l => l._id)
        );

        if (listingIds.length > 0) {
            await Listing.deleteMany({ _id: { $in: listingIds } });
        }

        const jobIds = jobs.map(job => job._id);
        if (jobIds.length > 0) {
            await Job.deleteMany({ _id: { $in: jobIds } });
        }

        await user.deleteOne();

        res.json({ message: 'User, jobs, and related listings deleted successfully.' });
    } catch (error) {
        logger.error(error, 'Error deleting user:');
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { username, email, role, password, isActive } = req.body;
        const userId = req.params.id;

        let user = await User.findById(userId);

        if (user) {
            if (username !== undefined) user.username = username;
            if (email !== undefined) user.email = email;
            if (role !== undefined && req.user.role === 'admin' && user.id !== req.user.id) user.role = role;
            if (password !== undefined) user.password = password;
            if (isActive !== undefined) user.isActive = isActive;
            await user.save();
        } else {
            user = new User({
                _id: userId,
                username,
                email,
                role,
                password,
                isActive
            });
            await user.save();
        }

        const userResponse = user.toObject();
        delete userResponse.password;

        res.json(userResponse);
    } catch (error) {
        logger.error(error, 'Error updating or creating user:');
        res.status(500).json({ message: 'Error updating or creating user', error: error.message });
    }
};
