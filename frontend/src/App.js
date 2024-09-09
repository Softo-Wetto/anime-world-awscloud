import React from 'react';
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

import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';

function App() {
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
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/bookmarks" element={<BookmarksPage />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
