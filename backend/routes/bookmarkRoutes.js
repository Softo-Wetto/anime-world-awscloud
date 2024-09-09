// backend/routes/bookmarkRoutes.js
const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { addBookmark, getBookmarks, removeBookmark } = require('../controllers/bookmarkController');
const router = express.Router();

// Define the route for getting bookmarks
router.get('/', protect, getBookmarks);  // This should match the GET request you're making

// Other routes
router.post('/add', protect, addBookmark);
router.delete('/remove/:animeId', protect, removeBookmark);

module.exports = router;
