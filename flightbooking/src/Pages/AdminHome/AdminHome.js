import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Container, Table, Button, Navbar, Nav, Alert, Modal, Form, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import CustomNavbar from '../../components/Navbar';
import flight from '../../flight2.jpg'

const AdminHome = () => {
  const [flights, setFlights] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [currentFlight, setCurrentFlight] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad'];
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    flightNumber: '',
    source: '',
    destination: '',
    departureDate: '',
    departureTime: '',
    arrivalDate: '',
    arrivalTime: '',
    price: '',
    stops:'',
        flightType:'',
        seats:''
  });
  const [deleteFlightId, setDeleteFlightId] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const modalRef = useRef(null); // Reference for the modal element


  useEffect(() => {
    axios
      .get('http://localhost:8080/flights/getAllflights')
      .then((response) => {
        setFlights(response.data);
      })
      .catch((error) => console.error('Error fetching flights:', error));
  }, []);
  useEffect(() => {
    if (errorMessage) {
      const modalBody = document.querySelector('.modal-body'); // Adjust selector based on your modal structure
      if (modalBody) {
        modalBody.scrollTop = 0; // Scroll to the top of the modal body
      }
    }
  }, [errorMessage]);
  const handleModalOpen = (flight = null) => {
    if (flight) {
      setIsUpdate(true);
      setCurrentFlight(flight);
      setFormData({
        flightNumber: flight.flightNumber,
        source: flight.source,
        destination: flight.destination,
        departureDate: flight.departureDate,
        departureTime: flight.departureTime,
        arrivalDate: flight.arrivalDate,
        arrivalTime: flight.arrivalTime,
        price: flight.price,
        stops:flight.stops,
        flightType:flight.flightType,
        seats:flight.seats
      });
    } else {
      setIsUpdate(false);
      setFormData({
        flightNumber: '',
        source: '',
        destination: '',
        departureDate: '',
        departureTime: '',
        arrivalDate: '',
        arrivalTime: '',
        price: '',
        stops:'',
        flightType:'',
        seats:''
      });
    }
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentFlight(null);
  };

  const handleDeleteFlight = (flightId) => {
    setDeleteFlightId(flightId);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteFlight = async () => {
    try {
      await axios.delete(`http://localhost:8081/flights/deleteflight/${deleteFlightId}`);
      setFlights(flights.filter(flight => flight.flightId !== deleteFlightId));
      setSuccessMessage('Flight deleted successfully.');
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Error deleting flight:', error);
    } finally {
      setShowDeleteConfirmation(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteFlightId(null);
    setShowDeleteConfirmation(false);
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    console.log(formData,";;;;;")

  };


  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (formData.source === formData.destination) {
      setErrorMessage('Source and destination cannot be the same.');
      setTimeout(() => setErrorMessage(''), 5000)

      return;
    }
    var [hours1, minutes1] = formData.departureTime.split(':').map(Number);
    var [hours2, minutes2] = formData.arrivalTime.split(':').map(Number);
    var difference_hours = hours2 - hours1;
    console.log(difference_hours)
    if (formData.departureDate == formData.arrivalDate && difference_hours < 1) {
      setErrorMessage('Difference between departure and arrival time should be atleast 1hr ');
      setTimeout(() => setErrorMessage(''), 5000)
      return;

    }

    console.log(errorMessage, formData)
    try {
      if (isUpdate) {
        const response = await axios.put(`http://localhost:8081/flights/updateflight/${currentFlight.flightId}`, formData);
        console.log(response, "??????")

        setFlights(flights.map(flight => (flight.flightId === currentFlight.flightId ? { ...flight, ...formData } : flight)));
        setSuccessMessage('Flight updated successfully.');
        handleModalClose();

      } else if (!isUpdate) {
        const response = await axios.post('http://localhost:8081/flights/addflight', formData);
        console.log(response.data, "klflkhfkl")
        setFlights(response.data);
        setSuccessMessage('Flight added successfully.');

      }

      setTimeout(() => setSuccessMessage(''), 3000);
      handleModalClose();


    } catch (error) {
      console.error('Error:', error);
    }
  };
  const stops = ['Non-stop', 'Single stop', 'Two stops']
  const flightTypes = ["Type1", 'Type2']
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

      <CustomNavbar role='Admin' />

      <Container className="py-4">
        <h2 className="text-center mb-3" style={{ fontSize: '1.5rem' }}>Available Flights</h2>
        <div style={{ "maxHeight": "350px", "overflowY": 'auto' }}>
          <Table striped bordered hover>
            <thead>
              <tr>
                {/* <th>Id</th> */}
                <th>Flight Number</th>
                <th>Source</th>
                <th>Destination</th>
                <th>Departure Date</th>
                <th>Departure Time</th>
                <th>Arrival Date</th>
                <th>Arrival Time</th>
                <th>Seats</th>
                <th>Stops</th>
                <th>Type</th>
                <th>Price</th>

                <th></th>
                <th></th>
              </tr>
            </thead>
            {console.log(flights, "lllllllll--")}
            <tbody>
              {flights.map((flight, index) => (
                <tr key={index}>
                  {/* <td>{flight.id}</td> */}
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
                  <td>
                    <Button variant="info" onClick={() => handleModalOpen(flight)}>Update</Button>
                  </td>
                  <td>
                    <Button variant="danger" onClick={() => handleDeleteFlight(flight.flightId)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <br />
        <Row className="justify-content-center">
          <Col xs="auto">
            <Button variant="primary" onClick={() => handleModalOpen()}>Add</Button>
          </Col>
        </Row>

        <Modal show={isModalOpen} onHide={handleModalClose} dialogClassName="modal-70w">
          <Modal.Header closeButton>
            <Modal.Title>{isUpdate ? 'Update Flight' : 'Add New Flight'}</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ maxHeight: 'calc(100vh - 130px)', overflowY: 'auto' }}>
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

            <Form onSubmit={handleFormSubmit}>
              <Form.Group controlId="formFlightNumber">
                <Form.Label>Flight Number</Form.Label>
                <Form.Control type="text" name="flightNumber" value={formData.flightNumber} onChange={handleFormChange} required />
              </Form.Group>
              <Form.Group controlId="formSource">
                <Form.Label>Source</Form.Label>
                <Form.Select name="source" value={formData.source} onChange={handleFormChange} required>
                  <option value="">Select source city</option>
                  {cities.map((city, index) => (
                    <option key={index} value={city}>{city}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group controlId="formDestination">
                <Form.Label>Destination</Form.Label>
                <Form.Select name="destination" value={formData.destination} onChange={handleFormChange} required>
                  <option value="">Select destination city</option>
                  {cities.map((city, index) => (
                    <option key={index} value={city}>{city}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group controlId="formDepartureDate">
                <Form.Label>Departure Date</Form.Label>
                <Form.Control type="date" name="departureDate" min={today} value={formData.departureDate} onChange={handleFormChange} required />
              </Form.Group>
              <Form.Group controlId="formDepartureTime">
                <Form.Label>Departure Time</Form.Label>
                <Form.Control type="time" name="departureTime" value={formData.departureTime} onChange={handleFormChange} required />
              </Form.Group>
              <Form.Group controlId="formArrivalDate">
                <Form.Label>Arrival Date</Form.Label>
                <Form.Control type="date" name="arrivalDate" min={formData.departureDate} value={formData.arrivalDate} onChange={handleFormChange} required />
              </Form.Group>
              <Form.Group controlId="formArrivalTime">
                <Form.Label>Arrival Time</Form.Label>
                <Form.Control type="time" name="arrivalTime" value={formData.arrivalTime} onChange={handleFormChange} required />
              </Form.Group>
              <Form.Group controlId="formSeats">
                <Form.Label>Seats</Form.Label>
                <Form.Control type="number" name="seats" value={formData.seats} onChange={handleFormChange} required />
              </Form.Group>
              <Form.Group controlId="formStops">
                <Form.Label>Stop Type</Form.Label>
                <Form.Select name="stops" value={formData.stops} onChange={handleFormChange} required>
                  <option value="">Select stop</option>
                  {stops.map((s, index) => (
                    <option key={index} value={s}>{s}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group controlId="formType">
                <Form.Label>Flight Type:</Form.Label>
                <Form.Select name="flightType" value={formData.flightType} onChange={handleFormChange} required>
                  <option value="">Select Flight Type</option>
                  {flightTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group controlId="formPrice">
                <Form.Label>Price</Form.Label>
                <Form.Control type="number" name="price" value={formData.price} onChange={handleFormChange} required />
              </Form.Group>
              <Modal.Footer style={{ justifyContent: 'center' }}>
                <Button variant="primary" style={{ alignItems: 'center' }} type="submit">{isUpdate ? 'Update' : 'Add'}</Button>
              </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>

        {successMessage && <Alert variant="success">{successMessage}</Alert>}
      </Container>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteConfirmation} onHide={handleCancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this flight?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelDelete}>Cancel</Button>
          <Button variant="danger" onClick={confirmDeleteFlight}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminHome;