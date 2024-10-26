import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AnimeDetailsPage from './pages/AnimeDetailsPage';
import AiringAnimePage from './pages/AiringAnimePage';
import UpcomingAnimePage from './pages/UpcomingAnimePage';
import PopularAnimePage from './pages/PopularAnimePage';
import FavoriteAnimePage from './pages/FavoriteAnimePage';
import SearchPage from './pages/SearchPage';
import AboutPage from './pages/AboutPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import BookmarksPage from './pages/BookmarksPage';
import FavoriteCharactersPage from './pages/FavoriteCharactersPage';
import CharacterDetailsPage from './pages/CharacterDetailsPage';
import UploadImagePage from './pages/UploadImagePage';
import VerificationPage from './pages/VerificationPage';
import ContactPage from './pages/ContactPage';
import Header from './components/Header';
import Footer from './components/Footer';
import { sendMessage } from './components/chatbot_interaction_handler';
import './App.css';

function App() {
    const [showChatbot, setShowChatbot] = useState(false);

    // Toggle chatbot display using the state
    const handleToggleChatbot = () => {
        setShowChatbot(!showChatbot);
    };

    return (
        <div className="App">
            <Router>
                <Header />
                <main>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/anime/:id" element={<AnimeDetailsPage />} />
                        <Route path="/character/:id" element={<CharacterDetailsPage />} />
                        <Route path="/favorites" element={<FavoriteCharactersPage />} />
                        <Route path="/airing" element={<AiringAnimePage />} />
                        <Route path="/upcoming" element={<UpcomingAnimePage />} />
                        <Route path="/popular" element={<PopularAnimePage />} />
                        <Route path="/favorite" element={<FavoriteAnimePage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/verify" element={<VerificationPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/bookmarks" element={<BookmarksPage />} />
                        <Route path="/upload-image" element={<UploadImagePage />} />
                        <Route path="/contact" element={<ContactPage />} />
                    </Routes>
                </main>
                <Footer />
            </Router>

            {/* Chatbot Icon */}
            <div id="chatbot-icon" onClick={handleToggleChatbot}>
                💬
            </div>

            {/* Chatbot Container */}
            {showChatbot && (
                <div id="chatbot-container" style={{ display: 'block' }}>
                    <div id="chatbot-header">
                        <span>Anime Chatbot</span>
                        <button onClick={handleToggleChatbot}>X</button>
                    </div>
                    <div id="chatbot-body">
                        <div id="chatbot-messages"></div>
                        <input type="text" id="user-input" placeholder="Ask me anything..." />
                        <button onClick={sendMessage}>Send</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
