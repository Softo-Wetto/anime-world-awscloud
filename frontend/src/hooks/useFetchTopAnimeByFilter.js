import { useState, useEffect } from 'react';
import { getTopAnimeByFilter } from '../api/animeApi';

const useFetchTopAnimeByFilter = () => {
  const [airing, setAiring] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [byPopularity, setByPopularity] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [airingData, upcomingData, byPopularityData, favoritesData] = await Promise.all([
          getTopAnimeByFilter('airing'),
          getTopAnimeByFilter('upcoming'),
          getTopAnimeByFilter('bypopularity'),
          getTopAnimeByFilter('favorite'),
        ]);

        setAiring(airingData.data.data);
        setUpcoming(upcomingData.data.data);
        setByPopularity(byPopularityData.data.data);
        setFavorites(favoritesData.data.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { airing, upcoming, byPopularity, favorites, loading, error };
};

export default useFetchTopAnimeByFilter;
