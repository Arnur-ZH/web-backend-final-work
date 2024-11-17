const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const router = express.Router();

// Функция отправки email
async function sendEmail(to, subject, text) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"Football Cards" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error('Error sending email:', error.message);
        throw new Error('Email not sent');
    }
}

// Регистрация пользователя
router.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email or username already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ username, email, password: hashedPassword, role });
        await user.save();

        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        console.error('Error during registration:', error.message);
        res.status(500).json({ error: 'Failed to register user.' });
    }
});

// Генерация 2FA секрета
router.post('/2fa/setup', async (req, res) => {
    try {
        const { userId } = req.body; // Идентификатор пользователя
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const secret = speakeasy.generateSecret({ length: 20 });
        if (!secret.base32) {
            return res.status(500).json({ error: 'Failed to generate 2FA secret.' });
        }
        user.twoFactorSecret = secret.base32;
        user.isTwoFactorEnabled = true;
        await user.save();

        res.status(200).json({
            message: '2FA setup successful',
            secret: secret.otpauth_url, // URL для сканирования в приложении
        });
    } catch (error) {
        console.error('Error during 2FA setup:', error.message);
        res.status(500).json({ error: 'Failed to setup 2FA.' });
    }
});

// Логин с 2FA
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        if (user.isTwoFactorEnabled) {
            // Генерация токена 2FA
            const token = speakeasy.totp({
                secret: user.twoFactorSecret,
                encoding: 'base32',
            });

            // Отправка токена на почту
            try {
                await sendEmail(user.email, 'Your 2FA Token', `Your 2FA token is: ${token}`);
                return res.status(200).json({
                    message: '2FA token sent to your email.',
                });
            } catch (error) {
                console.error('Error sending 2FA email:', error.message);
                return res.status(500).json({ error: 'Failed to send 2FA token.' });
            }
        }

        // Если 2FA не включен
        const authToken = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.json({ token: authToken });
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ error: 'Failed to login.' });
    }
});

module.exports = router;
