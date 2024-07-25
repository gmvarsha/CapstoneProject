import { useLocation } from "react-router-dom";
import { Container, Table, Button, Navbar, Nav, Alert, Modal, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import axios from "axios";
import CustomNavbar from "../../components/Navbar";


const BookTickets = () => {


    const [isPassengerModalOpen, setIsPassengerModalOpen] = useState(false);
    const [passengers, setPassengers] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [newPassenger, setNewPassenger] = useState({});
    const [isNewPassenger, setIsNewPassenger] = useState(false);
    const [isPassengerAvailable, setIsPassengerAvailable] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [flightDetails, setFlightDetails] = useState(true);
    const today = new Date().toISOString().split('T')[0];
    const [assignedSeats, setAssignedSeats] = useState([]);
    const [isValid, setIsValid] = useState(true);
    const [errorMessageAvailable, setErrorMessageAvailable] = useState(false);
    const [duplicatePassports, setDuplicatePassports] = useState([])




    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        passport_number: '',
        date_of_birth: '',
        seat_number: '',
        flightId: ''
    });





    const { flight } = location.state || {
        flight: {
            id: '',
            flightNumber: '',
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
        console.log(assignedSeats)
        if (validateForm(e)) {
            setAssignedSeats(() => [...assignedSeats, formData.seat_number]);
            setDuplicatePassports(() => [...duplicatePassports, formData.passport_number])
            // Add passenger logic here
            setIsNewPassenger(true)
            console.log(formData)
            if (formData.first_name)
                setPassengers((prevData) => {
                    formData.flightId = flight.flightId
                    formData.checked_in = 0
                    const updatedPassengers = [...prevData, formData]
                    console.log(updatedPassengers)
                    return updatedPassengers;
                })

        }

        setFormData({
            first_name: '',
            last_name: '',
            passport_number: '',
            date_of_birth: '',
            seat_number: '',

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
        if (passengers)
            setFlightDetails(false)
        setIsPassengerModalOpen(true)
    }
    const handleModalClose = () => {
        setIsPassengerModalOpen(false)
    }


    const handlePassengerSubmit = async () => {

        console.log(passengers)
        const pass = passengers
        let finalJson = {
            user: {
                userId: localStorage.getItem('userId')
            },
            flight: {
                flightId: flight.flightId
            },
            passengerDetails: pass,
            // booking_date:flight.
            bookingDate: today,
            status: "pending"
        }

        console.log(finalJson)
        try {
            const response = await axios.post('http://localhost:8080/api/user/booking', JSON.stringify(finalJson), {
                headers: {
                    'Content-Type': 'application/json'
                }
            },
            )
            if (response.status == 201) {
                setSuccessMessage(response.data)
                setTimeout(() => {
                    navigate('/user/myBookings')
                }, 2000)

            } else {
                setErrorMessage(response.data)
            }

        } catch (error) {
            console.log(error)
        }
    }

    const handleRemovePassenger = (index) => {
        setSuccessMessage('');
        setErrorMessage('');

        setPassengers(passengers.filter((passenger, i) => i !== index));
    };

    const handleFlightDetails = () => {
        if (flightDetails)
            setFlightDetails(false)
        else
            setFlightDetails(true)
    }

    const validateForm = (e) => {
        const { passport_number, seat_number, date_of_birth } = formData;
        let isValidCase = true;


        if (passport_number && passport_number.toString().length > 5) {
            isValidCase = false;
        }
        console.log(assignedSeats.includes(seat_number))
        if (seat_number && (seat_number <= 0 || seat_number >= 25 || assignedSeats.includes(seat_number))) {
            isValidCase = false;
        }


        if (date_of_birth && isDateInvalid(date_of_birth)) {
            isValidCase = false;
        }

        return isValidCase;
    };

    const isDateInvalid = (date) => {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        return new Date(date) > sixMonthsAgo;
    };

    const checkSeat = () => {
        const { seat_number } = formData;

        if (assignedSeats.includes(seat_number))
            return true
        return false
    }

    const checkPassport = () => {
        const { passport_number } = formData;

        if (duplicatePassports.includes(passport_number))
            return true
        return false
    }





    return (

        <div style={{
            background: 'linear-gradient(to bottom right, #f7c6c5, #fff)',
            minHeight: '100vh',
            color: '#000',
        }}>

            <CustomNavbar role='User' />

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



            <h3 className="text-center mb-4 ml-0 container-md" style={{ fontSize: '25px' }}>
                Flight Details  <Button variant="secondary" style={{ fontSize: '1rem' }} size="sm" onClick={handleFlightDetails}>{flightDetails ? 'Hide flightDetails' : 'View flightDetails'}</Button>
            </h3>
            {flightDetails && (<div className="container-sm">
                <Table striped bordered hover size="sm" className="table-left small-padding" style={{ padding: '0px' }} >
                    <tbody>
                        {Object.entries(flight).slice(1).map(([key, value], index) => (
                            <tr key={index}>
                                <td style={{ padding: '10px', align: 'left' }} ><b>{key}</b></td>
                                <td>{value}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>


            </div>)}
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
                                <Form.Control type="text" name="first_name" value={formData.first_name} onChange={handleFormChange} required />
                            </Form.Group>
                            <Form.Group controlId="formLastName">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control type="text" name="last_name" value={formData.last_name} onChange={handleFormChange} required />
                            </Form.Group>
                            <Form.Group controlId="formPassport">
                                <Form.Label>passport number</Form.Label>
                                <Form.Control type="number" name="passport_number" value={formData.passport_number} onChange={handleFormChange} required />
                                {formData.passport_number && formData.passport_number.toString().length > 5 && (
                                    <Form.Text className="text-danger">
                                        Passport number should not exceed 5 digits
                                    </Form.Text>
                                )}
                                {checkPassport() && (<Form.Text className="text-danger">
                                    Passport number should not be same for any passenger
                                </Form.Text>)}

                            </Form.Group>
                            <Form.Group controlId="formSeats">
                                <Form.Label>Seat Number</Form.Label>
                                <Form.Control type="number" name="seat_number" value={formData.seat_number} onChange={handleFormChange} required />
                                {formData.seat_number && (formData.seat_number <= 0 || formData.seat_number >= 25) && (
                                    <Form.Text className="text-danger">
                                        Seat number should be greater than 0 and less than 25
                                    </Form.Text>

                                )}
                                {checkSeat() && (<Form.Text className="text-danger">
                                    Seat number is Occupied
                                </Form.Text>)}

                            </Form.Group>
                            <Form.Group controlId="formDob">
                                <Form.Label>Date of Birth</Form.Label>
                                <Form.Control type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleFormChange} required />
                                {formData.date_of_birth && isDateInvalid(formData.date_of_birth) && (
                                    <Form.Text className="text-danger">
                                        passenger has to be atleat 6 months old from current date
                                    </Form.Text>
                                )}

                            </Form.Group>
                            <Button variant="primary" type="submit" >{isNewPassenger ? 'AddNewPassenger' : 'AddPassenger'}</Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </Container>



            {isPassengerAvailable && (
                <div className="text-center mt-4" >
                    <h2>Passenger Details</h2>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>LastName</th>
                                <th>Passport Number</th>
                                <th>Seat Number</th>
                                <th>flight Number</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {passengers.map((passenger, index) => (
                                <tr key={index}>
                                    <td>{passenger.first_name}</td>
                                    <td>{passenger.last_name}</td>
                                    <td>{passenger.passport_number}</td>
                                    <td>{passenger.seat_number}</td>
                                    <td>{passenger.flightId}</td>
                                    <td>
                                        <Button variant="secondary" onClick={() => handleRemovePassenger(index)}>
                                            Remove
                                        </Button>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </Table>


                </div>
            )}
            <div className="text-center mt-4 container-md" >
                <Button variant="primary" type="button" onClick={(e) => handleModalOpen(e)} >
                    {isNewPassenger ? 'Add Next Passenger' : 'Add  Passenger'}</Button>
                &nbsp;&nbsp;
                {isPassengerAvailable && <Button variant="success" onClick={() => { handlePassengerSubmit() }}>
                    Confirm Booking</Button>}

            </div>

            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            {errorMessage && <Alert variant="error">{errorMessage}</Alert>}

        </div>



    )
}

export default BookTickets;


