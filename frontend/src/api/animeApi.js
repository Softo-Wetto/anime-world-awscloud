import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.jikan.moe/v4',
});

// Handle 429 status code for rate limiting
apiClient.interceptors.response.use(null, async (error) => {
  const { config, response: { status } } = error;
  if (status === 429) {
    const retryAfter = parseInt(error.response.headers['retry-after'], 10) || 1;
    await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
    return apiClient(config);
  }
  return Promise.reject(error);
});

// Updated function to support pagination
export const getTopAnimeByFilter = (filter, page = 1) => {
  return apiClient.get(`/top/anime`, {
    params: {
      filter,
      page
    }
  });
};
