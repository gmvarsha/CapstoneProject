import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import flight from '../../flight2.jpg';

const UserSignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:8080/api/user/signUp', {
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
      if (error.response && error.response.status === 400) {
        setError('Invalid data provided. Please check your inputs and try again.');
      } else {
        setError('Failed to sign up. Please try again later.');
      }
    }
  };

  const roles = ['User', 'Admin'];

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
      }}
    >
      <div className="card shadow" style={{ width: '90%', maxWidth: '300px', padding: '20px', backgroundColor: '#f7c6c5' }}>
        <div className="card-body">
          <h2 className="card-title text-center mb-4" style={{ fontSize: '1.5rem' }}>User Sign Up</h2>
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
                style={{ fontSize: '1rem' }}
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
                style={{ fontSize: '1rem' }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="role" className="form-label" style={{ fontSize: '1rem' }}>
                Role:
              </label>
              <select
                id="role"
                className="form-select"
                value={role}
                onChange={handleRoleChange}
                required
                style={{ fontSize: '1rem' }}
              >
                <option value="">Select a role</option>
                {roles.map((role, index) => (
                  <option key={index} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading} style={{ fontSize: '1rem' }}>
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>
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

export default UserSignUp;


// // UserSignUp.js
// import React, { useState } from 'react';
// import './UserSignUp.css'; // Import the UserSignUp.css file for styles
// import { useNavigate } from "react-router-dom";
// import axios from 'axios';
// import Loading from '../../components/Loading/Loading';



// const UserSignUp = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [fullName, setFullName] = useState('');
//   const [role, setRole] = useState('');
//   const [loading, setLoading] = useState(false);
//   let navigate = useNavigate();


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       const response = await axios.post('http://localhost:8080/api/user/signUp', {
//         email: email,
//         password: password,
//         role:role

//       });

//       console.log("signup sucess");
//       setLoading(false);
//       console.log(response)
//       if (response.status === 201) {
//         navigate('/user/login');
//       }

//     } catch (error) {
//       console.error('Login error');
//     }
//   };
//   let roles=['User','Admin']
//   return (
//     <div className="user-signup-container">
//       {loading && <Loading/>}
//       <h2 className="user-signup-title">User Sign Up</h2>
//       <form onSubmit={handleSubmit} className="user-signup-form">
//         {/* <div className="form-group">
//           <label htmlFor="fullName">Full Name:</label>
//           <input
//             type="text"
//             id="fullName"
//             value={fullName}
//             onChange={(e) => setFullName(e.target.value)}
//             required
//           />
//         </div> */}
//         <div className="form-group">
//           <label htmlFor="email">Email:</label>
//           <input
//             type="email"
//             id="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="password">Password:</label>
//           <input
//             type="password"
//             id="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="role">Role:</label>
//           <select
//             id="role"
//             value={role}
//             onChange={(e) => setRole(e.target.value)}
//             required
//           >
//             <option value="">Select a role</option>
//             {roles.map((role, index) => (
//               <option key={index} value={role}>{role}</option>
//             ))}
//           </select>
//         </div>
//         <button type="submit" className="signup-button">
//           Sign Up
//         </button>
//       </form>
//     </div>
//   );
// };

// export default UserSignUp;
