const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    twoFactorSecret: { type: String }, // Секретный ключ для 2FA
    isTwoFactorEnabled: { type: Boolean, default: false }, // Включен ли 2FA
});

module.exports = mongoose.model('User', userSchema);
