const asyncHandler = require('express-async-handler');
const FavoriteCharacter = require('../models/FavoriteCharacter');

// @desc Get user's favorite characters
// @route GET /api/favorites
// @access Private
const getFavorites = asyncHandler(async (req, res) => {
    const userId = req.user.id;  // Ensure req.user.id is available and not undefined
    const favorites = await FavoriteCharacter.findAll({ where: { userId } });

    res.json(favorites);
});

// @desc Add a character to favorites
// @route POST /api/favorites/add
// @access Private
const addFavorite = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { characterId, characterName, imageUrl } = req.body; // Removed animeId and animeName
    try {
        const favoriteExists = await FavoriteCharacter.findOne({ where: { userId, characterId } });

        if (favoriteExists) {
            return res.status(400).json({ message: 'Character already in favorites' });
        }

        const favorite = await FavoriteCharacter.create({
            userId,
            characterId,
            characterName,
            imageUrl
        });

        res.status(201).json(favorite);
    } catch (error) {
        console.error('Error adding favorite character:', error);
        res.status(500).json({ message: 'Server error adding favorite character', error });
    }
});

// @desc Remove a character from favorites
// @route DELETE /api/favorites/remove/:characterId
// @access Private
const removeFavorite = asyncHandler(async (req, res) => {
    const userId = req.user.id;  // Ensure req.user.id is available and not undefined
    const { characterId } = req.params;

    const favorite = await FavoriteCharacter.findOne({ where: { userId, characterId } });

    if (!favorite) {
        return res.status(404).json({ message: 'Favorite character not found' });
    }

    await favorite.destroy();

    res.json({ message: 'Favorite character removed' });
});

module.exports = { getFavorites, addFavorite, removeFavorite };
