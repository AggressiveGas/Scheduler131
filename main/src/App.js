import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './Header';
import UserPageHeader from './UserPageHeader';
import Home from './util/Home';
import UserPage from './util/UserPage';
import Login from './util/Login';
import Register from './util/Register';
import Room from './util/Room';

export default function App() {
  const location = useLocation();
  const routesWithoutHeader = ['/login', '/register'];

  // Check if the current route should display the UserPageHeader
  const shouldDisplayUserPageHeader =
    location.pathname.startsWith('/WelcomeUser') || location.pathname.startsWith('/room');

  return (
    <React.Fragment>
      {shouldDisplayUserPageHeader ? <UserPageHeader /> : <Header />}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/room" element={<Room />} />

        {/*Basically the UserPage will display UserPageHeader instead of Header*/}
        <Route
          path="/WelcomeUser/:userId"
          element={<UserPage shouldDisplayHeader={!shouldDisplayUserPageHeader} />}
        />
      </Routes>
    </React.Fragment>
  );
}

