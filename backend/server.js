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
const contactRoutes = require('./routes/contactRoutes'); 

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

// CORS Middleware with specific origin
app.use(cors({
  origin: 'http://ec2-54-206-189-41.ap-southeast-2.compute.amazonaws.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Debug log for server start
console.log('Server is starting...');

// API routes
app.use('/api', protectedRoutes);
app.use('/api/bookmarks', bookmarkRoutes); 
app.use('/api/image', imageRoute);
app.use('/api/favorites', favoriteCharacterRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/contact', contactRoutes); // Register contact route

// Error handling middleware - move to end to catch any errors
app.use(notFound);
app.use(errorHandler);

// Health check
app.get('/', (req, res) => {
  res.status(200).send('Health check passed');
});

// Debug log for successful server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
