const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const FavoriteCharacter = sequelize.define('FavoriteCharacter', {
    userId: {
      type: DataTypes.STRING, 
      allowNull: false,
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
