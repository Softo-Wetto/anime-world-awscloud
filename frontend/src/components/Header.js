import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import { Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="header">
      <div className="container-fluid">
        <Navbar.Brand as={Link} to="/" className="text-warning brand-font">
          AnimeWorld
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto nav-links">
            <Nav.Link as={Link} to="/" className="text-warning nav-item">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/search" className="text-warning nav-item">
              Search
            </Nav.Link>
            <Nav.Link as={Link} to="/about" className="text-warning nav-item">
              About
            </Nav.Link>
          </Nav>
          <Nav className="ml-auto">
            {isLoggedIn ? (
              <NavDropdown title={username} id="basic-nav-dropdown" className="text-warning">
                <NavDropdown.Item as={Link} to="/profile">My Profile</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/bookmarks">Bookmarks</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/favorites">Favorite Characters</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Button} onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="text-warning nav-item">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register" className="text-warning nav-item">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default Header;
