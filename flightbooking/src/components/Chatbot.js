import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaRobot, FaTimes, FaPaperPlane, FaQuestionCircle, FaArrowLeft, FaPlus, FaArrowRight } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([{ text: 'How may I assist you today?', sender: 'bot' }]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('chatHistory'));
    if (savedHistory) {
      setMessages(savedHistory);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, sender: 'user' }];
    setMessages(newMessages);
    setInput('');

    try {
      const response = await axios.post('http://localhost:8080/api/user/chatbot', { message: input });
      setMessages([...newMessages, { text: response.data.reply, sender: 'bot' }]);
    } catch (error) {
      console.error('Error sending message', error);
    }
  };

  const handleDefaultQuestion = async (question) => {
    const newMessages = [...messages, { text: question, sender: 'user' }];
    setMessages(newMessages);

    try {
      const response = await axios.post('http://localhost:8080/api/user/chatbot', { message: question });
      setMessages([...newMessages, { text: response.data.reply, sender: 'bot' }]);
    } catch (error) {
      console.error('Error sending message', error);
    }
  };

  const toggleChatbot = () => {
    if (isOpen) {
      setShowOptions(true);
    } else {
      setShowOptions(false);
      const savedHistory = JSON.parse(localStorage.getItem('chatHistory'));
      if (savedHistory && savedHistory.length > 1) {
        setShowOptions(true);
      }
      setIsOpen(true);
    }
  };

  const handleOptionChoice = (choice) => {
    if (choice === 'continue') {
      const savedHistory = JSON.parse(localStorage.getItem('chatHistory'));
      if (savedHistory) {
        setMessages(savedHistory);
      }
    } else {
      setMessages([{ text: 'How may I assist you today?', sender: 'bot' }]);
    }
    setShowOptions(false);
    setIsOpen(true);
  };

  const closeChatbot = () => {
    setIsOpen(false);
    setShowOptions(true);
  };

  const handleOptionClose = () => {
    setShowOptions(false);
  };

  const handleFAQClick = async (question) => {
    const newMessages = [...messages, { text: question, sender: 'user' }];
    setMessages(newMessages);

    try {
      const response = await axios.post('http://localhost:8080/api/user/chatbot', { message: question });
      setMessages([...newMessages, { text: response.data.reply, sender: 'bot' }]);
    } catch (error) {
      console.error('Error sending message', error);
    }
    
    // Close FAQ popup
    setShowFAQ(false);
  };

  useEffect(() => {
    if (isOpen) {
      endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  return (
    <div>
      <FaRobot
        onClick={toggleChatbot}
        className="position-fixed"
        style={{
          bottom: '20px',
          right: '20px',
          fontSize: '2.5rem',
          color: '#4a90e2',
          cursor: 'pointer',
          zIndex: 1000,
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          transform: isOpen ? 'scale(0.9)' : 'scale(1)',
          boxShadow: isOpen ? '0 4px 8px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.2)'
        }}
      />
      {isOpen && (
        <div className="card position-fixed" style={{
          bottom: '0',
          right: '0',
          width: '350px',
          height: '500px',
          borderRadius: '15px',
          zIndex: 1000,
          fontFamily: '"Roboto", sans-serif',
          overflow: 'hidden',
          border: 'none',
          boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
          background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)'
        }}>
          <div className="card-header d-flex justify-content-between align-items-center" style={{ backgroundColor: '#4a90e2', color: '#fff', borderRadius: '15px 15px 0 0' }}>
            <span>Chatbot</span>
            <div className="d-flex align-items-center">
              <FaQuestionCircle
                onClick={() => setShowFAQ(!showFAQ)}
                className="me-3"
                style={{ cursor: 'pointer', fontSize: '20px' }}
              />
              <FaTimes
                onClick={closeChatbot}
                style={{ cursor: 'pointer', fontSize: '20px' }}
              />
            </div>
          </div>
          <div className="card-body p-3 d-flex flex-column" style={{ backgroundColor: '#f9f9f9', overflowY: 'auto' }}>
            {messages.map((msg, index) => (
              <div key={index} className={`p-2 mb-2 rounded ${msg.sender === 'user' ? 'bg-primary text-white align-self-end' : 'bg-light text-dark align-self-start'}`}
                style={{
                  maxWidth: '75%',
                  fontSize: '14px',
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  borderRadius: '20px',
                  boxShadow: msg.sender === 'user' ? '0 2px 4px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0,0,0,0.1)',
                  wordBreak: 'break-word'
                }}>
                {msg.text}
              </div>
            ))}
            <div ref={endOfMessagesRef} />
          </div>
          <div className="card-footer d-flex align-items-center p-2" style={{ backgroundColor: '#fff', borderTop: 'none' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="form-control me-2"
              placeholder="Type a message..."
              style={{ borderRadius: '25px', fontSize: '14px' }}
            />
            <button onClick={handleSend} className="btn btn-primary rounded-circle" style={{ width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaPaperPlane style={{ fontSize: '1.2rem' }} />
            </button>
          </div>
          {showFAQ && (
            <div className="position-absolute bg-white border rounded shadow-sm p-2" style={{ bottom: '70px', right: '15px', width: 'calc(100% - 30px)', height: '350px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '5px', overflowY: 'hidden' }}>
              <button onClick={() => setShowFAQ(false)} className="btn btn-link position-absolute" style={{ top: '10px', right: '10px', fontSize: '20px', color: '#4a90e2' }}>
                <FaTimes />
              </button>
              <div className="grid-container" style={{ gridColumn: '1 / span 2', textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>FAQ</div>
              <button onClick={() => handleFAQClick('Book Tickets')} className="btn btn-link d-block w-100 text-center" style={{ fontSize: '14px' }}>
                Book Tickets
              </button>
              <button onClick={() => handleFAQClick('Check In')} className="btn btn-link d-block w-100 text-center" style={{ fontSize: '14px' }}>
                Check In
              </button>
              <button onClick={() => handleFAQClick('view bookings')} className="btn btn-link d-block w-100 text-center" style={{ fontSize: '14px' }}>
                View Bookings
              </button>
              <button onClick={() => handleFAQClick('Log In')} className="btn btn-link d-block w-100 text-center" style={{ fontSize: '14px' }}>
                Log In
              </button>
              <button onClick={() => handleFAQClick('Log Out')} className="btn btn-link d-block w-100 text-center" style={{ fontSize: '14px' }}>
                Log Out
              </button>
              <button onClick={() => handleFAQClick('Register')} className="btn btn-link d-block w-100 text-center" style={{ fontSize: '14px' }}>
                Register
              </button>
              <button onClick={() => handleFAQClick('Filter Flights')} className="btn btn-link d-block w-100 text-center" style={{ fontSize: '14px' }}>
                Filter Flights
              </button>
              <button onClick={() => handleFAQClick('Sort Flights')} className="btn btn-link d-block w-100 text-center" style={{ fontSize: '14px' }}>
                Sort Flights
              </button>
              <button onClick={() => handleFAQClick('send query')} className="btn btn-link d-block w-100 text-center" style={{ fontSize: '14px' }}>
                HELP
              </button>
              <button onClick={() => handleFAQClick('Contact Admin')} className="btn btn-link d-block w-100 text-center" style={{ fontSize: '14px' }}>
                Contact Admin
              </button>
              <button onClick={() => handleFAQClick('check in')} className="btn btn-link d-block w-100 text-center" style={{ fontSize: '14px' }}>
                Check-In
              </button>
              <button onClick={() => handleFAQClick('Booking Status')} className="btn btn-link d-block w-100 text-center" style={{ fontSize: '14px' }}>
                Booking Status
              </button>
              <button onClick={() => handleFAQClick('Assign Seats')} className="btn btn-link d-block w-100 text-center" style={{ fontSize: '14px' }}>
                Assign Seats
              </button>
            </div>
          )}
          {showOptions && (
            <div className="position-absolute bg-white border rounded shadow-sm p-4" style={{ bottom: '70px', right: '15px', width: '320px' }}>
              <button onClick={handleOptionClose} className="btn btn-link position-absolute" style={{ top: '10px', right: '10px', fontSize: '20px', color: '#4a90e2' }}>
                <FaTimes />
              </button>
              <p className="mb-3" style={{ fontSize: '14px' }}>Do you want to continue the previous chat or start a new one?</p>
              <div className="d-flex flex-column gap-2">
                <button onClick={() => handleOptionChoice('continue')} className="btn btn-outline-primary d-flex align-items-center justify-content-center" style={{ fontSize: '14px' }}>
                  <FaArrowLeft className="me-2" />
                  Continue Previous Chat
                </button>
                <button onClick={() => handleOptionChoice('new')} className="btn btn-outline-success d-flex align-items-center justify-content-center" style={{ fontSize: '14px' }}>
                  <FaPlus className="me-2" />
                  Start New Chat
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Chatbot;
