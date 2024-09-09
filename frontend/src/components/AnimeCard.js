import React from 'react';
import { Link } from 'react-router-dom';
import './AnimeCard.css'; // Import the CSS file for styling

const AnimeCard = ({ anime }) => {
  return (
    <div className="anime-card">
      <Link to={`/anime/${anime.mal_id}`}>
        <div className="anime-card-image-container">
          <img src={anime.images.jpg.image_url} alt={anime.title} className="anime-card-image" />
        </div>
        <div className="anime-card-content">
          <h3 className="anime-card-title">{anime.title}</h3>
          <p className="anime-card-score">Score: {anime.score}</p>
        </div>
      </Link>
    </div>
  );
};

export default AnimeCard;
