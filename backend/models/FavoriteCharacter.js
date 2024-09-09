const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');  // Assuming you have a User model

const FavoriteCharacter = sequelize.define('FavoriteCharacter', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    characterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    characterName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
}, {
  timestamps: true,
});

module.exports = FavoriteCharacter;
