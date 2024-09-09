import { useState, useEffect } from 'react';
import { getTopAnime } from '../api/animeApi';

const useFetchTopAnime = () => {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTopAnime();
        setAnimeList(response.data.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { animeList, loading, error };
};

export default useFetchTopAnime;
