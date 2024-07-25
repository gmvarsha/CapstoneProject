// import React from 'react';
// import { IoPerson } from 'react-icons/io5';

// function ProfilePage() {
//     const user = {
//         firstName:localStorage.getItem('firstName'),
//         lastName: localStorage.getItem('lastName'),
//         userId:localStorage.getItem('userId'),
//         role:localStorage.getItem('userRole'),
//         email:localStorage.getItem('userRole')


//     }
//   return (
//     <div className="profile-page">
//       <div className="profile-header">
//       <IoPerson size={30} color="#FFFFFF" />
//         <h1>{user.firstName} {user.lastName}</h1>
//         <p>{user.email}</p>
//         <p>{user.role}</p>
//       </div>
//       <div className="profile-info">
//         <h2>About Me</h2>
//         <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
//       </div>
//       <div className="profile-stats">
//         <h2>Account Type</h2>
//         <p>{user.role === 'admin' ? 'Administrator' : 'User'}</p>
//       </div>
//     </div>
//   );
// }

// export default ProfilePage;
import React from 'react';
import { Container, Row, Col, Image, Card } from 'react-bootstrap';
import { IoPerson } from 'react-icons/io5';
import CustomNavbar from '../components/Navbar';

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
            background: 'linear-gradient(to bottom right, #f7c6c5, #fff)',

            height: '100vh',
            color: '#000',


        }}>
            <CustomNavbar role={user.role} />
            <Container >
                <Row className="justify-content-center mt-5">
                    <Col md={6}>
                        <Card>
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
        </div>
    );
}

export default ProfilePage;
