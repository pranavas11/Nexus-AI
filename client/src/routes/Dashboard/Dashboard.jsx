import React, { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import './Dashboard.css';

const Dashboard = () => {
    const [inputValue, setInputValue] = useState('');
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const textAreaRef = useRef(null);

    // creates a new chat on the dashboard page by sending a `POST`
    // request to the backend which validates the session and creates
    // a new chat channel with its own unique chat ID found in the URI.
    const mutation = useMutation({
        mutationFn: (text) => {
            return fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/chats`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text }),
            }).then((res) => res.json());
        },
        onSuccess: (id) => {
            // invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ["userChats"] });
            navigate(`/dashboard/chats/${id}`);
        },
    });

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     const text = e.target.text.value;
    //     if (!text) return;
    //     mutation.mutate(text);
    // };

    // auto-resize function for textarea
    const autoResize = (event) => {
        const textarea = event.target;
        textarea.style.height = '50px'; // Reset height to auto to calculate new height
        textarea.style.height = `${textarea.scrollHeight}px`; // Set the height based on content
    };

    const handleKeyPress = async (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();                         // prevents new line
            const text = event.target.value;                // get the text directly from the textarea
            if (!text.trim()) return;                       // check if text is empty
            mutation.mutate(text);
        }
    };

    const handleInputChange = (event) => {
        setInputValue(event.target.value); // update state when the input changes
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const text = inputValue.trim();
        if (!text) return;
        mutation.mutate(text);
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
                        <span style={{ textAlign: 'center', color: 'greenyellow' }}><b>Tell me a Story!</b></span>
                    </div>
                    <div className="option">
                        <img src="/image.png" alt="Analyze Images" />
                        <span style={{ textAlign: 'center', color: 'orange' }}><b>Analyze Images</b></span>
                    </div>
                    <div className="option">
                        <img src="/code.png" alt="Help me with my Code" />
                        <span style={{ textAlign: 'center', color: 'yellow' }}><b>Help me with My Code</b></span>
                    </div>
                </div>
            </div>

            <div className='formContainer'>
                <form onSubmit={handleSubmit} autoComplete="off">
                    {/* <input type='text' name="text" placeholder='Message Nexus AI' /> */}
                    <textarea
                        name="text"
                        placeholder='Enter a Short Description of the Chat To Get Started!'
                        className='messageInput'
                        ref={textAreaRef}
                        // onInput={autoResize}
                        onInput={(e) => {
                            autoResize(e);
                            handleInputChange(e);
                        }}
                        onKeyDown={handleKeyPress}
                    />
                    <button className={inputValue.trim().length > 0 ? 'active' : ''}><img src='/arrow.png' alt='Send' /></button>
                </form>
            </div>
        </div>
    );
}

export default Dashboard;