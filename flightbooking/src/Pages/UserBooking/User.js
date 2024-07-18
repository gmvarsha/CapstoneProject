import React, { useState } from 'react';
import { Container, Table, Button, Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Loading from '../../components/Loading/Loading';
import { useNavigate } from 'react-router-dom';

const UserBooking = () => {
  const [sourceCity, setSourceCity] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [error, setError] = useState('');
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad'];

  const handleTravelDateChange = (event) => {
    setTravelDate(event.target.value);
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/user/login');
  };

  const handleHelp = () => {
    navigate('/user/help');
  };
const handleMyBookings=()=>{
  navigate('/user/mybookings')
}
  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (sourceCity === destinationCity) {
      setError('Source and destination cannot be the same.');
      return;
    }

    try {
      setLoading(true);

      const response = await axios.get('http://localhost:8080/flights/getflights', {
        params: {
          source: sourceCity,
          destination: destinationCity,
          departureDate: travelDate
        }
      });

      setLoading(false);
      setFlights(response.data);
    } catch (error) {
      setLoading(false);
      console.error('Error:', error);
    }
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
              <Nav.Link style={{color:"white"}} onClick={handleMenuToggle}>
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

      <Container className="py-4">
        <h2 className="text-center mb-4" style={{ fontSize: '1.5rem' }}>Search for Flights</h2>

        <form onSubmit={handleSubmit} className="mb-4">
          <div className="row justify-content-center">
            <div className="col-12 col-md-4 mb-3">
              <label htmlFor="sourceCity" className="form-label">Source City:</label>
              <select
                id="sourceCity"
                className="form-select"
                value={sourceCity}
                onChange={(e) => setSourceCity(e.target.value)}
                required
              >
                <option value="">Select a source city</option>
                {cities.map((city, index) => (
                  <option key={index} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-4 mb-3">
              <label htmlFor="destinationCity" className="form-label">Destination City:</label>
              <select
                id="destinationCity"
                className="form-select"
                value={destinationCity}
                onChange={(e) => setDestinationCity(e.target.value)}
                required
              >
                <option value="">Select a destination city</option>
                {cities.map((city, index) => (
                  <option key={index} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-4 mb-3">
              <label htmlFor="travelDate" className="form-label">Travel Date:</label>
              <input
                type="date"
                id="travelDate"
                className="form-control"
                value={travelDate}
                onChange={handleTravelDateChange}
                required
              />
            </div>
          </div>

          {error && <p className="text-danger">{error}</p>}

          <div className="text-center">
            <button type="submit" className="btn btn-primary">Search Flights</button>
          </div>
        </form>

        {loading && <Loading />}

        <Container className="py-4">
          <h2 className=" text-center mb-4" style={{ fontSize: '1.5rem' }}>Available Flights</h2>
          <div style={{"maxHeight": "230px","overflowY": 'auto'}}>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Flight Number</th>
                  <th>Source</th>
                  <th>Destination</th>
                  <th>Departure Date</th>
                  <th>Departure Time</th> 
                  <th>Arrival Date</th>
                  <th>Arrival Time</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {flights.map((flight, index) => (
                  <tr key={index}>
                    <td>{flight.flightNumber}</td>
                    <td>{flight.source}</td>
                    <td>{flight.destination}</td>
                    <td>{flight.departureDate}</td>
                    <td>{flight.departureTime}</td>
                    <td>{flight.arrivalDate}</td>
                    <td>{flight.arrivalTime}</td>
                    <td>{flight.price}</td>
                    <td><Button variant="primary">Book</Button></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Container>
      </Container>
    </div>
  );
};

export default UserBooking;






// import React, { useState } from 'react';
// import { Container, Table, Button, Navbar, Nav } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import axios from 'axios';
// import Loading from '../../components/Loading/Loading';
// import { useNavigate } from 'react-router-dom';

// const UserBooking = () => {
//   const [sourceCity, setSourceCity] = useState('');
//   const [destinationCity, setDestinationCity] = useState('');
//   const [travelDate, setTravelDate] = useState('');
//   const [error, setError] = useState('');
//   const [flights, setFlights] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad'];

//   const handleTravelDateChange = (event) => {
//     setTravelDate(event.target.value);
//   };
//   const handleLogout = () => {
//     localStorage.removeItem('userId');
//     navigate('/user/login');
//   };
//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setError('');

//     if (sourceCity === destinationCity) {
//       setError('Source and destination cannot be the same.');
//       return;
//     }

//     try {
//       setLoading(true);

//       const response = await axios.get('http://localhost:8080/flights/getflights', {
//         params: {
//           source: sourceCity,
//           destination: destinationCity,
//           departureDate: travelDate
//         }
//       });

//       setLoading(false);
//       setFlights(response.data);
//     } catch (error) {
//       setLoading(false);
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <div style={{
//       background: 'linear-gradient(to bottom right, #f7c6c5, #fff)',
//       minHeight: '100vh',
//       color: '#000',
//     }}>
//       <Navbar bg="dark" variant="dark">
//         <Container fluid>
//           <Navbar.Brand href="#home" className="ms-0 me-auto">Flight Booking App</Navbar.Brand>
//           <Navbar.Toggle aria-controls="basic-navbar-nav" />
//           <Navbar.Collapse id="basic-navbar-nav">
//             <Nav className="ms-auto">
//               <Nav.Link style={{color:"white"}}>My Bookings</Nav.Link>
//               <Nav.Link style={{color:"white"}}  onClick={handleLogout}>Logout</Nav.Link>
//             </Nav>
//           </Navbar.Collapse>
//         </Container>
//       </Navbar>


//       <Container className="py-4">
//         <h2  className="text-center mb-4" style={{ fontSize: '1.5rem' }}>Search for Flights</h2>

//         <form onSubmit={handleSubmit} className="mb-4">
//           <div className="row justify-content-center">
//             <div className="col-12 col-md-4 mb-3">
//               <label htmlFor="sourceCity" className="form-label">Source City:</label>
//               <select
//                 id="sourceCity"
//                 className="form-select"
//                 value={sourceCity}
//                 onChange={(e) => setSourceCity(e.target.value)}
//                 required
//               >
//                 <option value="">Select a source city</option>
//                 {cities.map((city, index) => (
//                   <option key={index} value={city}>{city}</option>
//                 ))}
//               </select>
//             </div>

//             <div className="col-12 col-md-4 mb-3">
//               <label htmlFor="destinationCity" className="form-label">Destination City:</label>
//               <select
//                 id="destinationCity"
//                 className="form-select"
//                 value={destinationCity}
//                 onChange={(e) => setDestinationCity(e.target.value)}
//                 required
//               >
//                 <option value="">Select a destination city</option>
//                 {cities.map((city, index) => (
//                   <option key={index} value={city}>{city}</option>
//                 ))}
//               </select>
//             </div>

//             <div className="col-12 col-md-4 mb-3">
//               <label htmlFor="travelDate" className="form-label">Travel Date:</label>
//               <input
//                 type="date"
//                 id="travelDate"
//                 className="form-control"
//                 value={travelDate}
//                 onChange={handleTravelDateChange}
//                 required
//               />
//             </div>
//           </div>

//           {error && <p className="text-danger">{error}</p>}

//           <div className="text-center">
//             <button type="submit" className="btn btn-primary">Search Flights</button>
//           </div>
//         </form>

//         {loading && <Loading />}

//         <Container className="py-4">
//           <h2 className=" text-center mb-4" style={{ fontSize: '1.5rem' }}>Available Flights</h2>
//           <div style={{"maxHeight": "230px","overflowY": 'auto'}}>
//           <Table striped bordered hover>
//             <thead>
//               <tr>
//                 <th>Flight Number</th>
//                 <th>Source</th>
//                 <th>Destination</th>
//                 <th>Departure Date</th>
//                 <th>Departure Time</th> 
//                 <th>Arrival Date</th>
//                 <th>Arrival Time</th>
//                 <th>Price</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {flights.map((flight, index) => (
//                 <tr key={index}>
//                   <td>{flight.flightNumber}</td>
//                   <td>{flight.source}</td>
//                   <td>{flight.destination}</td>
//                   <td>{flight.departureDate}</td>
//                   <td>{flight.departureTime}</td>
//                   <td>{flight.arrivalDate}</td>
//                   <td>{flight.arrivalTime}</td>
//                   <td>{flight.price}</td>
//                   <td><Button variant="primary">Book</Button></td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//           </div>
//         </Container>
//       </Container>
//     </div>
//   );
// };

// export default UserBooking;
