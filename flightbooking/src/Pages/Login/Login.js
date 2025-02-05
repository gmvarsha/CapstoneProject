import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import flight from '../../flight2.jpg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:8080/api/user/login', {
        email,
        password,
      });

      setLoading(false);

      if (response.status === 200 && response.data.role.toUpperCase() === "USER") {
        navigate('/user/userbooking');
      } else if (response.status === 200 && response.data.role.toUpperCase() === "ADMIN") {
        navigate('/admin/adminhome');
      }

      localStorage.setItem('userId', response.data.userId);
      localStorage.setItem('userRole', response.data.role);
      localStorage.setItem('firstName', response.data.firstName);
      localStorage.setItem('lastName', response.data.lastName);
      localStorage.setItem('email', response.data.email);

    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 401) {
        setError(error.response.data);
      }
    }
  };

  const handleSignUp = () => {
    navigate('/user/signup');
  };

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${flight})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        backgroundColor: '#333',
        color: '#fff',
        paddingTop: '50px', // Adjusted top padding for spacing
        paddingBottom: '50px', // Adjusted bottom padding for spacing
      }}
    >
      <div className="card shadow" style={{ width: '55%', maxWidth: '300px', height: 'auto', margin: 'auto', padding: '20px', backgroundColor: '#f7c6c5' }}>
        <div className="card-body">
          <h2 className="card-title text-center mb-4" style={{ fontSize: '1.5rem' }}>Login to Flight<br />Booking</h2>
          {error && <div className="alert alert-danger error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label" style={{ fontSize: '1rem' }}>
                Email:
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={handleEmailChange}
                required
                style={{ fontSize: '1rem', width: '100%' }} // Adjusted width of input
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label" style={{ fontSize: '1rem' }}>
                Password:
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                required
                style={{ fontSize: '1rem', width: '100%' }} // Adjusted width of input
              />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading} style={{ fontSize: '1rem' }}>
              {loading ? 'Loading...' : 'Login'}
            </button>
          </form>
        </div>
        <div className="card-footer text-center" style={{ backgroundColor: '#f7c6c5', borderTop: 'none' }}>
          <p className="mt-3 mb-0" style={{ fontSize: '1rem' }}>
            Don't have an account?{' '}
            <button className="btn btn-link" onClick={handleSignUp} style={{ fontSize: '1rem' }}>
              Sign Up
            </button>
          </p>
        </div>
      </div>
      {loading && (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
};

export default Login;