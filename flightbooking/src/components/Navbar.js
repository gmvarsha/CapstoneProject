// CustomNavbar.js

import React, { useState } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { Navigate, useNavigate } from 'react-router-dom';
import { IoHome, IoPerson } from 'react-icons/io5';


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
    if (role == 'User') {
      navigate('/user/help');
    }
  };

  const handleHomeIcon = () => {
    navigate('/user/userbooking')
  }
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
  const handleAdminWebCheckin = () => {
    navigate('/admin/adminCheckin');
  };

  const handleProfile = () =>{
    return navigate('/user/profile')
  }
  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Container fluid>
          <Navbar.Brand href="#home" className="ms-0 me-auto" >
            <IoHome size={20} className="mb-2 ms-auto" color="#FFFFFF" onClick={handleHomeIcon}/>&nbsp;&nbsp;
            <span style={{ color: '#FFFFFF' }}><b>SwayAirLinesApp</b></span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link style={{ color: "white" }} onClick={handleMenuToggle}>
                <div style={{ marginLeft: '15px' }}> {/* move Profile icon to right */}
                  <IoPerson size={30} color="#FFFFFF" />
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
            <li style={{ padding: '8px 16px', cursor: 'pointer' }} onClick={handleProfile}>My profile</li>
            {role == 'User' && <li style={{ padding: '8px 16px', cursor: 'pointer' }} onClick={handleMyBookings}>My Bookings</li>}
            {role == 'User' && <li style={{ padding: '8px 16px', cursor: 'pointer' }} onClick={handleHelp}>Help</li>}
            {role == 'Admin' && <li style={{ padding: '8px 16px', cursor: 'pointer' }} onClick={handleUserQueries}>Queries</li>}
            {role == 'User' && <li style={{ padding: '8px 16px', cursor: 'pointer' }} onClick={handleMyQueries}>My Queries</li>}
            {role == 'User' && <li style={{ padding: '8px 16px', cursor: 'pointer' }} onClick={handleUserWebCheckin}>Web-Checkin</li>}
            {role == 'Admin' && <li style={{ padding: '8px 16px', cursor: 'pointer' }} onClick={handleAdminWebCheckin}>Web-Checkin</li>}

            <li style={{ padding: '8px 16px', cursor: 'pointer' }} onClick={handleLogout}>Logout</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomNavbar;
