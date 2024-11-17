const mongoose = require('mongoose');

// Функция для подключения к MongoDB
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI); // Убраны устаревшие параметры
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Завершить процесс при ошибке
    }
};

module.exports = connectDB;
