import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer bg-dark text-light py-5">
      <Container>
        <Row>
          <Col md={4} className="mb-4">
            <h4 className="text-warning">About Us</h4>
            <p>
              Anime World is your go-to destination for exploring the best in anime. From top-rated series to the latest releases, we bring you the world of anime in one place.
            </p>
          </Col>
          <Col md={4} className="mb-4">
            <h4 className="text-warning">Quick Links</h4>
            <ul className="list-unstyled">
              <li><a href="/" className="text-light">Home</a></li>
              <li><a href="/search" className="text-light">Search</a></li>
              <li><a href="/about" className="text-light">About</a></li>
            </ul>
          </Col>
          <Col md={4} className="mb-4">
            <h4 className="text-warning">Contact Us</h4>
            <p><strong>Email:</strong> support@animeworld.com</p>
            <p><strong>Phone:</strong> +123 456 7890</p>
            <div className="social-icons mt-3">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-light me-3"><i className="fab fa-facebook fa-2x"></i></a>
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="text-light me-3"><i className="fab fa-twitter fa-2x"></i></a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-light me-3"><i className="fab fa-instagram fa-2x"></i></a>
            </div>
          </Col>
        </Row>
        <Row className="footer-bottom mt-4">
          <Col className="text-center">
            <p>&copy; 2024 Anime World. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
