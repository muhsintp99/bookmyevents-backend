const User = require('../models/User');
const { validateEmail } = require('../utils/validate');
const path = require('path');
const fs = require('fs').promises;

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const filterUsersByRole = async (req, res) => {
  const { role } = req.query;
  if (!['admin', 'licensee', 'vendor', 'user'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    const users = await User.find({ role }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const updateUser = async (req, res) => {
  const { email, role } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (email && email !== user.email) {
      if (!validateEmail(email)) {
        return res.status(400).json({ message: 'Invalid email' });
      }
      user.email = email;
      user.isVerified = false;
    }

    if (role && ['admin', 'licensee', 'vendor', 'user'].includes(role)) {
      user.role = role;
    }

    await user.save();
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Delete profile image if it exists
    if (user.profileImage) {
      try {
        await fs.unlink(path.join(__dirname, '..', user.profileImage));
      } catch (err) {
        console.error('Error deleting image:', err);
      }
    }

    await User.deleteOne({ _id: req.params.id });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isBlocked) return res.status(400).json({ message: 'User already blocked' });

    user.isBlocked = true;
    await user.save();
    res.json({ message: 'User blocked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const unblockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.isBlocked) return res.status(400).json({ message: 'User not blocked' });

    user.isBlocked = false;
    await user.save();
    res.json({ message: 'User unblocked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const uploadProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Delete previous image if it exists
    if (user.profileImage) {
      try {
        await fs.unlink(path.join(__dirname, '..', user.profileImage));
      } catch (err) {
        console.error('Error deleting previous image:', err);
      }
    }

    // Save new image path
    user.profileImage = `/uploads/profile_images/${req.file.filename}`;
    await user.save();

    res.json({ message: 'Profile image uploaded successfully', profileImage: user.profileImage });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  getCurrentUser,
  getAllUsers,
  filterUsersByRole,
  updateUser,
  deleteUser,
  blockUser,
  unblockUser,
  uploadProfileImage,
};