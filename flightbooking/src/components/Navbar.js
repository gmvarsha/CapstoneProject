// CustomNavbar.js

import React, { useState } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const CustomNavbar = ({ role }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleMenuToggle = () => {
        setMenuOpen(!menuOpen);
      };
      const handleLogout = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
        navigate('/user/login');
      };
    
      const handleHelp = () => {
        if(role=='User'){
        navigate('/user/help');
        }
      };
    
      const handleMyBookings = () => {
        navigate('/user/mybookings');
      };
      const handleUserQueries = () => {
        navigate('/admin/Queries');
      };
      const handleMyQueries = () => {
        navigate('/user/myQueries');
      };
      const handleUserWebCheckin = () => {
        navigate('/user/userCheckin');
      };
  return (
    <div>
    <Navbar bg="dark" variant="dark">
      <Container fluid>
        <Navbar.Brand href="#home" className="ms-0 me-auto">SwayAirApp</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link style={{ color: "white" }} onClick={handleMenuToggle}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '15px', height: '2px', backgroundColor: 'white', margin: '2px 0' }}></div>
                <div style={{ width: '15px', height: '2px', backgroundColor: 'white', margin: '2px 0' }}></div>
                <div style={{ width: '15px', height: '2px', backgroundColor: 'white', margin: '2px 0' }}></div>
              </div>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    {menuOpen && (
        <div style={{
          position: 'absolute',
          top: '50px',
          right: '10px',
          background: 'white',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          zIndex: 1000
        }}>
          <ul style={{ listStyle: 'none', padding: '10px', margin: 0 }}>
            {role=='User' && <li style={{ padding: '8px 16px', cursor: 'pointer' }} onClick={handleMyBookings}>My Bookings</li>}
            {role=='User' && <li style={{ padding: '8px 16px', cursor: 'pointer' }} onClick={handleHelp}>Help</li>}
            {role=='Admin' && <li style={{ padding: '8px 16px', cursor: 'pointer' }} onClick={handleUserQueries}>Queries</li>}
            {role=='User' && <li style={{ padding: '8px 16px', cursor: 'pointer' }} onClick={handleMyQueries}>My Queries</li>}
            {role=='User' && <li style={{ padding: '8px 16px', cursor: 'pointer' }} onClick={handleUserWebCheckin}>Web-Checkin</li>}

            <li style={{ padding: '8px 16px', cursor: 'pointer' }} onClick={handleLogout}>Logout</li>
          </ul>
        </div>
      )}
      </div>
  );
};

export default CustomNavbar;
