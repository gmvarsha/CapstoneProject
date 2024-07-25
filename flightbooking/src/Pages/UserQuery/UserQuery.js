import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import CustomNavbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import './UserQuery.css';


const faqs = [
  { question: 'How to book a flight?', answer: 'You can book a flight by searching for available flights, selecting your preferred flight, and following the booking instructions.' },
  { question: 'Do I need to confirm my flight reservation before I fly?', answer: 'No, you don’t. If you really want to, though, you can by writing to our Admin.' },
  { question: 'Is it possible to book tickets for another person through my account?', answer: 'Yes, just enter the details of the passengers you want to book for when you’re asked to enter traveller–details at the time of booking.' },
  { question: 'How do I get a boarding pass for an e–ticket?', answer: 'You need to show your e–ticket confirmation email and your e–ticket number at the check–in counter. The airline representative will issue your boarding pass at that time.' },
  { question: 'I’ve booked my tickets but need to add my child’s tickets to my booking. How do I do it?', answer: 'Unfortunately, a child cannot be added to an existing reservation. You will need to book a separate ticket for your child with the airline directly.' },
  { question: 'I misspelled my name while booking a ticket. How do I get it changed?', answer: 'You can call us to check if the airline you’ve booked with entertains change–of–name requests. Most of them do, and we can pass on your request. However, if the airline doesn’t allow it, you’ll have to cancel and re–book the ticket.' },
  { question: 'Do I have to show ID proof at the time of check–in?', answer: 'Yes, for domestic flights within India, Any ID Prrofs are required by government issued photo-ids accepted by the airlines –' },
];

const UserQuery = () => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [userId, setUserId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
      }, 2000); // 2 seconds

      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleNavigate = () => {
    navigate('/user/userbooking');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/user/query', { query, userId });
      setQuery('');
      setSuccess(true);
      setError(null);
    } catch (error) {
      setError('Error submitting query');
      setSuccess(false);
      console.error('Error submitting query', error);
    }
  };

  const containerStyle = {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  };

  const assistanceStyle = {
    backgroundColor: '#f0f8ff',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
  };

  return (
    <div style={{
      background: 'linear-gradient(to bottom right, #f7c6c5, #fff)',
      minHeight: '100vh',
      color: '#000',
    }}>
      <CustomNavbar role='User' />

      <h1 className="userQuery-header">Flight Booking Support</h1>

      <div style={containerStyle}>
        <div style={assistanceStyle}>
          <h3 className="text-center mt-5 mb-4">How can we assist you today?</h3>
          <div className="text-center mb-4">
            <Button variant="primary" onClick={() => setShowModal(true)}>Ask me a question</Button>
          </div>
        </div>

        <h3 className="text-center mt-5 mb-4">Frequently Asked Questions</h3>
        <div id="faqAccordion">
          {faqs.map((faq, index) => (
            <div className="card mb-3" key={index}>
              <div className="card-header" id={`heading${index}`}>
                <h5 className="mb-0">
                  <button
                    className="btn btn-link"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse${index}`}
                    aria-expanded="false"
                    aria-controls={`collapse${index}`}
                    style={{ textAlign: 'left', border: 'none', color: '#007bff' }}
                  >
                    {faq.question}
                  </button>
                </h5>
              </div>
              <div
                id={`collapse${index}`}
                className="collapse"
                aria-labelledby={`heading${index}`}
                data-bs-parent="#faqAccordion"
              >
                <div className="card-body" style={{ padding: '10px' }}>
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Button variant="primary" onClick={handleNavigate}>Go to Flights Booking Page</Button>
        </div>
      </div>

      <footer className="userQuery-footer">
        <p>&copy; 2024 SwayAirApp. All rights reserved.</p>
      </footer>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ask A Question?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {success && <div className="alert alert-success">Query submitted successfully. You will get response with in 24 hrs!</div>}
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="query">Your Query</label>
              <textarea
                id="query"
                className="form-control"
                value={query}
                onChange={handleQueryChange}
                rows="5"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary mt-3">Submit</button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UserQuery;
