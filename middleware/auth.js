const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function isAuthenticated(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).send('Unauthorized: No token provided.');
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        if (!req.user) {
            return res.status(401).send('Unauthorized: User not found.');
        }
        next();
    } catch (err) {
        console.error('Authorization error:', err.message);
        res.status(401).send('Unauthorized.');
    }
}

function isAdmin(req, res, next) {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).send('Forbidden: Admins only.');
    }
    next();
}

module.exports = { isAuthenticated, isAdmin };
