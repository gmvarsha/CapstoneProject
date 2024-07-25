import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Button, Table, Container, Row, Col, Card, Alert, Spinner, Accordion } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import CustomNavbar from '../../components/Navbar';
import { FaCheck, FaTimes } from 'react-icons/fa'; // Correct import

const AdminCheckIn = () => {
    const [checkedInPassengers, setCheckedInPassengers] = useState([]);
    const [pendingPassengers, setPendingPassengers] = useState([]);
    const [selectedPassengers, setSelectedPassengers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [activeKey, setActiveKey] = useState('1'); // Default to "Pending Check-in Passengers"

    // Fetch passengers data
    const fetchPassengersData = useCallback(async () => {
        try {
            const [checkedInResponse, pendingResponse] = await Promise.all([
                axios.get('http://localhost:8080/api/user/checkedin'),
                axios.get('http://localhost:8080/api/user/pending')
            ]);
            setCheckedInPassengers(checkedInResponse.data);
            setPendingPassengers(pendingResponse.data);
        } catch (error) {
            console.error("Error fetching passengers data", error);
        }
    }, []);

    useEffect(() => {
        fetchPassengersData();
    }, [fetchPassengersData]);

    // Handle confirm booking
    const handleConfirmBooking = async () => {
        setLoading(true);
        try {
            const passengerIds = selectedPassengers.map(passenger => passenger.passengerId);
            await axios.post('http://localhost:8080/api/user/confirmBooking', passengerIds);
            await fetchPassengersData(); // Refresh data
            setSelectedPassengers([]);
            setSuccess(true);
        } catch (error) {
            console.error("Error confirming booking", error);
        } finally {
            setLoading(false);
            setTimeout(() => setSuccess(false), 2000);
        }
    };

    // Toggle passenger selection
    const togglePassengerSelection = (passenger) => {
        setSelectedPassengers(prevState => {
            const isSelected = prevState.some(selected => selected.passengerId === passenger.passengerId);
            return isSelected
                ? prevState.filter(selected => selected.passengerId !== passenger.passengerId)
                : [...prevState, passenger];
        });
    };

    // Select all passengers
    const handleSelectAll = () => {
        setSelectedPassengers(pendingPassengers);
    };

    // Unselect all passengers
    const handleUnselectAll = () => {
        setSelectedPassengers([]);
    };

    return (
        <div>
            <div style={{
                background: 'linear-gradient(to bottom right, #f7c6c5, #fff)',
                minHeight: '100vh',
                color: '#000',
            }}>    
                <CustomNavbar role='Admin' />
                
                <h1 className="userQuery-header text-center">Admin Web Check-In</h1>
                    
                <Container className="my-4">
                    {loading && <div className="text-center"><Spinner animation="border" role="status"><span className="sr-only">Loading...</span></Spinner></div>}
                    {success && <Alert variant="success">Passengers checked in. Booking confirmed and seat assigned!</Alert>}

                    <Row className="mb-4">
                        <Col xs={12}>
                            <Card>
                                <Card.Body>
                                    <Accordion activeKey={activeKey} onSelect={(key) => setActiveKey(key)}>
                                        <Accordion.Item eventKey="0">
                                            <Accordion.Header>Checked-in Passengers</Accordion.Header>
                                            <Accordion.Body>
                                                <p>This section displays a list of passengers who have already checked in. You can review their details and ensure that all necessary information is correct.</p>
                                                <Table striped bordered hover responsive>
                                                    <thead>
                                                        <tr>
                                                            <th>ID</th>
                                                            <th>Name</th>
                                                            <th>Passport Number</th>
                                                            <th>Date of Birth</th>
                                                            <th>Seat Number</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {checkedInPassengers.length > 0 ? (
                                                            checkedInPassengers.map(passenger => (
                                                                <tr key={passenger.passengerId}>
                                                                    <td>{passenger.passengerId}</td>
                                                                    <td>{`${passenger.first_name} ${passenger.last_name}`}</td>
                                                                    <td>{passenger.passport_number}</td>
                                                                    <td>{passenger.date_of_birth}</td>
                                                                    <td>{passenger.seat_number}</td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan="5">
                                                                    <Row className="justify-content-center">
                                                                        <Col xs={12} className="d-flex justify-content-center">
                                                                            <div className="text-center">
                                                                                <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#777' }}>No checked-in passengers found.</p>
                                                                            </div>
                                                                        </Col>
                                                                    </Row>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </Table>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                        <Accordion.Item eventKey="1">
                                            <Accordion.Header>Pending Check-in Passengers</Accordion.Header>
                                            <Accordion.Body>
                                                <p>This section allows you to view and manage passengers who are yet to check in. You can confirm their check-ins as needed to complete their check-in process.</p>

                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <div>
                                                        <Button
                                                            variant="outline-primary"
                                                            onClick={handleSelectAll}
                                                            className="mr-2"
                                                            style={{ fontWeight: 'bold' }}
                                                        >
                                                            <FaCheck /> Select All
                                                        </Button>
                                                        <Button
                                                            variant="outline-secondary"
                                                            onClick={handleUnselectAll}
                                                            className="ml-2"
                                                            style={{ fontWeight: 'bold' }}
                                                        >
                                                            <FaTimes /> Unselect All
                                                        </Button>
                                                    </div>
                                                    <Button
                                                        variant="success"
                                                        onClick={handleConfirmBooking}
                                                        disabled={selectedPassengers.length === 0}
                                                        style={{ fontWeight: 'bold' }}
                                                    >
                                                        Confirm Booking for Selected
                                                    </Button>
                                                </div>

                                                <Table striped bordered hover responsive>
                                                    <thead>
                                                        <tr>
                                                            <th>Select</th>
                                                            <th>ID</th>
                                                            <th>Name</th>
                                                            <th>Passport Number</th>
                                                            <th>Date of Birth</th>
                                                            <th>Seat Number</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {pendingPassengers.length > 0 ? (
                                                            pendingPassengers.map(passenger => (
                                                                <tr key={passenger.passengerId}>
                                                                    <td>
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={selectedPassengers.some(selected => selected.passengerId === passenger.passengerId)}
                                                                            onChange={() => togglePassengerSelection(passenger)}
                                                                        />
                                                                    </td>
                                                                    <td>{passenger.passengerId}</td>
                                                                    <td>{`${passenger.first_name} ${passenger.last_name}`}</td>
                                                                    <td>{passenger.passport_number}</td>
                                                                    <td>{passenger.date_of_birth}</td>
                                                                    <td>{passenger.seat_number}</td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan="6">
                                                                    <Row className="justify-content-center">
                                                                        <Col xs={12} className="d-flex justify-content-center">
                                                                            <div className="text-center">
                                                                                <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#777' }}>No pending check-in passengers found.</p>
                                                                            </div>
                                                                        </Col>
                                                                    </Row>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </Table>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
            <footer className="userQuery-footer">
                <p>&copy; 2024 SwayAirApp. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default AdminCheckIn;
