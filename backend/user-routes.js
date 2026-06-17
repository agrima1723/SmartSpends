// Routes for User Profile & Preferences
import express from 'express';
import { User } from './models.js';
import { verifyToken, asyncHandler } from './middleware.js';
import argon2 from 'argon2';

const router = express.Router();

// Get current user profile
router.get('/profile', verifyToken, asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId).select('-passwordHash');
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
}));

// Update user profile
router.patch('/profile', verifyToken, asyncHandler(async (req, res) => {
  const { displayName, baseCurrency, privacyMode } = req.body;

  const user = await User.findByIdAndUpdate(
    req.userId,
    {
      ...(displayName && { displayName }),
      ...(baseCurrency && { baseCurrency }),
      ...(privacyMode !== undefined && { privacyMode }),
    },
    { new: true }
  ).select('-passwordHash');

  res.json({ message: 'Profile updated', user });
}));

// Change password
router.post('/change-password', verifyToken, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current and new passwords required' });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters' });
  }

  const user = await User.findById(req.userId);
  const isValid = await argon2.verify(user.passwordHash, currentPassword);

  if (!isValid) {
    return res.status(401).json({ error: 'Current password is incorrect' });
  }

  const newPasswordHash = await argon2.hash(newPassword, {
    type: argon2.argon2i,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 1,
  });

  await User.findByIdAndUpdate(req.userId, { passwordHash: newPasswordHash });
  res.json({ message: 'Password changed successfully' });
}));

export default router;
