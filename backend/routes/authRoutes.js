const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, phone, address, dob, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: 'Email already in use' });

        const user = new User({ name, email, phone, address, dob, password });


        let formattedDob;
        if (dob) {
            // Convert DD/MM/YYYY → YYYY-MM-DD
            const [day, month, year] = dob.split('/');
            formattedDob = new Date(`${year}-${month}-${day}`);
        }

        const newUser = new User({
            name,
            email,
            phone,
            address,
            dob: formattedDob,
            password, // make sure to hash before saving
        });

        await newUser.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({ token, user: { name, email, phone, address, dob } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({ token, user: { name: user.name, email, phone: user.phone, address: user.address, dob: user.dob } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Middleware to protect routes
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
});

module.exports = {
    router,
    authMiddleware
};
