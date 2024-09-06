import React from 'react';
import { useLocation } from "react-router-dom";
import NewPrompt from '../../components/Prompt/NewPrompt';
import './Chat.css';

const Chat = () => {
    return (
        <div className='chatPage'>
            <div className='wrapper'>
                <div className='chat'>
                    <div className='message'>Test message from AI</div>
                    <div className='message user'>Test message from User</div>
                    <div className='message'>Test message from AI</div>
                    <div className='message user'>Test message from User</div>
                    <div className='message'>Test message from AI</div>
                    <div className='message user'>Test message from User</div>
                    <div className='message'>Test message from AI</div>
                    <div className='message user'>Test message from User</div>
                    <div className='message'>Test message from AI</div>
                    <div className='message user'>Test message from User</div>
                    <div className='message'>Test message from AI</div>
                    <div className='message user'>Test message from User</div>
                    <div className='message'>Test message from AI</div>
                    <div className='message user'>Test message from User</div>
                    <div className='message'>Test message from AI</div>
                    <div className='message user'>Test message from User</div>
                    <div className='message'>Test message from AI</div>
                    <div className='message user'>Test message from User</div>
                    <div className='message'>Test message from AI</div>
                    <div className='message user'>Test message from User</div>
                    <NewPrompt />
                </div>
            </div>
        </div>
    )
}

export default Chat;