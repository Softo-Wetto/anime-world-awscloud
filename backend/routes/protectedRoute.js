const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getProtectedData } = require('../controllers/protectedController');
const router = express.Router();

router.get('/protected-endpoint', protect, getProtectedData);

module.exports = router;
