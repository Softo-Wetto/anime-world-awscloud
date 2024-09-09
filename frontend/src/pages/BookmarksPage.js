import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './BookmarksPage.css'; // Add CSS for better styling

const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookmarks = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/bookmarks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBookmarks(response.data);
      } catch (err) {
        setError('Failed to fetch bookmarks. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  const removeBookmark = async (animeId) => {
    const token = localStorage.getItem('token');

    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/bookmarks/remove/${animeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBookmarks(bookmarks.filter((bookmark) => bookmark.animeId !== animeId));
    } catch (err) {
      console.error('Failed to remove bookmark:', err);
      setError('Failed to remove bookmark. Please try again later.');
    }
  };

  if (loading) return <div className="status-message"><p>Loading...</p></div>;
  if (error) return <div className="status-message"><p>Error loading data: {error.message}</p></div>;

  return (
    <div className="bookmarks-page">
      <h1>My Bookmarks</h1>
      {bookmarks.length === 0 ? (
        <p>No bookmarks yet.</p>
      ) : (
        <div className="bookmark-list">
          {bookmarks.map((bookmark) => (
            <div key={bookmark.animeId} className="bookmark-item card">
              <Link to={`/anime/${bookmark.animeId}`} className="bookmark-link">
                <img src={bookmark.imageUrl} alt={bookmark.title} className="bookmark-image card-img-top" />
                <div className="card-body">
                  <p className="card-title">{bookmark.title}</p>
                </div>
              </Link>
              <button
                className="remove-bookmark-button btn btn-danger"
                onClick={() => removeBookmark(bookmark.animeId)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarksPage;
