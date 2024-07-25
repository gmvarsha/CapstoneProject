import React, { useState, useEffect } from 'react';
import { Table, Button, Collapse, Form,Toast, ToastContainer } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import CustomNavbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';
import flight from '../../flight2.jpg'


const AdminReply = () => {
  const [queries, setQueries] = useState([]);
  const [open, setOpen] = useState({});
  const [responses, setResponses] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState(''); // 'success' or 'error'
  const navigate = useNavigate();


  useEffect(() => {
    fetchQueries();
}, []);
    // Fetch all user queries from the API
    const fetchQueries=()=>{axios.get('http://localhost:8080/api/user/getAllQueries')
      .then(response => {
        setQueries(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the queries!', error);
      });
    };

  const handleReplyChange = (userQueryId, event) => {
    setResponses({
      ...responses,
      [userQueryId]: event.target.value
    });
  };
const handleNavigate =() => {
  navigate('/admin/adminhome');
};
  const handleReplySubmit = (userId, userQueryId) => {
    const replyText = responses[userQueryId];

    if (!replyText) {
      setToastMessage('Reply cannot be empty!');
      setToastType('bg-danger text-white'); // Red background for error
      setShowToast(true);
      return;
    }

    const payload = {
        userId,
        userQueryId,
        reply: replyText
      };


    axios.post('http://localhost:8081/api/admin/reply', payload)
      .then(response => {
        setToastMessage('Reply sent successfully!');
        setToastType('bg-success text-white'); // Green background for success
        setShowToast(true);
        setOpen({ ...open, [userQueryId]: false });
        setResponses({
            ...responses,
            [userQueryId]: ''
          });
          fetchQueries(); // Refresh the query list
      })
      .catch(error => {
        console.error('There was an error sending the reply!', error);
        setToastMessage('There was an error sending the reply. Please try again.');
        setToastType('bg-danger text-white'); // Red background for error
        setShowToast(true);

      });
  };

  const containerStyle = {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '8px'
};
  return (
    <div style={{
        background: 'linear-gradient(to bottom right, #f7c6c5, #fff)',
        minHeight: '100vh',
        color: '#000',
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${flight})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
      }}>    
        <CustomNavbar role='Admin' />
        
          <h1 className="userQuery-header">User Queries</h1>
  
    <div style={containerStyle}>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Query</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {queries.length === 0 ? (
            <tr>
              <td colSpan="3">No queries available.</td>
            </tr>
          ) : (
            queries.map(query => (
              <React.Fragment key={query.userQueryId}>
                <tr>
                  <td>{query.firstName+""+query.lastName}</td>
                  <td>{query.email}</td>
                  <td style={{ maxHeight: '100px', overflowY: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {query.userQueries}
                  </td>

                  <td>
                    <Button
                      variant="info"
                      onClick={() => setOpen({ ...open, [query.userQueryId]: !open[query.userQueryId] })}
                    >
                      {open[query.userQueryId] ? 'Hide Reply' : 'Reply'}
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td colSpan="3">
                    <Collapse in={open[query.userQueryId]}>
                      <div>
                        <Form>
                          <Form.Group controlId={`formReply${query.userQueryId}`}>
                            <Form.Label>Reply</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              value={responses[query.userQueryId] || ''}
                              onChange={(e) => handleReplyChange(query.userQueryId, e)}
                            />
                          </Form.Group>
                          <Button
                            variant="primary"
                            onClick={() => handleReplySubmit(query.userId, query.userQueryId)}
                          >
                            Send
                          </Button>
                        </Form>
                      </div>
                    </Collapse>
                  </td>
                </tr>
              </React.Fragment>
            ))
          )}
        </tbody>
      </Table>
      <ToastContainer className="position-fixed top-0 start-50 translate-middle-x p-3">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
          className={`d-inline-block m-1 ${toastType}`} // Apply success or error color
        >
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <Button variant="primary" onClick={handleNavigate}>Go to Available Flights Page</Button>
    </div>
    
    <footer className="userQuery-footer">
    <p>&copy; 2024 SwayAirApp. All rights reserved.</p>
  </footer>
    </div>
  );
};

export default AdminReply;
