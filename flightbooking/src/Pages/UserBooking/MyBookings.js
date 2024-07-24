import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {  Table, Button, Card } from 'react-bootstrap';
import CustomNavbar from '../../components/Navbar';


const MyBookings = () => {
    const [flightData, setFlightData] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false);
    const [showFlightDetails, setShowFlightDetails] = useState({});
    const [showPassengerDetails, setShowPassengerDetails] = useState({});


    const navigate = useNavigate();

    useEffect(() => {
        let userId = localStorage.getItem('userId')
        console.log(parseInt(userId))
        axios.get('http://localhost:8080/api/user/getBookingDetails/' + userId) // Replace with your API endpoint
            .then(response => {
                setFlightData(
                    response.data
                )
                console.log(flightData)
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

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
                        <li key={1} style={{ padding: '8px 16px', cursor: 'pointer' }} onClick={handleMyBookings}>My Bookings</li>
                        <li key={2} style={{ padding: '8px 16px', cursor: 'pointer' }} onClick={handleHelp}>Help</li>
                        <li key={3} style={{ padding: '8px 16px', cursor: 'pointer' }} onClick={handleLogout}>Logout</li>
                    </ul>
                </div>
            )}


            <div  >
                <h2> Booking Details for userId: {localStorage.getItem('userId')}</h2>
                {flightData.map((booking) => (
                    <div key={booking.bookingId} style={{
                        background: 'linear-gradient(to bottom right, #f7c6c5, #fff)',
                        minHeight: '1vh',
                        color: '#000',
                    }}>

                        <Card key={booking.bookingId} className="mt-3 ml-10 mr-3" >
                            <Card.Header style={{
                                minHeight: '1vh',
                                color: '#000',
                            }} ><b>Booking Id :</b> {booking.bookingId}</Card.Header>
                            <Card.Body>
                                <Table striped bordered hover >
                                    <tbody>
                                        <tr>
                                            <td><b>Booking Date</b></td>
                                            <td>{booking.booking_date}</td>
                                        </tr>
                                        <tr>
                                            <td><b>Status</b></td>
                                            <td>{booking.status}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                                <Button className="Source"
                                    onClick={() =>
                                        setShowFlightDetails((prev) => ({
                                            ...prev,
                                            [booking.bookingId]: !prev[booking.bookingId],
                                        }))
                                    }
                                > <b>{showFlightDetails[booking.bookingId] ? 'Hide' : 'Show'} Flight Details</b></Button>
                            </Card.Body>
                            {showFlightDetails[booking.bookingId] && (
                                <Card>
                                    <Card.Header>Flight Details</Card.Header>
                                    <Card.Body>
                                        <Table striped bordered hover>
                                            <tbody>
                                                <tr>
                                                    <td>Flight Number</td>
                                                    <td>{booking.flight.flightNumber}</td>
                                                </tr>
                                                <tr>
                                                    <td>Source</td>
                                                    <td>{booking.flight.source}</td>
                                                </tr>
                                                <tr>
                                                    <td>Destination</td>
                                                    <td>{booking.flight.destination}</td>
                                                </tr>
                                                <tr>
                                                    <td>Departure Date</td>
                                                    <td>{booking.flight.departureDate}</td>
                                                </tr>
                                                <tr>
                                                    <td>Departure Time</td>
                                                    <td>{booking.flight.departureTime}</td>
                                                </tr>
                                                <tr>
                                                    <td>Arrival Date</td>
                                                    <td>{booking.flight.arrivalDate}</td>
                                                </tr>
                                                <tr>
                                                    <td>Arrival Time</td>
                                                    <td>{booking.flight.arrivalTime}</td>
                                                </tr>
                                            </tbody>
                                        </Table>

                                        {booking.passengers && booking.passengers.length > 0 && (
                                            <Button
                                                variant="primary"
                                                onClick={() =>
                                                    setShowPassengerDetails((prev) => ({
                                                        ...prev,
                                                        [booking.bookingId]: !prev[booking.bookingId],
                                                    }))
                                                }
                                            >
                                                {showPassengerDetails[booking.bookingId] ? 'Hide' : 'Show'} Passenger Details
                                            </Button>
                                        )}
                                        {showPassengerDetails[booking.bookingId] && (
                                            <Table striped bordered hover>
                                                <thead>
                                                    <tr>
                                                        <th>First Name</th>
                                                        <th>Last Name</th>
                                                        <th>Passport Number</th>
                                                        <th>Date of Birth</th>
                                                        <th>Seat Number</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {booking.passengers.map((passenger) => (
                                                        <tr key={passenger.passenger_id}>
                                                            <td>{passenger.first_name}</td>
                                                            <td>{passenger.last_name}</td>
                                                            <td>{passenger.passport_number}</td>
                                                            <td>{passenger.date_of_birth}</td>
                                                            <td>{passenger.seat_number}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        )}
                                    </Card.Body>
                                </Card>
                            )}
                        </Card>
                    </div >
                ))}
            </div>
        </div >
    );

}

export default MyBookings;
