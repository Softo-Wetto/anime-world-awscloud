import React, { useState } from 'react';
import { Accordion, Button, Form } from 'react-bootstrap';
import './AboutPage.css';

const AboutPage = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactForm({ ...contactForm, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(contactForm);
    alert('Your message has been sent!');
  };

  return (
    <div className="about-page">
      <WelcomeBanner />
      <h1 className="fade-in">About Anime World</h1>
      <div className="about-content">
        <p className="fade-in">Welcome to Anime World, your ultimate destination for discovering the best anime from all genres and styles. Whether you're a seasoned anime fan or new to the world of anime, our website offers a comprehensive and easy-to-navigate platform for exploring top-rated, popular, and upcoming anime series and movies.</p>

        <Accordion defaultActiveKey="0" className="fade-in">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Our Mission</Accordion.Header>
            <Accordion.Body>
              At Anime World, our mission is to create a community-driven platform where anime enthusiasts can find and share their favorite shows, discover new series, and stay up-to-date with the latest anime news and trends. We strive to provide accurate, up-to-date information and user-friendly features that make your anime-watching experience more enjoyable.
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="1">
            <Accordion.Header>What We Offer</Accordion.Header>
            <Accordion.Body>
              <ul>
                <li><strong>Comprehensive Anime Database:</strong> Explore detailed information about thousands of anime series, movies, and OVA specials.</li>
                <li><strong>Personalized Recommendations:</strong> Get anime suggestions based on your viewing history and preferences.</li>
                <li><strong>Top Anime Lists:</strong> Browse our curated lists of top airing, upcoming, popular, and favorite anime.</li>
                <li><strong>Community Reviews:</strong> Read reviews and ratings from fellow anime fans and share your own thoughts on your favorite shows.</li>
                <li><strong>Latest News and Updates:</strong> Stay informed about the latest anime releases, events, and industry news.</li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="2">
            <Accordion.Header>Join Our Community</Accordion.Header>
            <Accordion.Body>
              Anime World is more than just a website; it's a community of passionate anime fans. Join us on our journey to celebrate the world of anime, connect with other fans, and discover the stories that inspire and entertain millions around the globe.
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="3">
            <Accordion.Header>Contact Us</Accordion.Header>
            <Accordion.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    name="name"
                    value={contactForm.name}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formMessage">
                  <Form.Label>Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Write your message"
                    name="message"
                    value={contactForm.message}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Button variant="warning" type="submit">
                  Send Message
                </Button>
              </Form>
              <p>Email: support@animeworld.com</p>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </div>
  );
};

const WelcomeBanner = () => {
  return (
    <div className="welcome-banner about-banner">
      <div className="welcome-content">
        <h1>Discover and Realise</h1>
        <p>Discover the magic of anime with our comprehensive platform.</p>
      </div>
    </div>
  );
};

export default AboutPage;
