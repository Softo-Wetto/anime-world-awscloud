const asyncHandler = require('express-async-handler');
const FavoriteCharacter = require('../models/FavoriteCharacter');

// @desc Get user's favorite characters
// @route GET /api/favorites
// @access Private
const getFavorites = async (req, res) => {
    try {
        const userId = req.user.sub;  // Use Cognito user ID

        const favorites = await FavoriteCharacter.findAll({
            where: { userId },
        });

        res.status(200).json(favorites);
    } catch (err) {
        console.error('Error in getFavorites:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc Add a character to favorites
// @route POST /api/favorites/add
// @access Private
const addFavorite = async (req, res) => {
    try {
        const { characterId, characterName, imageUrl } = req.body;
        const userId = req.user.sub;  // Cognito user ID

        // Check if the character is already favorited by this user
        const existingFavorite = await FavoriteCharacter.findOne({
            where: { userId, characterId },
        });

        if (existingFavorite) {
            return res.status(400).json({ message: 'Character is already favorited.' });
        }

        // Create new favorite character record
        const newFavorite = await FavoriteCharacter.create({
            userId,
            characterId,
            characterName,
            imageUrl,
        });

        res.status(201).json(newFavorite);
    } catch (err) {
        console.error('Error in addFavorite:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc Remove a character from favorites
// @route DELETE /api/favorites/remove/:characterId
// @access Private
const removeFavorite = async (req, res) => {
    try {
        const userId = req.user.sub;
        const { characterId } = req.params;

        const deleted = await FavoriteCharacter.destroy({ where: { userId, characterId } });

        if (!deleted) {
            return res.status(404).json({ message: 'Favorite not found' });
        }

        res.status(200).json({ message: 'Favorite removed successfully' });
    } catch (err) {
        console.error('Error in removeFavorite:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getFavorites, addFavorite, removeFavorite };
