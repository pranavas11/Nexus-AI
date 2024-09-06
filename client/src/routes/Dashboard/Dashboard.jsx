import React, { useRef } from 'react';
import { useNavigate } from "react-router-dom";
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const textAreaRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const text = e.target.text.value;
        if (!text) return;
        //mutation.mutate(text);
    };

    // auto-resize function for textarea
    const autoResize = (event) => {
        const textarea = event.target;
        textarea.style.height = '50px'; // Reset height to auto to calculate new height
        textarea.style.height = `${textarea.scrollHeight}px`; // Set the height based on content
    };

    return (
        <div className='dashboardPage'>
            <div className='texts'>
                <div className='logo'>
                    <img src="/logo.png" alt="Nexus Logo" />
                    <h1>NEXUS AI</h1>
                </div>

                <div className='options'>
                    <div className='option'>
                        <img src="/chat.png" alt="Create a New Chat" />
                        <span style={{ textAlign: 'center', color: 'greenyellow' }}><b>Create a New Chat</b></span>
                    </div>
                    <div className="option">
                        <img src="/image.png" alt="Analyze Images" />
                        <span style={{ textAlign: 'center', color: 'orange' }}><b>Analyze Images</b></span>
                    </div>
                    <div className="option">
                        <img src="/code.png" alt="Help me with my Code" />
                        <span style={{ textAlign: 'center', color: 'yellow' }}><b>Help me with my Code</b></span>
                    </div>
                </div>
            </div>

            <div className='formContainer'>
                <form onSubmit={handleSubmit} autocomplete="off">
                    {/* <input type='text' name="text" placeholder='Message Nexus AI' /> */}
                    <textarea name="text" placeholder='Message Nexus AI' className='messageInput' ref={textAreaRef} onInput={autoResize} />
                    <button><img src='/arrow.png' alt='Send' /></button>
                </form>
            </div>
        </div>
    );
}

export default Dashboard;