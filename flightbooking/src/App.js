import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Pages/Login/Login';
// import DefaultPage from './Pages/DefaultPage/DefaultPage';
// import AdminLogin from './Pages/AdminLogin/AdminLogin';
import AdminHome from './Pages/AdminHome/AdminHome';

import UserSignUp from './Pages/SignUp/UserSignUp';
// import UserBooking from './Pages/UserBooking/UserBookingex';
import UserBooking from './Pages/UserBooking/User';
import ProtectedRoute from './Pages/Login/ProtectedRoute';
import UserQuery from './Pages/UserQuery/UserQuery';
import AdminReply from './Pages/AdminReply/AdminReply';
import MyQuery from './Pages/MyQuery/MyQuery';
import UserCheckIn from './Pages/UserCheckIn/UserCheckIn.js';



function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
        <Route path='/' element={<Login/>}/>
          <Route exact path="/user/login" element={<Login/>} />
          <Route path="/user/signup" element={<UserSignUp/>} />
         {/* <Route path="/user/dashboard" element={<Dashboard/>} /> */}
         <Route path="/user/userbooking" element={<ProtectedRoute element={<UserBooking />} requiredRole="User" />} />
          <Route path="/admin/adminhome" element={<ProtectedRoute element={<AdminHome />}  requiredRole="Admin" />} />
          <Route path="/user/help" element={<ProtectedRoute element={<UserQuery />}  requiredRole="User" />} />
          <Route path="/admin/queries" element={<ProtectedRoute element={<AdminReply />}  requiredRole="Admin" />}/>
          <Route path="/user/myQueries" element={<ProtectedRoute element={<MyQuery />}  requiredRole="User" />}/>
          <Route path="/user/userCheckin" element={<ProtectedRoute element={<UserCheckIn />}  requiredRole="User" />} />


         {/* <Route path="/user/userbooking" element={<UserBooking/>}/> */}
         {/* <Route path="/admin/adminlogin" element={<AdminLogin/>}/> */}
         {/* <Route path="/admin/adminhome" element={<AdminHome />}/>  */}

        </Routes>

      </div>
    </Router>
  );
}

export default App;
