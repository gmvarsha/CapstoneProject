import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Collapse } from 'react-bootstrap';
import CustomNavbar from '../../components/Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import flight from '../../flight2.jpg'
const UserCheckIn = () => {
    const [bookings, setBookings] = useState([]);
    const [selectedPassengers, setSelectedPassengers] = useState([]);
    const [openBookingId, setOpenBookingId] = useState(null);
    const navigate = useNavigate();

     useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        const userId = localStorage.getItem('userId'); // Retrieve userId from local storage
        if (!userId) {
            toast.error("User not logged in.");
            return;
        }
        try {
            const response = await axios.get('http://localhost:8080/api/user/getBookingsByUserIDAndStatus',{
                params: {
                    userId: userId,
                    status: 'PENDING',
                   
            },
                });
                if (response.status === 200) {
                    setBookings(response.data);
                } else {
                    console.error('Failed to fetch bookings');
                }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleUnselectAll = (bookingId) => {
        const booking = bookings.find(b => b.bookingId === bookingId);
        if (booking) {
            const allPassengerIds = booking.passengers
                .filter(p => !p.checkedInFlag)
                .map(p => p.passenger_id);

            const newSelectedPassengers = selectedPassengers.filter(id => !allPassengerIds.includes(id));
            setSelectedPassengers(newSelectedPassengers);
        }
    };
    const handleSelectPassenger = (passengerId) => {
        setSelectedPassengers(prevSelected => {
            if (prevSelected.includes(passengerId)) {
                return prevSelected.filter(id => id !== passengerId);
            } else {
                return [...prevSelected, passengerId];
            }
        });
    };

    const handleSelectAll = (bookingId) => {
        const booking = bookings.find(b => b.bookingId === bookingId);
        if (booking) {
            const allPassengerIds = booking.passengers
                .filter(p => !p.checkedInFlag)
                .map(p => p.passenger_id);
            
            const newSelectedPassengers = selectedPassengers.includes(bookingId)
                ? selectedPassengers.filter(id => !allPassengerIds.includes(id))
                : [...selectedPassengers, ...allPassengerIds];

            setSelectedPassengers(newSelectedPassengers);
        }
    };

    const isAllPassengersSelected = (bookingId) => {
        const booking = bookings.find(b => b.bookingId === bookingId);
        if (booking) {
            const allPassengerIds = booking.passengers
                .filter(p => !p.checkedInFlag)
                .map(p => p.passenger_id);

            return allPassengerIds.every(id => selectedPassengers.includes(id));
        }
        return false;
    };

    const handleMyBookings = () => {
        navigate('/user/mybookings');
      };

    const handleCheckIn = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            toast.error("User not logged in.");
            return;
        }
        try {
            const response = await fetch('http://localhost:8080/api/user/checkin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(selectedPassengers),
            });

            if (response.ok) {
                const message = await response.text(); // Read response as text
                toast.success(message);
                fetchBookings(); // Refresh bookings after check-in
                setSelectedPassengers([]); // Clear selected passengers
            } else {
                const message = await response.text(); // Read response as text
                toast.error(`Failed to check in passengers: ${message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error occurred while checking in passengers');
        }
    };

    const handleToggle = (bookingId) => {
        setOpenBookingId(openBookingId === bookingId ? null : bookingId);
    };
    const containerStyle = {
        maxWidth: '900px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '8px'
    };
    
    return (
        <div>
        <div style={{
            background: 'linear-gradient(to bottom right, #f7c6c5, #fff)',
            minHeight: '100vh',
            color: '#000',
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${flight})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
          }}>    
            <CustomNavbar role='User' />
            
              <h1 className="userQuery-header">Web-CheckIn</h1>
      
        <div style={containerStyle}>
            <ToastContainer />
            {bookings.length === 0 ? (
                <div className="alert alert-info" role="alert">
                    <h4 className="alert-heading">No Records Found</h4>
                    <p>Your Bookings Already Checked-IN. Please refer My bookings tab for Your Booking Details.</p>
                </div>
            ) : (
                bookings.map(booking => (
                    <div key={booking.bookingId} className="card mb-4">
                        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                            <div>
                                Booking ID: {booking.bookingId}
                            </div>
                            <button 
                                className="btn btn-light btn-sm"
                                onClick={() => handleToggle(booking.bookingId)}
                            >
                                {openBookingId === booking.bookingId ? 'Hide Details' : 'Show Details'}
                            </button>
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">Flight: {booking.flight.flightNumber} - {booking.flight.flightName}</h5>
                            <p className="card-text">Source: {booking.flight.source}</p>
                            <p className="card-text">Destination: {booking.flight.destination}</p>
                            <p className="card-text">Scheduled Date: {booking.flight.flightScheduledDate}</p>
                            <Collapse in={openBookingId === booking.bookingId}>
                            <div>
                                    <div className="d-flex justify-content-end mb-3">
                                        <div className="form-check form-check-inline mr-3">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                checked={isAllPassengersSelected(booking.bookingId)}
                                                onChange={() => handleSelectAll(booking.bookingId, !isAllPassengersSelected(booking.bookingId))}
                                            />
                                            <label className="form-check-label">Select All</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                checked={selectedPassengers.length === 0}
                                                onChange={() => handleUnselectAll(booking.bookingId)}
                                                disabled={selectedPassengers.length === 0}
                                            />
                                            <label className="form-check-label">Unselect All</label>
                                        </div>
                                    </div>
                                    <ul className="list-group">
                                        {booking.passengers.map(passenger => (
                                            <li key={passenger.passenger_id} className="list-group-item d-flex justify-content-between align-items-center">
                                                <div>
                                                    <strong>{passenger.first_name} {passenger.last_name}</strong><br/>
                                                    Seat: {passenger.seat_number} - Checked In: {passenger.checkedInFlag ? 'Yes' : 'No'}
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input ml-2"
                                                    checked={selectedPassengers.includes(passenger.passenger_id)}
                                                    onChange={() => handleSelectPassenger(passenger.passenger_id)}
                                                    disabled={passenger.checkedInFlag}
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </Collapse>
                        </div>
                    </div>
                ))
            )}
            {selectedPassengers.length > 0 && bookings.length > 0 && (
                <button className="btn btn-primary mt-3" onClick={handleCheckIn}>Check In Selected Passengers</button>
            )}
        </div>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <Button variant="primary" onClick={handleMyBookings}>Go to My Booking Page</Button>
    </div>
   
        </div>
         <footer className="userQuery-footer">
         <p>&copy; 2024 SwayAirApp. All rights reserved.</p>
       </footer>
       </div>
    );
};
export default UserCheckIn;
