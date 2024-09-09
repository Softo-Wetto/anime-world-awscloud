import React, { useEffect, useCallback } from 'react';
import useFetchTopAnimeByFilter from '../hooks/useInfiniteScrollAnimeByFilter';
import AnimeCard from '../components/AnimeCard';
import BackToTop from '../components/BackToTop';
import './TopAnimePages.css';

const FavoriteAnimePage = () => {
  const { animeList, loading, error, loadMore, hasMore } = useFetchTopAnimeByFilter('favorite');

  // Memoize handleScroll to prevent unnecessary re-renders
  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight && hasMore) {
      loadMore();
    }
  }, [hasMore, loadMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (error) return <p>Error loading data: {error.message}</p>;

  return (
    <div className="anime-list-page">
      <h2>Favorite Anime</h2>
      <div className="anime-list">
        {animeList.map((anime) => (
          <AnimeCard key={anime.mal_id} anime={anime} />
        ))}
      </div>
      {loading && <p>Loading more anime...</p>}
      <BackToTop />
    </div>
  );
};

export default FavoriteAnimePage;
