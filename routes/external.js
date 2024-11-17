const express = require('express');
const axios = require('axios');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const router = express.Router();

// Получение новостей
router.get('/news', async (req, res) => {
    try {
        const response = await axios.get('https://newsapi.org/v2/top-headlines', {
            params: {
                country: 'us',
                apiKey: process.env.NEWS_API_KEY,
            },
        });
        res.json(response.data.articles);
    } catch (error) {
        console.error('Error fetching news:', error.message);
        res.status(500).json({ error: 'Failed to fetch news.' });
    }
});

// Получение финансовых данных
router.get('/finance', async (req, res) => {
    try {
        const response = await axios.get(`https://api.coingecko.com/api/v3/coins/markets`, {
            params: {
                vs_currency: 'usd',
                order: 'market_cap_desc',
                per_page: 10,
                page: 1,
                sparkline: false,
            },
            headers: {
                'x-cg-demo-api-key': process.env.COINGECKO_API_KEY,
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching financial data:', error.message);
        res.status(500).json({ error: 'Failed to fetch financial data.' });
    }
});

module.exports = router;
