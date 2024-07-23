import { useLocation } from "react-router-dom";
import { Container, Table, Button, Navbar, Nav, Alert, Modal, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';


const BookTickets = () => {


    const [isPassengerModalOpen, setIsPassengerModalOpen] = useState(false);
    const [passengers, setPassengers] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [newPassenger, setNewPassenger] = useState({});
    const [isNewPassenger, setIsNewPassenger] = useState(false);
    const [isPassengerAvailable, setIsPassengerAvailable] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        passportNumber: '',
        dob: '',
        seatNumber: '',
        flight_id: ''
    });





    const { flight } = location.state || {
        flight: {
            id: '', flightNumber: '',
            source: '',
            destination: '',
            departureDate: '',
            departureTime: '',
            arrivalDate: '',
            arrivalTime: '',
            price: ''
        }
    };


    const handleLogout = () => {
        localStorage.removeItem('userId');
        navigate('/user/login');
    };

    const handleHelp = () => {
        navigate('/user/help');
    };
    const handleMyBookings = () => {
        navigate('/user/mybookings')
    }

    const handleMenuToggle = () => {
        setMenuOpen(!menuOpen);
    };


    const handleAddPassenger = (e) => {
        e.preventDefault()
        setIsNewPassenger(true)
        if (formData.firstName)
            setPassengers((prevData) => {
                formData.flight_id = flight.id
                const updatedPassengers = [...prevData, formData]
                console.log(updatedPassengers)
                return updatedPassengers;
            })

        setFormData({
            firstName: '',
            lastName: '',
            passportNumber: '',
            dob: '',
            seatNumber: '',

        })
        setIsPassengerModalOpen(false)
        setIsPassengerAvailable(true)
    }

    const handleFormChange = (e) => {
        e.preventDefault();
        setFormData((prevData) => {
            return {
                ...prevData,
                [e.target.name]: e.target.value,
            }

        });
        console.log("hnadling form data ")
    }

    const handleModalOpen = (e) => {
        setIsPassengerModalOpen(true)
    }
    const handleModalClose = () => {
        setIsPassengerModalOpen(false)
    }


    const handlePassengerSubmit = () => {
        console.log('submitting')
    }

    const handleRemovePassenger = (index) => {
        setPassengers(passengers.filter((passenger, i) => i !== index));
    };


    return (

        <div style={{
            background: 'linear-gradient(to bottom right, #f7c6c5, #fff)',
            minHeight: '100vh',
            color: '#000',
        }}>

            <Navbar bg="dark" variant="dark">
                <Container fluid>
                    <Navbar.Brand href="#home" className="ms-0 me-auto">Flight Booking App</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            {/* <Nav.Link style={{color:"white"}}>My Bookings</Nav.Link> */}
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
                        <li style={{ padding: '8px 16px', cursor: 'pointer' }} onClick={handleMyBookings}>My Bookings</li>
                        <li style={{ padding: '8px 16px', cursor: 'pointer' }} onClick={handleHelp}>Help</li>
                        <li style={{ padding: '8px 16px', cursor: 'pointer' }} onClick={handleLogout}>Logout</li>
                    </ul>
                </div>
            )}



           <h3 className="text-left mb-4" style={{ fontSize:'25px' }}>Flight Details</h3>
            <div className="text-center mb-1">
                <Table striped bordered hover size="sm" className="table-left small-padding" >
                    <tbody>
                        {Object.entries(flight).slice(1).map(([key, value], index) => (
                            <tr key={index}>
                                <td><b>{key}</b></td>
                                <td>{value}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                <Button variant="primary" type="button" onClick={(e) => handleModalOpen(e)}  >Procced Booking</Button>
            </div>

            <Container>
                <Modal show={isPassengerModalOpen} onHide={handleModalClose} dialogClassName="modal-90w">
                    <Modal.Header closeButton>
                        <Modal.Title>Add Passenger Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ maxHeight: 'calc(100vh - 130px)', overflowY: 'auto' }}>
                        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                        <Form onSubmit={(e) => { handleAddPassenger(e) }}>
                            <Form.Group controlId="formPassengerFirstName">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control type="text" name="firstName" value={formData.firstName} onChange={handleFormChange} required />
                            </Form.Group>
                            <Form.Group controlId="formLastName">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control type="text" name="lastName" value={formData.lastName} onChange={handleFormChange} required />
                            </Form.Group>
                            <Form.Group controlId="formPassport">
                                <Form.Label>passport number</Form.Label>
                                <Form.Control type="text" name="passportNumber" value={formData.passportNumber} onChange={handleFormChange} required />
                            </Form.Group>
                            <Form.Group controlId="formSeats">
                                <Form.Label>Seat Number</Form.Label>
                                <Form.Control type="number" name="seatNumber" value={formData.seatNumber} onChange={handleFormChange} required />
                            </Form.Group>
                            <Form.Group controlId="formDob">
                                <Form.Label>Date of Birth</Form.Label>
                                <Form.Control type="date" name="dob" value={formData.dob} onChange={handleFormChange} required />
                            </Form.Group>
                            <Button variant="primary" type="submit" >{isNewPassenger ? 'AddNewPassenger' : 'AddPassenger'}</Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </Container>



            {isPassengerAvailable && (
                <div className="text-center mt-4" >
                    <h2  >Booked Passenger Details</h2>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>LastName</th>
                                <th>Passport Number</th>
                                <th>Seat Number</th>
                                <th>flight Number</th>
                            </tr>
                        </thead>
                        <tbody>
                            {passengers.map((passenger, index) => (
                                <tr key={index}>
                                    <td>{passenger.firstName}</td>
                                    <td>{passenger.lastName}</td>
                                    <td>{passenger.passportNumber}</td>
                                    <td>{passenger.seatNumber}</td>
                                    <td>{passenger.flight_id}</td>
                                    <td>
                                        <Button variant="secondary" onClick={() => handleRemovePassenger(index)}>
                                            Remove
                                        </Button>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Button variant="primary" onClick={() => {
                        handlePassengerSubmit()
                    }}>Confirm Booking</Button>
                    {successMessage && <Alert variant="success">{successMessage}</Alert>}
                </div>
            )}


        </div>



    )
}

export default BookTickets;


