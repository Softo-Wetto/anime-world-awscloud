// backend/controllers/protectedController.js

// Example function for a protected route
const getProtectedData = (req, res) => {
    res.json({ message: 'This is protected data', userId: req.user });
  };
  
  module.exports = { getProtectedData };
  