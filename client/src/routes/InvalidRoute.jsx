import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{
      textAlign: 'center',
      padding: '100px',
      backgroundColor: '#1c1c1c',   // dark background for contrast
      color: '#fff',                // white text for readability
      height: '100vh',              // full height of the viewport
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>404 - Page Not Found</h1>
      <p style={{
        fontSize: '1.2rem',
        marginBottom: '30px',
        color: '#b0b0b0',           // lighter shade for secondary text
      }}>
        Sorry, the page you're looking for doesn't exist.
      </p>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <p style={{
          color: 'green',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          border: '2px solid red',
          padding: '10px 20px',
          borderRadius: '5px',
          transition: 'background-color 0.3s ease, color 0.3s ease'
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = 'yellow'}
        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          Go Back to Homepage
        </p>
      </Link>
    </div>
  );
};

export default NotFound;
