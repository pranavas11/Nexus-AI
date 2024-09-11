import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from "react-router-dom";
import { IKImage } from "imagekitio-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Markdown from 'react-markdown';
import { SoundFilled, CopyFilled, SyncOutlined } from '@ant-design/icons';
import Upload from '../Upload/Upload';
import model from '../../lib/gemini';
//import './NewPrompt.css';
import './Prompt.css';

const NewPrompt = () => {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [isSpeaking, setIsSpeaking] = useState(false); // track whether speech is playing
    const [img, setImg] = useState({
        isLoading: false,
        error: "",
        dbData: {},
        aiData: {},
    });

    const queryClient = useQueryClient();

    const endRef = useRef(null);
    const formRef = useRef(null);




    /* ----------------------------- chat.jsx --------------------------------------------------------------*/
    // from the URL of the chat, extract the chat ID using `useLocation()`
    const chatId = useLocation().pathname.split("/").pop();

    // fetch the specific chat and its history based on its chat ID from the backend
    const { isPending, error, data } = useQuery({
        queryKey: ["chat", chatId],
        queryFn: () =>
            fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/chats/${chatId}`, {
                credentials: "include",
            }).then((res) => res.json()),
    });

    console.log(data);
    console.log(data?.history);
    console.log(data?.history.length);





    // const chat = model.startChat({
    //     history: [
    //         {
    //             role: "user",
    //             parts: [{ text: "Hello!" }],
    //         },
    //         {
    //             role: "model",
    //             parts: [{ text: "Great to meet you. What would you like to know?" }],
    //         },

    //     ],
    //     generationConfig: {
    //         //maxOutputTokens: 100;
    //     }
    // });

    const chat = model.startChat({
        history: data?.history.map(({ role, parts }) => ({
            role,
            parts: [{ text: parts[0].text }],
        })),
        generationConfig: {
            // maxOutputTokens: 100;
        },
    });

    useEffect(() => {
        endRef.current.scrollIntoView({ behavior: "smooth" });
    }, [data, question, answer, img.dbData]);

    // auto-resize function for textarea
    const autoResize = (event) => {
        const textarea = event.target;
        textarea.style.height = '50px';                         // reset to default height when resizing
        textarea.style.height = `${textarea.scrollHeight}px`;   // adjust based on scroll height
    };

    // update an existing user chat if new prompt input is provided by user
    const mutation = useMutation({
        mutationFn: () => {
            return fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/chats/${data._id}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    question: question.length ? question : undefined,
                    answer: answer,
                    img: img.dbData?.filePath || undefined,
                }),
            }).then((res) => res.json());
        },
        onSuccess: () => {
            queryClient
                .invalidateQueries({ queryKey: ["chat", data._id] })
                .then(() => {
                    formRef.current.reset();
                    setQuestion("");
                    setAnswer("");
                    setImg({
                        isLoading: false,
                        error: "",
                        dbData: {},
                        aiData: {},
                    });
                });
        },
        onError: (err) => {
            console.log(err);
        },
    });

    const genAI = async (text, isInitial) => {
        if (!isInitial) setQuestion(text);

        console.log("the value of question in genAI is: ", question);

        try {
            const result = await chat.sendMessageStream(
                Object.entries(img.aiData).length ? [img.aiData, text] : [text]
            );
            let accumulatedText = "";
            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                console.log(chunkText);
                accumulatedText += chunkText;
                setAnswer(accumulatedText);
            }
            //setImg({ isLoading: false, error: "", dbData: {}, aiData: {} });
            mutation.mutate();
        } catch (err) {
            console.log(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const text = e.target.text.value;
        console.log("the value of text in handleSubmit: ", text);
        if (!text) return;
        genAI(text, false);
    };

    const handleTextToSpeech = (text) => {
        // if already speaking, stop the speech and reset the state
        if (isSpeaking) {
            window.responsiveVoice.cancel();
            setIsSpeaking(false);               // update state to reflect that speaking has stopped
        } else {
            // start the speech and update the state
            if (window.responsiveVoice) {
                window.responsiveVoice.speak(text, "US English Male", {
                    onstart: () => setIsSpeaking(true),
                    onend: () => setIsSpeaking(false),          // automatically reset the state when speech finishes
                    onerror: () => setIsSpeaking(false),        // reset on error
                });
            } else {
                console.error("ResponsiveVoice is not available.");
            }
        }
    };

    // function to copy the AI response to the clipboard
    const handleCopy = () => {
        if (answer) {
            navigator.clipboard.writeText(answer).then(() => {
                alert('AI response copied to clipboard!');
            }, (err) => {
                console.error('Could not copy text: ', err);
            });
        }
    };

    // function to regenerate the AI response
    const handleRegenerate = () => {
        if (question) {
            genAI(question, true);                              // regenerate the response
        }
    };

    console.log("the question is: ", question);
    console.log("the answer is: ", answer);

    return (
        // <div onPaste={handlePaste}>
        <div>
            <div className='chatPage'>
                <div className='wrapper'>
                    <div className='chat'>
                        {isPending
                            ? "Loading ..."
                            : error
                                ? "Something went wrong. Please try again."
                                : data?.history?.map((message, i) => (
                                    <div key={i} className={message.role === "user" ? "questionWithImage" : "message ai"}>
                                        {message.img && (
                                            <IKImage
                                                urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                                                path={message.img}
                                                height="300"
                                                width="400"
                                                transformation={[{ height: 300, width: 400 }]}
                                                loading="lazy"
                                                lqip={{ active: true, quality: 30 }}
                                            />
                                        )}
                                        {i === 0 ? <div style={{ display: 'none' }}>{data?.history[0].parts[0].text}</div> :
                                            <div className={message.role === "user" ? "message user" : "message"}>
                                                <Markdown>{message.parts[0].text}</Markdown>
                                            </div>
                                        }
                                    </div>
                                ))}
                        {/* {data && <NewPrompt data={data} />} */}
                    </div>
                </div>
            </div>

            {img.isLoading && <div className=''>Loading...</div>}

            {img.dbData?.filePath && (
                <div className="msg userImage">
                    <IKImage
                        urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                        path={img.dbData?.filePath}
                        width="390"
                        transformation={[{ width: 390 }]}
                    />
                </div>
            )}

            <div className="message-container">
                {question && <div className="mssg user">{question}</div>}
            </div>
            {answer && (
                <div className="msg">
                    <Markdown>{answer}</Markdown>
                    <p>HELLO!</p>
                    <div className="ai-controls">
                        <div className='icon-btn' onClick={() => handleTextToSpeech(answer)}>
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
                </div>
            )}

            <div className="endChat" ref={endRef}></div>

            <form className='newForm' onSubmit={handleSubmit} ref={formRef} autoComplete='off'>
                {/* <Upload setImg={setImg} file={pastedFile} /> */}
                {/* <Upload setImg={(imgRes) => { setImg(prev => ({ ...prev, isLoading: true })); handleImageUploadSuccess(imgRes); }} /> */}
                <Upload setImg={setImg} />
                <input id="file" type='file' multiple={true} style={{ display: 'none' }} />
                <textarea className='textInput' name='text' placeholder='Message Nexus' onInput={autoResize} />
                <button><img src="/arrow.png" alt="Submit" /></button>
            </form>
        </div>
    )
};

export default NewPrompt;