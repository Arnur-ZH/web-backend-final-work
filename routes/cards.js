const express = require('express');
const multer = require('multer');
const Card = require('../models/Card');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const router = express.Router();

const upload = multer({ dest: 'public/uploads/' });

// Проверка маршрута
router.get('/test', (req, res) => {
    res.status(200).json({ message: 'Cards API is working!' });
});

// Получение всех карточек
router.get('/', async (req, res) => {
    try {
        const cards = await Card.find();
        res.json(cards);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch cards.' });
    }
});

// Получение карточки по ID
router.get('/:id', isAuthenticated, async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);
        if (!card) {
            return res.status(404).json({ error: 'Card not found.' });
        }
        res.json(card);
    } catch (error) {
        console.error('Error fetching card:', error);
        res.status(500).json({ error: 'Failed to fetch card.' });
    }
});

// Создание карточки
router.post('/', isAuthenticated, upload.single('image'), async (req, res) => {
    try {
        const { firstName, lastName, games, goals, assists } = req.body;
        const card = new Card({
            firstName,
            lastName,
            games,
            goals,
            assists,
            image: `/uploads/${req.file?.filename || 'default.jpg'}`,
            createdBy: req.user._id,
        });
        await card.save();
        res.status(201).json(card);
    } catch (error) {
        console.error('Error creating card:', error);
        res.status(500).json({ error: 'Failed to create card.' });
    }
});

router.put('/:id', isAuthenticated, async (req, res) => {
    try {
        const { firstName, lastName, games, goals, assists } = req.body;

        // Проверяем, существует ли карточка
        const card = await Card.findById(req.params.id);
        if (!card) {
            return res.status(404).json({ error: 'Card not found.' });
        }

        // Обновляем только переданные поля
        if (firstName) card.firstName = firstName;
        if (lastName) card.lastName = lastName;
        if (games) card.games = Number(games); // Преобразуем в число
        if (goals) card.goals = Number(goals); // Преобразуем в число
        if (assists) card.assists = Number(assists); // Преобразуем в число

        // Сохраняем изменения
        await card.save();

        res.status(200).json({ message: 'Card updated successfully', card });
    } catch (error) {
        console.error('Error updating card:', error.message);
        res.status(500).json({ error: 'Failed to update card.' });
    }
});



// Удаление карточки
router.delete('/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);
        if (!card) {
            return res.status(404).json({ error: 'Card not found.' });
        }

        // Удаление карточки
        await Card.deleteOne({ _id: req.params.id });

        res.status(204).send({ message: 'Card deleted successfully' });
    } catch (error) {
        console.error('Error deleting card:', error.message);
        res.status(500).json({ error: 'Failed to delete card.' });
    }
});



module.exports = router;
