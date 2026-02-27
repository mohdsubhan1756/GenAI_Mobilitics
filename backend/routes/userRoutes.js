const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

/* =========================
GET PROFILE
========================= */
router.post('/profile', async (req, res) => {
  try {
    const { userId } = req.body;
    console.log("USER ID: ", userId);

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* =========================
UPDATE PROFILE
========================= */
router.put('/update', async (req, res) => {

  try {

    const { userId, name, phone, address, dob } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, phone, address, dob },
      { new: true }
    ).select('-password');

    res.json(updatedUser);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});


/* =========================
CHANGE PASSWORD
========================= */
router.put('/change-password', async (req, res) => {

  try {

    const { userId, oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);

    const match = await user.comparePassword(oldPassword);

    if (!match) {
      return res.status(400).json({ message: 'Incorrect old password' });
    }

    user.password = newPassword;

    await user.save();

    res.json({ message: 'Password updated successfully' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});


/* =========================
DELETE ACCOUNT
========================= */
router.delete('/delete', async (req, res) => {

  try {

    const { userId } = req.body;
    console.log("USER ID: ", userId);

    await User.findByIdAndDelete(userId);

    res.json({ message: 'Account deleted' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});

module.exports = router;