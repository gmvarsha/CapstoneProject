import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Navbar, Nav, Modal, Form, Card, Col, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Loading from '../../components/Loading/Loading';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import CustomNavbar from '../../components/Navbar';
import flight from '../../flight2.jpg';

const UserBooking = () => {
  const [sourceCity, setSourceCity] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [error, setError] = useState('');
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredFlights, setFilteredFlights] = useState([]);

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [timeFrom, setTimeFrom] = useState('');
  const [timeTo, setTimeTo] = useState('');
  const [to, setTo] = useState(null);
  const [from, setFrom] = useState(null);
  const [stop, setStop] = useState('');
  const [type, setType] = useState('');
  const [isFlightsAvailable, setIsFlightAvailable] = useState(false);
  const navigate = useNavigate();

  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad'];
  const stops = ['Non-stop', 'Single stop', 'Two stops']
  const flightTypes = ["Commercial", 'Charter']
  const handleTravelDateChange = (event) => {
    setTravelDate(event.target.value);
  };

  const handleFilterSubmit = (event) => {
    event.preventDefault();
    setShowFilterModal(false);

    const filtered = flights.filter((flight) => {
      if (filterType === "departure" || filterType === "arrival") {
        const time = filterType === 'departure' ? flight.departureTime : flight.arrivalTime;
        return (!timeFrom || time >= timeFrom) && (!timeTo || time <= timeTo);
      }
      else if (filterType == "price") {
        return (flight.price >= from) && (flight.price <= to);

      }
      else if (filterType == "stops" || filterType == "type") {
        // const filterInput= filterType=="stops" ? flight.stops: flight.flightType
        // console.log(filterInput,"????")
        if (filterType == "stops") {
          console.log(filterType, flight.stops.toLowerCase() == stop.toLowerCase())
          return flight.stops.toLowerCase() === stop.toLowerCase()
        }
        else {
          console.log(filterType)

          return flight.flightType.toLowerCase() === type.toLowerCase()

        }

      }
    });

    setFilteredFlights(filtered);
  };



  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (sourceCity === destinationCity) {
      setFlights([])
      setError('Source and destination cannot be the same.');
      setTimeout(() => setError(''), 3000)

      return;
    }

    try {
      setLoading(true);
      
      // const response = await axios.get('http://localhost:5000/flights')

      const response = await axios.get('http://localhost:8080/flights/getflights', {
        params: {
          source: sourceCity,
          destination: destinationCity,
          departureDate: travelDate
        }
      });
      console.log(response.data)
      if (response.data) {
        setLoading(false);
        setFlights(response.data);
        setIsFlightAvailable(true)
      }

    } catch (error) {
      setLoading(false);
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    // Reset filtered flights when flights change
    setFilteredFlights([]);
  }, [flights]);

  const handleBookingTicket = (flight) => {
    navigate('/user/bookFlight', { state: { flight } })
  }
  const today = new Date().toISOString().split('T')[0];

  return (
          <div style={{
      background: 'linear-gradient(to bottom right, #f7c6c5, #fff)',
      minHeight: '100vh',
      color: '#000',
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${flight})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <CustomNavbar role='User' />

      <Container className="py-4">
        <Card className="p-4" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 className="text-center mb-4" style={{ fontSize: '1.5rem' }}>Search for Flights</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Row>
                <Col>
                  <Form.Label><b>Source City:</b></Form.Label>
                  <Form.Select
                    value={sourceCity}
                    onChange={(e) => setSourceCity(e.target.value)}
                    required
                  >
                    <option value="">Select a source city</option>
                    {cities.map((city, index) => (
                      <option key={index} value={city}>{city}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col>
                  <Form.Label><b>Destination City:</b></Form.Label>
                  <Form.Select
                    value={destinationCity}
                    onChange={(e) => setDestinationCity(e.target.value)}
                    required
                  >
                    <option value="">Select a destination city</option>
                    {cities.map((city, index) => (
                      <option key={index} value={city}>{city}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col>
                  <Form.Label><b>Travel Date:</b></Form.Label>
                  <Form.Control
                    type="date"
                    value={travelDate}
                    min={today}
                    onChange={handleTravelDateChange}
                    required
                  />
                </Col>
              </Row>
            </Form.Group>

            {error && <p className="text-danger">{error}</p>}

            <div className="text-center">
              <Button type="submit" variant="primary">Search Flights</Button>
            </div>
          </Form>

        </Card>


        {loading && <Loading />}

        {
          isFlightsAvailable && (
            <Container className="py-4">
              <h2 className="text-center mb-4" style={{ fontSize: '1.5rem' }}>Available Flights</h2>
              <div style={{ maxHeight: "230px", overflowY: 'auto' }}>
                <Table striped bordered hover >
                  <thead>
                    <tr>
                      <th>Flight Number</th>
                      <th>Source</th>
                      <th>Destination</th>
                      <th>Departure Date</th>
                      <th>
                        Departure Time
                        {flights.length > 0 && <FontAwesomeIcon
                          icon={faFilter}
                          onClick={() => {
                            setFilterType('departure');
                            setShowFilterModal(true);
                          }}
                          style={{ cursor: 'pointer', marginLeft: '5px' }}
                        />}
                      </th>
                      <th>Arrival Date</th>
                      <th>
                        Arrival Time
                        {flights.length > 0 && <FontAwesomeIcon
                          icon={faFilter}
                          onClick={() => {
                            setFilterType('arrival');
                            setShowFilterModal(true);
                          }}
                          style={{ cursor: 'pointer', marginLeft: '5px' }}
                        />}
                      </th>
                      <th>
                        Seats Available

                      </th>
                      <th>
                        Stops
                        {flights.length > 0 && <FontAwesomeIcon
                          icon={faFilter}
                          onClick={() => {
                            setFilterType('stops');
                            setShowFilterModal(true);
                          }}
                          style={{ cursor: 'pointer', marginLeft: '5px' }}
                        />}
                      </th>
                      <th>
                        Flight Type
                        {flights.length > 0 && <FontAwesomeIcon
                          icon={faFilter}
                          onClick={() => {
                            setFilterType('type');
                            setShowFilterModal(true);
                          }}
                          style={{ cursor: 'pointer', marginLeft: '5px' }}
                        />}
                      </th>
                      <th>Price  {flights.length > 0 && <FontAwesomeIcon
                        icon={faFilter}
                        onClick={() => {
                          setFilterType('price');
                          setShowFilterModal(true);
                        }}
                        style={{ cursor: 'pointer', marginLeft: '5px' }}
                      />}</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(filteredFlights.length > 0 ? filteredFlights : flights).map((flight, index) => (
                      <tr key={index}>
                        <td>{flight.flightNumber}</td>
                        <td>{flight.source}</td>
                        <td>{flight.destination}</td>
                        <td>{flight.departureDate}</td>
                        <td>{flight.departureTime}</td>
                        <td>{flight.arrivalDate}</td>
                        <td>{flight.arrivalTime}</td>
                        <td>{flight.seats}</td>
                        <td>{flight.stops}</td>
                        <td>{flight.flightType}</td>
                        <td>{flight.price}</td>
                        <td><Button variant="primary" onClick={() => {
                          handleBookingTicket(flight)
                        }}>Book</Button></td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {(filteredFlights.length === 0 && flights.length === 0) && (
                  <p className="text-center">No rows to show</p>
                )}
              </div>
            </Container>
          )
        }
      </Container>

      <Modal show={showFilterModal} onHide={() => setShowFilterModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Filter {filterType === 'departure' ? 'Departure Time' :
            filterType === 'arrival' ? 'Arrival Time' :
              filterType === 'price' ? 'Price' : filterType === 'stops' ? 'Stops' : 'Flight Type'} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFilterSubmit}>
            {(filterType === "departure" || filterType === "arrival" || filterType == "price") &&
              <Form.Group controlId="timeFrom">
                <Form.Label>From</Form.Label>
                {filterType === "departure" || filterType === "arrival" ?
                  <Form.Control
                    type="time"
                    value={timeFrom}
                    onChange={(e) => setTimeFrom(e.target.value)}
                  /> :
                  <Form.Control
                    type="number"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                  />

                }
              </Form.Group>
            }
            {(filterType === "stops" || filterType === "type") &&
              <Form.Select name="stops" value={filterType == "stops" ? stop : type} onChange={(e) => filterType == "stops" ? setStop(e.target.value) : setType(e.target.value)} required>
                <option value="">{filterType == "stops" ? "Select stop type" : "Select flight type"}</option>
                {(filterType === "stops" ? stops : flightTypes).map((s, index) => (
                  <option key={index} value={s}>{s}</option>
                ))}
              </Form.Select>
            }
            {(filterType === "departure" || filterType === "arrival" || filterType == "price") &&
              <Form.Group controlId="timeTo" className="mt-3">
                <Form.Label>To</Form.Label>
                {filterType === "departure" || filterType === "arrival" ?
                  <Form.Control
                    type="time"
                    value={timeTo}
                    onChange={(e) => setTimeTo(e.target.value)}
                  /> :
                  <Form.Control
                    type="number"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                  />}
              </Form.Group>
            }
            <Button variant="primary" type="submit" className="mt-3">
              Apply Filter
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <footer style={{
        position: 'fixed',
        left: 0,
        bottom: 0,
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        textAlign: 'center',
        padding: '10px 0',
      }}>
        <p style={{ margin: 0 ,'color': '#fff'}}>&copy; 2024 SwayAirApp. All rights reserved.</p>
      </footer>
    </div>
    
  );
};

export default UserBooking;