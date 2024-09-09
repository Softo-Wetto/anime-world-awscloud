import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import AnimeCard from '../components/AnimeCard';
import './SearchPage.css';

const SearchPage = () => {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    rating: '',
    genre: '',
    start_year: '',
    end_year: '',
  });

  // Function to sanitize the query by removing spaces and special characters
  const sanitizeString = (str) => {
    return str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  };

  const fetchAnime = useCallback(async () => {
    setLoading(true);
    try {
      const sanitizedQuery = sanitizeString(query); // Sanitize the query

      // Construct start and end date strings if valid years are provided
      const startDate = filters.start_year ? `${filters.start_year}-01-01` : '';
      const endDate = filters.end_year ? `${filters.end_year}-12-31` : '';

      const response = await axios.get('https://api.jikan.moe/v4/anime', {
        params: {
          q: query, // Use the original query for the API call
          type: filters.type,
          status: filters.status,
          rating: filters.rating,
          genres: filters.genre,
          start_date: startDate,
          end_date: endDate,
          page: 1,
          limit: 25, // Limit results to 25
        },
      });

      // Filter results based on the sanitized query match
      const filteredResults = response.data.data.filter((anime) =>
        sanitizeString(anime.title).includes(sanitizedQuery)
      );

      setAnimeList(filteredResults);
      setError(null); // Reset error on successful fetch
    } catch (err) {
      if (err.response && err.response.status === 429) {
        console.error('Rate limit exceeded:', err.message); // Log the 429 error to console
      } else if (err.response && err.response.status === 400) {
        console.error('Bad request:', err.message); // Log the 400 error to console
        setError('Invalid date range or other input. Please check your filters.');
      } else {
        setError(err.message); // Display other errors
      }
    } finally {
      setLoading(false);
    }
  }, [query, filters]);

  useEffect(() => {
    fetchAnime();
  }, [fetchAnime]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="search-page">
      <h2>Search Anime</h2>
      <form className="search-form">
        <input
          type="text"
          className="search-input"
          placeholder="Search anime..."
          value={query}
          onChange={handleInputChange}
        />
        <div className="filter-container">
          <select name="type" className="filter-select" value={filters.type} onChange={handleFilterChange}>
            <option value="">All Types</option>
            <option value="tv">TV</option>
            <option value="movie">Movie</option>
            <option value="ova">OVA</option>
            <option value="special">Special</option>
            <option value="ona">ONA</option>
            <option value="music">Music</option>
          </select>
          <select name="status" className="filter-select" value={filters.status} onChange={handleFilterChange}>
            <option value="">All Statuses</option>
            <option value="airing">Airing</option>
            <option value="complete">Complete</option>
            <option value="upcoming">Upcoming</option>
          </select>
          <select name="rating" className="filter-select" value={filters.rating} onChange={handleFilterChange}>
            <option value="">All Ratings</option>
            <option value="g">G - All Ages</option>
            <option value="pg">PG - Children</option>
            <option value="pg13">PG-13 - Teens 13 or older</option>
            <option value="r17">R - 17+ (violence & profanity)</option>
            <option value="r">R+ - Mild Nudity</option>
            <option value="rx">Rx - Hentai</option>
          </select>
          <select name="genre" className="filter-select" value={filters.genre} onChange={handleFilterChange}>
            <option value="">All Genres</option>
            <option value="1">Action</option>
            <option value="2">Adventure</option>
            <option value="4">Comedy</option>
            <option value="8">Drama</option>
            <option value="10">Fantasy</option>
            <option value="14">Horror</option>
            <option value="22">Romance</option>
            <option value="24">Sci-Fi</option>
            <option value="36">Slice of Life</option>
            <option value="37">Supernatural</option>
            <option value="38">Thriller</option>
          </select>
          <input
            type="number"
            name="start_year"
            className="filter-input"
            placeholder="Start Year"
            value={filters.start_year}
            onChange={handleFilterChange}
          />
          <input
            type="number"
            name="end_year"
            className="filter-input"
            placeholder="End Year"
            value={filters.end_year}
            onChange={handleFilterChange}
          />
        </div>
      </form>

      {loading && <p className="loading-text">Loading...</p>}
      {error && <p className="error-text">Error: {error}</p>}
      {!loading && animeList.length === 0 && <p className="no-results-text">No anime found.</p>}
      <div className="anime-list">
        {animeList.map((anime) => (
          <AnimeCard key={anime.mal_id} anime={anime} />
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
