import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './CharacterDetailsPage.css';

const CharacterDetailsPage = () => {
    const { id } = useParams();
    const [character, setCharacter] = useState(null);
    const [resolution, setResolution] = useState('3840x2160');
    const [format, setFormat] = useState('jpg');
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [effects, setEffects] = useState([]);
    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [saturation, setSaturation] = useState(100);
    const [imageCount, setImageCount] = useState(1);
    const [downloadInProgress, setDownloadInProgress] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);

    useEffect(() => {
        const fetchCharacterDetails = async () => {
            try {
                const response = await axios.get(`https://api.jikan.moe/v4/characters/${id}`);
                setCharacter(response.data.data);
                setError(null);
            } catch (err) {
                setError('Failed to load character details');
            } finally {
                setLoading(false);
            }
        };

        const checkIfFavorite = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/favorites`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const favorites = response.data;
                setIsFavorite(favorites.some(fav => fav.characterId === parseInt(id)));
            } catch (err) {
                console.error('Failed to check if character is favorite:', err);
            }
        };

        fetchCharacterDetails();
        checkIfFavorite();
    }, [id]);

    const handleFavoriteToggle = async () => {
        if (!character) {
            setError('Character data not available');
            return;
        }
    
        try {
            const token = localStorage.getItem('token');
            if (isFavorite) {
                await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/favorites/remove/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setIsFavorite(false);
            } else {
                await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/favorites/add`, {
                    characterId: id,
                    characterName: character.name,
                    imageUrl: character.images.jpg.image_url,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setIsFavorite(true);
            }
        } catch (err) {
            console.error('Error toggling favorite:', err);
            setError('Failed to update favorite status. Please try again later.');
        }
    };

    const handleEffectChange = (e) => {
        const value = e.target.value;
        setEffects((prev) => {
            if (prev.includes(value)) {
                return prev.filter((effect) => effect !== value);
            } else {
                return [...prev, value];
            }
        });
    };

    const handleDownload = async () => {
        setDownloadInProgress(true);
        setError('');
        setDownloadProgress(0);

        if (!character) {
            setError('Character data not available');
            setDownloadInProgress(false);
            return;
        }

        const imageUrl = character.images.jpg.image_url;

        try {
            const token = localStorage.getItem('token');

            for (let i = 1; i <= imageCount; i++) {
                const response = await axios.post(
                    `${process.env.REACT_APP_API_BASE_URL}/api/image/download`,
                    {
                        url: imageUrl,
                        resolution,
                        format,
                        effects, 
                        brightness,
                        contrast,
                        saturation,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        responseType: 'blob',
                        onDownloadProgress: progressEvent => {
                            const total = progressEvent.total || 1;
                            setDownloadProgress(Math.round((progressEvent.loaded / total) * 100));
                        }
                    }
                );

                const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.setAttribute('download', `character_${i}_${character.name}.${format}`);
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
            }
        } catch (err) {
            console.error('Error during download:', err);
            setError('Failed to download image(s). Please try again later.');
        } finally {
            setDownloadInProgress(false);
            setDownloadProgress(0);
        }
    };

    if (loading) return <div className="status-message"><p>Loading...</p></div>;
    if (error && !downloadInProgress) return <p>{error}</p>;

    return (
        <div className="character-details-page">
            <h2>{character.name}</h2>
            <img src={character.images.jpg.image_url} alt={character.name} />
            <button onClick={handleFavoriteToggle} className="btn btn-warning">
                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
            <div className="form-group">
                <label>Resolution:</label>
                <select value={resolution} onChange={(e) => setResolution(e.target.value)}>
                    <option value="3840x2160">4K (3840x2160)</option>
                    <option value="1920x1080">1080p (1920x1080)</option>
                    <option value="1280x720">720p (1280x720)</option>
                    <option value="640x480">480p (640x480)</option>
                </select>
            </div>
            <div className="form-group">
                <label>Format:</label>
                <select value={format} onChange={(e) => setFormat(e.target.value)}>
                    <option value="jpg">JPG</option>
                    <option value="png">PNG</option>
                    <option value="webp">WEBP</option>
                </select>
            </div>
            <div className="form-group">
                <label>Effects:</label>
                <div className="effect-checkbox-group">
                    <input
                    type="checkbox"
                    id="grayscale"
                    value="grayscale"
                    checked={effects.includes('grayscale')}
                    onChange={handleEffectChange}
                    />
                    <label htmlFor="grayscale">Grayscale</label>

                    <input
                    type="checkbox"
                    id="blur"
                    value="blur"
                    checked={effects.includes('blur')}
                    onChange={handleEffectChange}
                    />
                    <label htmlFor="blur">Blur</label>

                    <input
                    type="checkbox"
                    id="rotate"
                    value="rotate"
                    checked={effects.includes('rotate')}
                    onChange={handleEffectChange}
                    />
                    <label htmlFor="rotate">Rotate 90°</label>

                    <input
                    type="checkbox"
                    id="invert"
                    value="invert"
                    checked={effects.includes('invert')}
                    onChange={handleEffectChange}
                    />
                    <label htmlFor="invert">Invert Colors</label>

                    <input
                    type="checkbox"
                    id="sepia"
                    value="sepia"
                    checked={effects.includes('sepia')}
                    onChange={handleEffectChange}
                    />
                    <label htmlFor="sepia">Sepia</label>
                </div>
            </div>
            <div className="form-group">
                <label>Brightness:</label>
                <input
                    type="range"
                    min="0"
                    max="200"
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                />
                <span>{brightness}%</span>
            </div>
            <div className="form-group">
                <label>Contrast:</label>
                <input
                    type="range"
                    min="0"
                    max="200"
                    value={contrast}
                    onChange={(e) => setContrast(Number(e.target.value))}
                />
                <span>{contrast}%</span>
            </div>
            <div className="form-group">
                <label>Saturation:</label>
                <input
                    type="range"
                    min="0"
                    max="200"
                    value={saturation}
                    onChange={(e) => setSaturation(Number(e.target.value))}
                />
                <span>{saturation}%</span>
            </div>
            <div className="form-group">
                <label>Number of Images:</label>
                <input
                    type="number"
                    min="1"
                    value={imageCount}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d+$/.test(value) && Number(value) >= 1) {
                            setImageCount(Number(value));
                        } else if (value === '') {
                            setImageCount('');
                        }
                    }}
                />
            </div>
            <button onClick={handleDownload} className="btn btn-warning">
                Download Image{imageCount > 1 && 's'}
            </button>
            {downloadInProgress && <p>Download Progress: {downloadProgress}%</p>}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default CharacterDetailsPage;
