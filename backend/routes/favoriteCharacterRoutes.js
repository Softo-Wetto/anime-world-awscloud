// backend/routes/favoriteRoutes.js
const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  addFavorite,
  removeFavorite,
  getFavorites,
} = require('../controllers/favoriteController');

const router = express.Router();

router.post('/add', protect, addFavorite);
router.delete('/remove/:characterId', protect, removeFavorite); // Ensure the correct param is used
router.get('/', protect, getFavorites);

module.exports = router;
