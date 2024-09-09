import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './FavoriteCharactersPage.css';

const FavoriteCharactersPage = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/favorites`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setFavorites(response.data);
            } catch (err) {
                setError('Failed to load favorite characters');
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    if (loading) return <div className="status-message"><p>Loading...</p></div>;
    if (error) return <div className="status-message"><p>Error loading data: {error.message}</p></div>;

    return (
        <div className="favorite-characters-page">
            <h1>Your Favorite Characters</h1>
            <div className="favorite-list">
                {favorites.length > 0 ? (
                    favorites.map(fav => (
                        <div key={fav.id} className="favorite-item card">
                            <Link to={`/character/${fav.characterId}`} className="favorite-link">
                                <img src={fav.imageUrl} alt={fav.characterName} className="favorite-image" />
                                <h3>{fav.characterName}</h3>
                            </Link>
                        </div>
                    ))
                ) : (
                    <p>No favorite characters added yet.</p>
                )}
            </div>
        </div>
    );
};

export default FavoriteCharactersPage;
