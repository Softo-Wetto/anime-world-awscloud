import React from 'react';
import { Link } from 'react-router-dom';
import useFetchTopAnimeByFilter from '../hooks/useFetchTopAnimeByFilter';
import AnimeCard from '../components/AnimeCard';
import './HomePage.css';

const HomePage = () => {
  const { airing, upcoming, byPopularity, favorites, loading, error } = useFetchTopAnimeByFilter();

  if (loading) return <div className="status-message"><p>Loading...</p></div>;
  if (error) return <div className="status-message"><p>Error loading data: {error.message}</p></div>;

  const limit = 6;

  return (
    <div className="container anime-list-container">
      <WelcomeBanner />

      <section>
        <div className="section-header">
          <h2>Top Airing Anime</h2>
          <Link to="/airing" className="btn btn-primary view-all-button">View All</Link>
        </div>
        <div className="row justify-content-center">
          {airing.slice(0, limit).map((anime) => (
            <div key={anime.mal_id} className="col-lg-2 col-md-4 col-sm-6 mb-4 d-flex">
              <AnimeCard anime={anime} />
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="section-header">
          <h2>Upcoming Anime</h2>
          <Link to="/upcoming" className="btn btn-primary view-all-button">View All</Link>
        </div>
        <div className="row justify-content-center">
          {upcoming.slice(0, limit).map((anime) => (
            <div key={anime.mal_id} className="col-lg-2 col-md-4 col-sm-6 mb-4 d-flex">
              <AnimeCard anime={anime} />
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="section-header">
          <h2>Popular Anime</h2>
          <Link to="/popular" className="btn btn-primary view-all-button">View All</Link>
        </div>
        <div className="row justify-content-center">
          {byPopularity.slice(0, limit).map((anime) => (
            <div key={anime.mal_id} className="col-lg-2 col-md-4 col-sm-6 mb-4 d-flex">
              <AnimeCard anime={anime} />
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="section-header">
          <h2>Favorite Anime</h2>
          <Link to="/favorite" className="btn btn-primary view-all-button">View All</Link>
        </div>
        <div className="row justify-content-center">
          {favorites.slice(0, limit).map((anime) => (
            <div key={anime.mal_id} className="col-lg-2 col-md-4 col-sm-6 mb-4 d-flex">
              <AnimeCard anime={anime} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const WelcomeBanner = () => {
  return (
    <div className="welcome-banner">
      <div className="welcome-content">
        <h1>Welcome to Anime World</h1>
        <p>Your one-stop destination to discover the best anime.</p>
        <Link to="/popular" className="btn btn-primary explore-button">Explore Top Anime</Link>
      </div>
    </div>
  );
};

export default HomePage;
