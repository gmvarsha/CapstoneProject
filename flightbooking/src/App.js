import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Pages/Login/Login';
import DefaultPage from './Pages/DefaultPage/DefaultPage';
import AdminLogin from './Pages/AdminLogin/AdminLogin';
import UserSignUp from './Pages/SignUp/UserSignUp';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
        <Route path='/' element={<DefaultPage/>}/>
          <Route exact path="/user/login" element={<Login/>} />
          <Route path="/user/signup" element={<UserSignUp/>} />
         
          
         {/* <Route path="/user/dashboard" element={<Dashboard/>} /> */}
         
         {/* <Route path="/user/userbooking" element={<UserBooking/>}/> */}
         <Route path="/admin/adminlogin" element={<AdminLogin/>}/>
        </Routes>

      </div>
    </Router>
  );
}

export default App;
