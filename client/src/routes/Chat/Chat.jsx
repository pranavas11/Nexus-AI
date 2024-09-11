import React, { useState } from 'react';
import { useLocation } from "react-router-dom";
import { IKImage } from 'imagekitio-react';
import { useQuery } from '@tanstack/react-query';
import Markdown from 'react-markdown';
import NewPrompt from '../../components/Prompt/NewPrompt';
import AIControls from '../../components/AIControls/AIControls';
import './Chat.css';

const Chat = () => {
    // from the URL of the chat, extract the chat ID using `useLocation()`
    const chatId = useLocation().pathname.split("/").pop();
    const [flag, setFlag] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);  // To store the question to be regenerated

    // fetch the specific chat and its history based on its chat ID from the backend
    const { isPending, error, data } = useQuery({
        queryKey: ["chat", chatId],
        queryFn: () =>
            fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/chats/${chatId}`, {
                credentials: "include",
            }).then((res) => res.json()),
    });

    // Function to trigger regeneration of a past conversation
    const regenerateResponse = (question) => {
        setSelectedQuestion(question);  // Set the selected question to be regenerated
        setFlag(true);  // Trigger regeneration flag
    };

    const parentToChild = () => {
        setFlag(true);
    }

    console.log(data);

    console.log(data?.history);
    console.log(data?.history.length);

    return (
        <div className='chatPage'>
            <div className='wrapper'>
                <div className='chat'>
                    {isPending
                        ? "Loading ..."
                        : error
                        ? "Something went wrong. Please try again."
                        : data?.history?.map((message, i) => (
                        <div key={i} className={message.role === "user" ? "questionWithImage" : "message ai"}>
                            {message.img && (message.img.length > 0) && (
                                <div>
                                    {message.img.map((newImg, j) => (
                                        <div key={j}>
                                            <IKImage
                                                urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                                                path={newImg}
                                                height="350"
                                                width="450"
                                                transformation={[{ height: 350, width: 450 }]}
                                                loading="lazy"
                                                lqip={{ active: true, quality: 30 }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                            { i === 0 ? <div style={{ display: 'none' }}>{data?.history[0].parts[0].text}</div> :
                                <div className={message.role === "user" ? "message user" : "message"}>
                                    <Markdown>{message.parts[0].text}</Markdown>
                                    {message.role === "model" && (
                                        <div>
                                            <AIControls
                                                answer={message.parts[0].text}
                                                onRegenerate={() => regenerateResponse(data?.history[i - 1]?.parts[0]?.text)}  // Use the previous question for regeneration
                                            />
                                        </div>
                                    )}
                                </div>
                            }
                        </div>
                    ))}
                    {data && <NewPrompt data={data} flag={parentToChild} regenerateQuestion={selectedQuestion} />}
                </div>
            </div>
        </div>
    )
}

export default Chat;