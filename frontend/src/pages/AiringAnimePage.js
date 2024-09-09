import React, { useEffect, useCallback } from 'react';
import useInfiniteScrollAnimeByFilter from '../hooks/useInfiniteScrollAnimeByFilter';
import AnimeCard from '../components/AnimeCard';
import BackToTop from '../components/BackToTop';
import './TopAnimePages.css';

const AiringAnimePage = () => {
  const { animeList, loading, error, loadMore, hasMore } = useInfiniteScrollAnimeByFilter('airing');

  const handleLoadMore = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight && hasMore) {
      loadMore();
    }
  }, [hasMore, loadMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleLoadMore);
    return () => window.removeEventListener('scroll', handleLoadMore);
  }, [handleLoadMore]);

  if (error) return <p>Error loading data: {error.message}</p>;

  return (
    <div className="anime-list-page">
      <h2>Top Airing Anime</h2>
      <div className="anime-list">
        {animeList.map((anime) => (
          <AnimeCard key={anime.mal_id} anime={anime} className="anime-card" />
        ))}
      </div>
      {loading && <p>Loading more anime...</p>}
      <BackToTop />
    </div>
  );
};

export default AiringAnimePage;
