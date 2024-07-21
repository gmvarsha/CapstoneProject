import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Alert, Spinner, Container, Card, Button,Row,Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import CustomNavbar from '../../components/Navbar';

const MyQuery = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId'); // Adjust the key as needed
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      setError('User ID not found in local storage.');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchQueries = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/api/user/queries/${userId}`);
          console.log('API Response:', response.data); // Log response data for debugging
          setQueries(response.data);
        } catch (error) {
          console.error('API Error:', error); // Log error details
          setError('There was an error fetching your queries.');
        } finally {
          setLoading(false);
        }
      };

      fetchQueries();
    }
  }, [userId]); // Depend on userId

  if (loading) {
    return (
      <Container className="text-center mt-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  const renderTableRows = () => {
    if (queries.length === 0) {
      return (
        <tr>
          <td colSpan="3" className="text-center">No queries found.</td>
        </tr>
      );
    }
    return queries.map((query, index) => (
      <tr key={query.userQueryId}>
        <td className="p-1">{index + 1}</td>
        <td className="p-1 text-wrap" style={{ maxWidth: '100px', whiteSpace: 'normal' }}>{query.userQueries}</td>
        <td className="p-1 text-wrap" style={{ maxWidth: '100px', whiteSpace: 'normal' }}>{query.adminReply || 'No reply yet'}</td>
      </tr>
    ));
  };

  if (loading) {
    return (
      <Container className="text-center mt-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(to bottom right, #f7c6c5, #fff)',
      minHeight: '100vh',
      color: '#000',
    }}>    
      <CustomNavbar role='User' />
      
        <h1 className="userQuery-header">User Queries</h1>

    <Container className="mt-4">
      <Card>
        <Card.Body>
          <Table striped bordered hover responsive className="table-sm">
            <thead className="table-dark">
              <tr>
                <th className="p-1">QueryId</th>
                <th className="p-1">Query</th>
                <th className="p-1">Admin Reply</th>
              </tr>
            </thead>
            <tbody>
              {renderTableRows()}
            </tbody>
          </Table>
        </Card.Body>
        <Card.Footer className="text-muted text-center">
          <Button variant="primary" onClick={() => window.location.reload()}>Refresh</Button>
        </Card.Footer>
      </Card>
    </Container>
    </div>
  );
};export default MyQuery;
