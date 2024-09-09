// backend/controllers/bookmarkController.js
const Bookmark = require('../models/Bookmark');

// @desc Add an anime to bookmarks
// @route POST /api/bookmarks/add
const addBookmark = async (req, res) => {
    try {
        const { animeId, title, imageUrl } = req.body;
        const userId = req.user.id;  // Ensure req.user is being used correctly

        if (!userId) {
            return res.status(400).json({ message: 'User not authenticated' });
        }

        // Check if the bookmark already exists
        const existingBookmark = await Bookmark.findOne({
            where: { userId, animeId },
        });

        if (existingBookmark) {
            return res.status(400).json({ message: 'Anime is already bookmarked.' });
        }

        const bookmark = await Bookmark.create({
            userId,
            animeId,
            title,
            imageUrl,
        });

        res.status(201).json(bookmark);
    } catch (error) {
        console.error('Error in addBookmark:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc Get all bookmarks for a user
// @route GET /api/bookmarks
const getBookmarks = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!userId) {
            return res.status(400).json({ message: 'User not authenticated' });
        }

        const bookmarks = await Bookmark.findAll({ where: { userId } });
        res.json(bookmarks);
    } catch (error) {
        console.error('Error in getBookmarks:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc Remove a bookmark
// @route DELETE /api/bookmarks/remove/:animeId
const removeBookmark = async (req, res) => {
    try {
        const userId = req.user.id;
        const { animeId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: 'User not authenticated' });
        }

        await Bookmark.destroy({ where: { userId, animeId } });
        res.status(200).json({ message: 'Bookmark removed' });
    } catch (error) {
        console.error('Error in removeBookmark:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { addBookmark, getBookmarks, removeBookmark };
