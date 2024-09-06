import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import './Homepage.css';

const Homepage = () => {
    const [typingStatus, setTypingStatus] = useState("human1");

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
                    <div className='chat'>
                        <img src={typingStatus === "human1" ? "/human1.jpeg" : typingStatus === "human2" ? "/human2.jpeg" : "/bot.png"} alt="auto typing animation" />
                        <TypeAnimation
                            sequence={[
                                // Same substring at the start will only be typed out once, initially
                                "Alex: We produce food for Mice",
                                3000,
                                () => {
                                    setTypingStatus("bot");
                                },
                                "Nexus: We produce food for Hamsters",
                                3000,
                                () => {
                                    setTypingStatus("human2");
                                },
                                "Emily: We produce food for Guinea Pigs",
                                3000,
                                () => {
                                    setTypingStatus("bot");
                                },
                                "Nexus: We produce food for Chinchillas",
                                3000,
                                () => {
                                    setTypingStatus("human1");
                                },
                            ]}
                            wrapper="span"
                            repeat={Infinity}
                            cursor={true}
                            omitDeletionAnimation={true}
                        />
                    </div>
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