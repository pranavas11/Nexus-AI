import React, { useState } from 'react';
import { Link } from "react-router-dom";
import './Homepage.css';

const Homepage = () => {
    return (
        <div className='homepage'>
            <img src="/orbital.png" alt="orbital background" className="orbital" />
            <div className='left'>
                <h1>NEXUS AI</h1>
                <h2>Supercharge your creativity and productivity!</h2>
                <h3>Your personal AI companion for smarter, faster solutions.</h3>
                <Link to="/dashboard">Get Started</Link>
            </div>
            <div className='right'>
                <div className='imgContainer'>
                    <div className='bgContainer'>
                        <div className='bg'></div>
                    </div>
                    <img src="/bot.png" alt="bot animation" className='bot' />
                    <div className='chat'></div>
                </div>
            </div>
            <div className='terms'>
                <img src='/logo.png' alt="" />
                <div className='links'>
                    <Link to="/">Terms of Service</Link>
                    <Link to="/">Privacy Policy</Link>
                </div>
            </div>
        </div>
    )
}

export default Homepage;