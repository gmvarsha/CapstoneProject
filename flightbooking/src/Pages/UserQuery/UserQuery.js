import React, { useState,useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './UserQuery.css';
import CustomNavbar from '../../components/Navbar';


const faqs = [
  { question: 'How to book a flight?', answer: 'You can book a flight by searching for available flights, selecting your preferred flight, and following the booking instructions.' },
  { question: 'Do I need to confirm my flight reservation before I fly?', answer:'No, you don’t. If you really want to, though, you can by writing to our Admin.' },
  { question: 'Is it possible to book tickets for another person through my account?', answer:'Yes, just enter the details of the passengers you want to book for when you’re asked to enter traveller–details at the time of booking.' },
  { question: 'How do I get a boarding pass for an e–ticket?', answer:'You need to show your e–ticket confirmation email and your e–ticket number at the check–in counter. The airline representative will issue your boarding pass at that time.' },
  { question: 'I’ve booked my tickets but need to add my child’s tickets to my booking. How do I do it?', answer:'Unfortunately, a child cannot be added to an existing reservation. You will need to book a separate ticket for your child with the airline directly.' },
  { question: 'I misspelled my name while booking a ticket. How do I get it changed?', answer:'You can call us to check if the airline you’ve booked with entertains change–of–name requests. Most of them do, and we can pass on your request. However, if the airline doesn’t allow it, you’ll have to cancel and re–book the ticket.' },
  { question: 'Do I have to show ID proof at the time of check–in?', answer:'Yes, for domestic flights within India, Any ID Prrofs are required by government issued photo-ids accepted by the airlines –' },

];

const UserQuery = () => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [userId, setUserId] = useState('');


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
      }, 1000); // 1 seconds

      return () => clearTimeout(timer);
    }
  }, [success]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await axios.post('http://localhost:8080/api/user/query', { query,userId });
      setQuery('');
      setSuccess(true);
      setError(null);
    } catch (error) {
      setError('Error submitting query');
      setSuccess(false);
      console.error('Error submitting query', error);
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(to bottom right, #f7c6c5, #fff)',
      minHeight: '100vh',
      color: '#000',
    }}>    
      <CustomNavbar role='User' />
      
        <h1 className="userQuery-header">Flight Booking Support</h1>

      <div className="userQueryContainer mt-5">
        <div className="userQueryCard p-4 shadow-sm mb-5">
          <h2 className="text-center mb-1">Ask a Question?</h2>
          {success && <div className="userQueryAlert alert-success">Query submitted successfully!</div>}
          {error && <div className="userQueryAlert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="userQueryForm-group">
              <label htmlFor="query">Your Query</label>
              <textarea
                id="query"
                className="userQueryForm-control"
                value={query}
                onChange={handleQueryChange}
                rows="5"
                required
              />
            </div>
            <button type="submit" className="userQueryBtn btn-primary mt-3">Submit</button>
          </form>
        </div>

        <h3 className="text-center mt-5 mb-4">Frequently Asked Questions</h3>
        <div id="faqAccordion">
          {faqs.map((faq, index) => (
            <div className="userQueryCard mb-3" key={index}>
              <div className="userQueryCard-header" id={`heading${index}`}>
                <h5 className="mb-0">
                  <button
                    className="userQueryBtn btn-link"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse${index}`}
                    aria-expanded="false"
                    aria-controls={`collapse${index}`}
                  >
                    {faq.question}
                  </button>
                </h5>
              </div>
              <div
                id={`collapse${index}`}
                className="collapse"
                aria-labelledby={`heading${index}`}
                data-parent="#faqAccordion"
              >
                <div className="userQueryCard-body">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="userQuery-footer">
        <p>&copy; 2024 Flight Booking Support</p>
      </footer>
    </div>
  );
};export default UserQuery;
