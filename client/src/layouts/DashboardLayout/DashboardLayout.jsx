import React, { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Outlet, useNavigate } from 'react-router-dom';
import './DashboardLayout.css';

const DashboardLayout = () => {
  const { userID, isLoaded } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !userID) {
      navigate("/login");
    }
  }, [isLoaded, userID, navigate]);

  if (!isLoaded) return "Loading ...";

  return (
    <div className='dashboardLayout'>
      <div className='menu'>Hello from Dashboard Layout!</div>
      <div className='content'><Outlet /></div>
    </div>
  )
}

export default DashboardLayout;