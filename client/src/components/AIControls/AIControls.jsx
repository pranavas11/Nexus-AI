// AIControls.jsx
import React, { useState } from 'react';
import { SoundFilled, CopyFilled, SyncOutlined } from '@ant-design/icons';
import './AIControls.css';

const AIControls = ({ answer, onRegenerate }) => {
    const [isSpeaking, setIsSpeaking] = useState(false);

    console.log("the answer in AIControls is: ", answer);

    const handleTextToSpeech = (text) => {
        if (isSpeaking) {
            window.responsiveVoice.cancel();
            setIsSpeaking(false);
        } else {
            if (window.responsiveVoice) {
                window.responsiveVoice.speak(text, "US English Male", {
                    onstart: () => setIsSpeaking(true),
                    onend: () => setIsSpeaking(false),
                    onerror: () => setIsSpeaking(false),
                });
            } else {
                console.error("ResponsiveVoice is not available.");
            }
        }
    };

    const handleCopy = () => {
        if (answer) {
            navigator.clipboard.writeText(answer).then(() => {
                alert('AI response copied to clipboard!');
            }, (err) => {
                console.error('Could not copy text: ', err);
            });
        }
    };

    const handleRegenerate = () => {
        if (onRegenerate) {
            onRegenerate(); // Call the regenerate function passed as a prop
        }
    };

    // Utility debounce function
    function debounce(func, wait = 300) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Use debounce to prevent multiple invocations too quickly
    const handleTextToSpeechDebounced = debounce(handleTextToSpeech, 900);

    return (
        <div className="ai-controls">
            <div className='icon-btn' onClick={() => handleTextToSpeechDebounced(answer)}>
                <SoundFilled />
                <span className="tooltip">Read Aloud</span>
            </div>
            <div className='icon-btn' onClick={handleCopy}>
                <CopyFilled />
                <span className="tooltip">Copy</span>
            </div>
            <div className='icon-btn' onClick={handleRegenerate}>
                <SyncOutlined spin />
                <span className="tooltip">Regenerate</span>
            </div>
        </div>
    );
};

export default AIControls;