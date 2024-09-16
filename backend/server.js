const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB } = require('./config/db');
const protectedRoutes = require('./routes/protectedRoute');
const bookmarkRoutes = require('./routes/bookmarkRoutes');
const imageRoute = require('./routes/imageRoute');
const favoriteCharacterRoutes = require('./routes/favoriteCharacterRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

// CORS Middleware
app.use(cors({ origin: '*' }));

// API routes
app.use('/api', protectedRoutes);
app.use('/api/bookmarks', bookmarkRoutes); 
app.use('/api/image', imageRoute);
app.use('/api/favorites', favoriteCharacterRoutes);
app.use('/api/upload', uploadRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
