
import React from 'react';
import { Container, Row, Col, Image, Card } from 'react-bootstrap';
import { IoPerson } from 'react-icons/io5';
import CustomNavbar from '../components/Navbar';
import flight from '../../src/flight2.jpg'



const ProfilePage = () => {

    const user = {
        firstName: localStorage.getItem('firstName'),
        lastName: localStorage.getItem('lastName'),
        userId: localStorage.getItem('userId'),
        role: localStorage.getItem('userRole'),
        email: localStorage.getItem('email')

    }
    return (
        <div style={{


            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${flight})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100vh'

        }}>
            <CustomNavbar role={user.role} />
            <Container className='mb-2 py-4'>
                <Row className="justify-content-center mt-5">
                    <Col md={6}>
                        <Card style={{ color: '#000', }}>
                            <Card.Header>
                                <IoPerson size={100}></IoPerson>
                                <Card.Title>{user.firstName} {user.lastName}</Card.Title>
                                <Card.Subtitle>{user.email}</Card.Subtitle>
                            </Card.Header>
                            <Card.Body>
                                <Card.Text sm-3>
                                    <b>About Me</b><br></br>
                                    I am an user of sway airline application
                                </Card.Text>
                            </Card.Body>
                            <Card.Footer sm-3>
                                <b>Account Type</b>
                                <p>{user.role === 'Admin' ? 'Administrator' : 'User'}</p>
                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <footer style={{
                position: 'fixed',
                left: 0,
                bottom: 0,
                width: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                textAlign: 'center',
                padding: '10px 0',
            }}>
                <p style={{ margin: 0, 'color': '#fff' }}>&copy; 2024 SwayAirApp. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default ProfilePage;

