import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Bar, Pie } from 'react-chartjs-2';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import 'react-tabs/style/react-tabs.css';
import './AnimeDetailsPage.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AnimeDetailsPage = () => {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [staff, setStaff] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [forums, setForums] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [bookmarkMessage, setBookmarkMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchAnimeDetails = useCallback(async () => {
    try {
      const animeResponse = await axios.get(`https://api.jikan.moe/v4/anime/${id}/full`);
      if (animeResponse.data && animeResponse.data.data) {
        setAnime(animeResponse.data.data);
      } else {
        throw new Error('Failed to fetch anime details.');
      }
  
      const charactersResponse = await axios.get(`https://api.jikan.moe/v4/anime/${id}/characters`);
      setCharacters(charactersResponse.data.data || []);
  
      const staffResponse = await axios.get(`https://api.jikan.moe/v4/anime/${id}/staff`);
      setStaff(staffResponse.data.data || []);
  
      const episodesResponse = await axios.get(`https://api.jikan.moe/v4/anime/${id}/episodes`);
      setEpisodes(episodesResponse.data.data || []);
  
      const forumsResponse = await axios.get(`https://api.jikan.moe/v4/anime/${id}/forum`);
      setForums(forumsResponse.data.data || []);
  
      const reviewsResponse = await axios.get(`https://api.jikan.moe/v4/anime/${id}/reviews`);
      setReviews(reviewsResponse.data.data || []);
  
      const statisticsResponse = await axios.get(`https://api.jikan.moe/v4/anime/${id}/statistics`);
      setStatistics(statisticsResponse.data.data || null);
  
      setError(null); // Clear any previous errors
    } catch (err) {
      if (err.response && err.response.status === 429) {
        if (retryCount < 3) {
          setRetryCount(retryCount + 1);
          setTimeout(() => {
            fetchAnimeDetails();
          }, 3000);
        } else {
          setError('Too many requests. Please wait a moment and try again.');
        }
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [id, retryCount]);

  useEffect(() => {
    fetchAnimeDetails();
  }, [fetchAnimeDetails]);

  /* Bookmark an anime */
  const handleBookmark = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setBookmarkMessage('Please log in to bookmark an anime.');
      return;
    }

    if (!anime) {
      setBookmarkMessage('Anime data is not available.');
      return;
    }
  
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/bookmarks/add`,
        {
          animeId: anime.mal_id,
          title: anime.title,
          imageUrl: anime.images.jpg.large_image_url,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      setBookmarkMessage('Anime bookmarked!');
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setBookmarkMessage(err.response.data.message);
      } else {
        setBookmarkMessage('Failed to bookmark anime. Please try again later.');
      }
    }
  };

  const handleCharacterClick = (characterId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to view character details.');
      return;
    }

    // If the user is authenticated, navigate to the character's details page
    window.location.href = `/character/${characterId}`;
  };

  if (loading) return <div className="status-message"><p>Loading...</p></div>;
  if (error) {
    if (retryCount < 3) {
      return <div className="status-message"><p>Something went wrong. Retrying...</p></div>;
    } else {
      return <div className="status-message"><p>{error}</p></div>;
    }
  }

    // Check if statistics is available before accessing it
    const watchingData = statistics ? {
      labels: ['Watching', 'Completed', 'On Hold', 'Dropped', 'Plan to Watch'],
      datasets: [
        {
          label: 'Number of Users',
          data: [
            statistics.watching,
            statistics.completed,
            statistics.on_hold,
            statistics.dropped,
            statistics.plan_to_watch,
          ],
          backgroundColor: ['#36A2EB', '#4BC0C0', '#FFCE56', '#FF6384', '#9966FF'],
          borderColor: '#2c3e50', // Consistent dark border
          borderWidth: 2, // Thicker borders for better visibility
          hoverBackgroundColor: ['#5AC8FA', '#76D7C4', '#FFD700', '#FF7F7F', '#C39BD3'], // Lighter colors on hover
          hoverBorderColor: '#f1c40f', // Bright yellow border on hover
        },
      ],
    } : null;

    const scoreDistributionData = statistics ? {
      labels: statistics.scores.map(score => `Score ${score.score}`),
      datasets: [
        {
          label: 'Votes',
          data: statistics.scores.map(score => score.votes),
          backgroundColor: '#FF6384',
          borderColor: '#2c3e50',
          borderWidth: 2,
          hoverBackgroundColor: '#FF7F7F',
          hoverBorderColor: '#f1c40f',
        },
      ],
    } : null;

    const scoreDistributionPieData = statistics ? {
      labels: statistics.scores.map(score => `Score ${score.score}`),
      datasets: [
        {
          data: statistics.scores.map(score => score.percentage),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
            '#FFCD56',
            '#C9CBCF',
            '#36A2EB',
            '#FF6384',
          ],
          borderColor: '#2c3e50',
          borderWidth: 2,
          hoverBackgroundColor: [
            '#FF7F7F',
            '#5AC8FA',
            '#FFD700',
            '#76D7C4',
            '#C39BD3',
            '#FFB347',
            '#FFD700',
            '#D3D3D3',
            '#5AC8FA',
            '#FF7F7F',
          ],
          hoverBorderColor: '#f1c40f',
        },
      ],
    } : null;


      // Function to truncate text to 3 sentences
  const truncateText = (text) => {
    const sentences = text.split('. ');
    if (sentences.length > 3) {
      return {
        truncated: sentences.slice(0, 3).join('. ') + '.',
        fullText: text,
      };
    }
    return { truncated: text, fullText: null };
  };

  const DetailsWithReadMore = ({ text }) => {
    const { truncated, fullText } = truncateText(text);
    const [isExpanded, setIsExpanded] = useState(false);

    if (!fullText) return <p>{text}</p>;

    return (
      <p>
        {isExpanded ? fullText : truncated}
        <span
          onClick={() => setIsExpanded(!isExpanded)}
          style={{ color: '#3498db', cursor: 'pointer', marginLeft: '5px' }}
        >
          {isExpanded ? 'Read Less' : 'Read More'}
        </span>
      </p>
    );
  };

  const ThemesWithReadMore = ({ label, themes }) => {
    const [isExpanded, setIsExpanded] = useState(false);
  
    if (!themes || themes.length === 0) return null;
  
    const truncatedThemes = themes.slice(0, 3).join(', ');
    const fullThemes = themes.join(', ');
  
    return (
      <p>
        <strong>{label}:</strong> {isExpanded ? fullThemes : truncatedThemes}
        {themes.length > 3 && (
          <span
            onClick={() => setIsExpanded(!isExpanded)}
            style={{ color: '#3498db', cursor: 'pointer', marginLeft: '5px' }}
          >
            {isExpanded ? 'Read Less' : 'Read More'}
          </span>
        )}
      </p>
    );
  };

    return (
<Container className="anime-details">
  <h1>{anime.title} ({anime.title_japanese})</h1>
  <Row>
    <Col md={4} className="image-section">
      <Card>
        <Card.Img src={anime.images.jpg.large_image_url} alt={anime.title} />
        <Card.Body>
          <Button onClick={handleBookmark} variant="primary">
            Bookmark
          </Button>
          {bookmarkMessage && <p className="bookmark-message mt-2">{bookmarkMessage}</p>}
        </Card.Body>
      </Card>
    </Col>
    <Col md={8}>
      <Tabs>
        <TabList>
          <Tab>Details</Tab>
          <Tab>Characters</Tab>
          <Tab>Staff</Tab>
          <Tab>Episodes</Tab>
          <Tab>Forum</Tab>
          <Tab>Reviews</Tab>
          <Tab>Statistics</Tab>
        </TabList>

        <TabPanel>
          <div className="info-section">
            <h3>Overview</h3>
            <p><strong>English Title:</strong> {anime.title_english}</p>
            <p><strong>Type:</strong> {anime.type}</p>
            <p><strong>Episodes:</strong> {anime.episodes}</p>
            <p><strong>Status:</strong> {anime.status}</p>
            <p><strong>Aired:</strong> {anime.aired?.string}</p>
            <p><strong>Duration:</strong> {anime.duration}</p>
            <p><strong>Rating:</strong> {anime.rating}</p>
            <p><strong>Score:</strong> {anime.score}</p>
            <p><strong>Rank:</strong> {anime.rank}</p>
            <p><strong>Popularity:</strong> {anime.popularity}</p>
            <p><strong>Members:</strong> {anime.members}</p>
            <p><strong>Favorites:</strong> {anime.favorites}</p>
            <p><strong>Synopsis:</strong> <DetailsWithReadMore text={anime.synopsis} /></p>
            <p><strong>Background:</strong> <DetailsWithReadMore text={anime.background} /></p>
            <p><strong>Season:</strong> {anime.season} {anime.year}</p>
            <p><strong>Broadcast:</strong> {anime.broadcast?.string}</p>
            <p><strong>Source:</strong> {anime.source}</p>
            <p><strong>Producers:</strong> {anime.producers?.map(producer => producer.name).join(', ')}</p>
            <p><strong>Licensors:</strong> {anime.licensors?.map(licensor => licensor.name).join(', ')}</p>
            <p><strong>Studios:</strong> {anime.studios?.map(studio => studio.name).join(', ')}</p>
            <p><strong>Genres:</strong> {anime.genres?.map(genre => genre.name).join(', ')}</p>
            <p><strong>Explicit Genres:</strong> {anime.explicit_genres?.map(genre => genre.name).join(', ')}</p>
            <p><strong>Themes:</strong> {anime.themes?.map(theme => theme.name).join(', ')}</p>
            <p><strong>Demographics:</strong> {anime.demographics?.map(demo => demo.name).join(', ')}</p>
            <ThemesWithReadMore label="Opening Themes" themes={anime.theme?.openings} />
            <ThemesWithReadMore label="Ending Themes" themes={anime.theme?.endings} />
            <p>
              <strong>External Links:</strong> 
              {anime.external?.map((link, index) => (
                <span key={link.name}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.name}
                  </a>
                  {index < anime.external.length - 1 ? ', ' : ''}
                </span>
              ))}
            </p>

            <p>
              <strong>Streaming Links:</strong> 
              {anime.streaming?.map((stream, index) => (
                <span key={stream.name}>
                  <a href={stream.url} target="_blank" rel="noopener noreferrer">
                    {stream.name}
                  </a>
                  {index < anime.streaming.length - 1 ? ', ' : ''}
                </span>
              ))}
            </p>
          </div>
          {anime.trailer?.embed_url && (
            <div className="trailer-section mt-4">
              <h3>Trailer</h3>
              <iframe
                src={`${anime.trailer.embed_url}?autoplay=0`}
                title={`${anime.title} Trailer`}
                width="100%"
                height="450"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </TabPanel>

    
              <TabPanel>
                <div className="characters-section">
                  <h3>Characters & Voice Actors</h3>
                  <Row>
                    {characters.length > 0 ? (
                      characters.map((character) => (
                        <Col md={3} key={character.character.mal_id}>
                          <Card className="character-item mb-3">
                            <div
                              onClick={() => handleCharacterClick(character.character.mal_id)}
                              style={{ cursor: 'pointer' }}
                            >
                              <Card.Img 
                                variant="top" 
                                src={character.character.images.jpg.image_url} 
                                className="character-details img" 
                              />
                              <Card.Body>
                                <Card.Title>{character.character.name} ({character.role})</Card.Title>
                                {character.voice_actors.map((actor) => (
                                  <div key={actor.person.mal_id} className="voice-actor-item">
                                    <img src={actor.person.images.jpg.image_url} alt={actor.person.name} />
                                    <p><strong>{actor.person.name}</strong> ({actor.language})</p>
                                  </div>
                                ))}
                              </Card.Body>
                            </div>
                          </Card>
                        </Col>
                      ))
                    ) : (
                      <p>No character information available.</p>
                    )}
                  </Row>
                </div>
              </TabPanel>


              <TabPanel>
                <div className="staff-section">
                  <h3>Staff</h3>
                  <Row>
                    {staff.length > 0 ? (
                      staff.map((staffMember) => (
                        <Col md={3} key={staffMember.person.mal_id}>
                          <Card className="staff-item mb-3">
                            <Card.Img
                              variant="top"
                              src={staffMember.person.images.jpg.image_url}
                              className="staff-details img"
                            />
                            <Card.Body>
                              <Card.Title>{staffMember.person.name}</Card.Title>
                              <Card.Text>{staffMember.positions.join(', ')}</Card.Text>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))
                    ) : (
                      <p>No staff information available.</p>
                    )}
                  </Row>
                </div>
              </TabPanel>

    
              <TabPanel>
                <div className="episodes-section">
                  <h3>Episodes</h3>
                  {episodes.length > 0 ? (
                    episodes.map((episode) => (
                      <Card key={episode.mal_id} className="episode-item mb-3">
                        <Card.Body>
                          <Card.Title>{episode.title} ({episode.title_japanese})</Card.Title>
                          <p><strong>Romanized Title:</strong> {episode.title_romanji}</p>
                          <p><strong>Duration:</strong> {episode.duration} minutes</p>
                          <p><strong>Aired:</strong> {episode.aired}</p>
                          {episode.filler && <Badge className="badge-warning">Filler</Badge>}
                          {episode.recap && <Badge className="badge-info">Recap</Badge>}
                          <p><strong>Discussion:</strong> <a href={episode.forum_url} target="_blank" rel="noopener noreferrer">Forum Link</a></p>
                        </Card.Body>
                      </Card>
                    ))
                  ) : (
                    <p>No episodes available.</p>
                  )}
                </div>
              </TabPanel>

    
              <TabPanel>
                <div className="forum-section">
                  <h3>Forum Discussions</h3>
                  {forums.length > 0 ? (
                    forums.map((forum) => (
                      <Card key={forum.mal_id} className="forum-item mb-3">
                        <Card.Body>
                          <Card.Title>
                            <a href={forum.url} target="_blank" rel="noopener noreferrer">
                              {forum.title}
                            </a>
                          </Card.Title>
                          <p><strong>Date:</strong> {new Date(forum.date).toLocaleString()}</p>
                          <p><strong>Author:</strong> <a href={forum.author_url} target="_blank" rel="noopener noreferrer">{forum.author_username}</a></p>
                          <p><strong>Comments:</strong> {forum.comments}</p>
                          {forum.last_comment && (
                            <div className="last-comment">
                              <p><strong>Last Comment by:</strong> <a href={forum.last_comment.author_url} target="_blank" rel="noopener noreferrer">{forum.last_comment.author_username}</a> on {new Date(forum.last_comment.date).toLocaleString()}</p>
                              <p><a href={forum.last_comment.url} target="_blank" rel="noopener noreferrer">Go to last comment</a></p>
                            </div>
                          )}
                        </Card.Body>
                      </Card>
                    ))
                  ) : (
                    <p>No forum discussions available.</p>
                  )}
                </div>
              </TabPanel>

    
              <TabPanel>
                <div className="reviews-section">
                  <h3>Reviews</h3>
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div key={review.mal_id} className="review-item">
                        <div className="review-user">
                          <img
                            src={review.user.images.jpg.image_url}
                            alt={review.user.username}
                            className="rounded-circle"
                          />
                          <a
                            href={review.user.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {review.user.username}
                          </a>
                        </div>
                        <div className="review-content">
                          <p>
                            <strong>Date:</strong>{" "}
                            {new Date(review.date).toLocaleString()}
                          </p>
                          <p>
                            <strong>Score:</strong>{" "}
                            <Badge bg="success">{review.score}</Badge>
                          </p>
                          {review.is_spoiler && (
                            <Badge bg="danger">Contains Spoilers</Badge>
                          )}
                          {review.is_preliminary && (
                            <Badge bg="secondary">Preliminary Review</Badge>
                          )}
                          <DetailsWithReadMore text={review.review} />
                          <p>
                            <strong>Episodes Watched:</strong> {review.episodes_watched}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No reviews available.</p>
                  )}
                </div>
              </TabPanel>
    
              <TabPanel>
                <div className="statistics-section">
                  <h3>Statistics</h3>
                  {statistics ? (
                    <div>
                      <h4>User Watching Status</h4>
                      <div className="chart-container">
                        <Bar data={watchingData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                      </div>
                      <h4>Score Distribution</h4>
                      <div className="chart-container">
                        <Bar data={scoreDistributionData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                      </div>
                      <h4>Score Distribution (Percentage)</h4>
                      <div className="chart-container">
                        <Pie data={scoreDistributionPieData} options={{ responsive: true }} />
                      </div>
                    </div>
                  ) : (
                    <p>No statistics available.</p>
                  )}
                </div>
              </TabPanel>
            </Tabs>
          </Col>
        </Row>
      </Container>
    ); 
  };   

export default AnimeDetailsPage;