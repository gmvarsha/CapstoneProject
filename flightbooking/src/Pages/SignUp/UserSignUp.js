import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import flight from '../../flight2.jpg';

const UserSignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleLogin = () => {
    navigate('/user/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      console.log(firstName,lastName)
      const response = await axios.post('http://localhost:8080/api/user/signUp', {
        firstName,
        lastName,
        email,
        password,
        role,
      });

      setLoading(false);

      if (response.status === 201) {
        navigate('/user/login');
      }
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 409) {
        setError('Email Id already exists!');
      } else {
        setError('Failed to sign up. Please try again later.');
      }
      setTimeout(() => setError(''), 5000);
    }
  };

  const roles = ['User', 'Admin'];

  const validatePassword = () => {
    const regexCapital = /[A-Z]/; // Regex for uppercase letter
    const regexSpecial = /[!@#$%^&*(),.?":{}|<>]/; // Regex for special characters

    // Check if password meets minimum length requirement
    if (password.length < 8) {
      return 'Password must be at least 8 characters long.';
    }
    // Check if password contains at least one uppercase letter
    if (!regexCapital.test(password)) {
      return 'Password must contain at least one uppercase letter.';
    }
    // Check if password contains at least one special character
    if (!regexSpecial.test(password)) {
      return 'Password must contain at least one special character (e.g., !@#$%^&*()).';
    }

    return ''; // Return empty string if password is valid
  };

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${flight})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        backgroundColor: '#333',
        color: '#fff',
        padding: '20px',
      }}
    >
      <div className="card shadow" style={{ width: '100%', maxWidth: '350px', backgroundColor: '#f7c6c5', padding: '20px', borderRadius: '10px' }}>
        <h2 className="card-title text-center mb-4" style={{ fontSize: '1.5rem' }}>User Sign Up</h2>
        {error && <div className="alert alert-danger text-center">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div >
            <label htmlFor="firstname" className="form-label" style={{ fontSize: '1rem' }}>First Name:</label>
            <input
              type="text"
              className="form-control"
              id="firstname"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              style={{ fontSize: '1rem',lineHeight:'0.5rem'  }}
            />
          </div>
          <div >
            <label htmlFor="lastname" className="form-label" style={{ fontSize: '1rem' }}>Last Name:</label>
            <input
              type="text"
              className="form-control"
              id="lastname"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              style={{ fontSize: '1rem',lineHeight:'0.5rem'  }}
            />
          </div>
          <div >
            <label htmlFor="email" className="form-label" style={{ fontSize: '1rem' }}>Email:</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={handleEmailChange}
              required
              style={{ fontSize: '1rem',lineHeight:'0.5rem'  }}
            />
          </div>
          <div >
            <label htmlFor="password" className="form-label" style={{ fontSize: '1rem' }}>Password:</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              required
              style={{ fontSize: '1rem' ,lineHeight:'0.5rem' }}
            />
            {password && validatePassword() && (
              <div className="text-danger" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {validatePassword()}
              </div>
            )}
          </div>
          <div >
            <label htmlFor="role" className="form-label" style={{ fontSize: '1rem' }}>Role:</label>
            <select
              id="role"
              className="form-select"
              value={role}
              onChange={handleRoleChange}
              required
              style={{ fontSize: '1rem',lineHeight:'1.5rem' }}
            >
              <option value="">Select a role</option>
              {roles.map((role, index) => (
                <option key={index} value={role}>{role}</option>
              ))}
            </select>
          </div>
          <br/>
          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ fontSize: '1rem' }}>
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </div>
        </form>
        <p className="text-center mt-2 mb-0" style={{ fontSize: '1rem' }}>
          Already have an account?{' '}
          <br/>
          <button className="btn btn-link" onClick={handleLogin} style={{ fontSize: '1rem' }}>Login</button>
        </p>
      </div>
      {loading && (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
};

export default UserSignUp;