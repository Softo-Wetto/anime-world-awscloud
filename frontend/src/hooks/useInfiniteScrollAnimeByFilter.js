import { useState, useEffect } from 'react';
import { getTopAnimeByFilter } from '../api/animeApi';

const useInfiniteScrollAnimeByFilter = (filter) => {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const response = await getTopAnimeByFilter(filter, page);
        setAnimeList(prevList => [...prevList, ...response.data.data]);
        setHasMore(response.data.pagination.has_next_page);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, [filter, page]);

  const loadMore = () => {
    if (hasMore && !loading) {
      setPage(prevPage => prevPage + 1);
    }
  };

  return { animeList, loading, error, loadMore, hasMore };
};

export default useInfiniteScrollAnimeByFilter;
