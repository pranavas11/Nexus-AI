import React, { useState, useEffect, useRef } from 'react';
import { IKImage } from "imagekitio-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Markdown from 'react-markdown';
import { SoundFilled, CopyFilled, SyncOutlined } from '@ant-design/icons';
import Upload from '../Upload/Upload';
import model from '../../lib/gemini';
import AIControls from '../AIControls/AIControls';
import './NewPrompt.css';

const NewPrompt = ({ data, flag, regenerateQuestion }) => {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [inputValue, setInputValue] = useState('');
    //const [pastedFile, setPastedFile] = useState(null);
    //const [imageUrl, setImageUrl] = useState("");
    const [prompt, setPrompt] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false); // track whether speech is playing
    const [img, setImg] = useState({
        isLoading: false,
        error: "",
        // dbData: {},
        // aiData: {},
        dbData: [],  // Change from object to array to store multiple images
        aiData: [],
    });

    const queryClient = useQueryClient();

    const endRef = useRef(null);
    const formRef = useRef(null);
    const textAreaRef = useRef(null);

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

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleInput = (event) => {
        autoResize(event);
        handleInputChange(event);
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
                    //img: img.dbData?.filePath || undefined,
                    img: img.dbData.map(image => image.filePath) || undefined,
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
                        // dbData: {},
                        // aiData: {},
                        dbData: [],
                        aiData: [],
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
                //Object.entries(img.aiData).length ? [img.aiData, text] : [text]
                img.aiData.length ? [...img.aiData, text] : [text]
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
        if (!text) return;
        genAI(text, false);
        flag(false);
    };

    const handleSubmitText = async (text) => {
        if (!text.trim()) return;      // avoid empty submits
        genAI(text, false);
    };

    const handleKeyPress = async (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();                         // prevents new line
            const text = event.target.value;                // get the text directly from the textarea
            if (!text.trim()) return;                       // check if text is empty
            handleSubmitText(text);                         // call a new function to handle submission with text
        }
    };

    /*const handleTextToSpeech = (text) => {
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
    };*/

    // function to regenerate the AI response
    const handleRegenerate = () => {
        console.log("the question in handleRegenerate is: ", question);
        if (question) {
            genAI(question, true);                              // regenerate the response
        }
    };

    useEffect(() => {
        if (regenerateQuestion) {
            genAI(regenerateQuestion, true);  // Trigger regeneration when the prop is passed
        }
    }, [regenerateQuestion]);

    // const handlePaste = async (event) => {
    //     const clipboardItems = event.clipboardData.items;
    //     const imageItems = Array.from(clipboardItems).filter(item => item.type.includes('image'));

    //     if (imageItems.length > 0) {
    //         // Get the first pasted image
    //         const imageFile = imageItems[0].getAsFile();  // Get the image file

    //         if (!imageFile) {
    //             return;
    //         }

    //         const formData = new FormData();
    //         formData.append('file', imageFile);
    //         formData.append('fileName', 'pasted-image.png');  // Optional: give it a default name

    //         try {
    //             setImg(prevImg => ({
    //                 ...prevImg,
    //                 isLoading: true,
    //             }));

    //             const response = await fetch(`${import.meta.env.VITE_IMAGE_KIT_ENDPOINT}/api/upload`, {
    //                 method: 'POST',
    //                 headers: {
    //                     Authorization: `Basic ${btoa(publicKey + ':' + await authenticator())}`,  // Using your authenticator logic
    //                 },
    //                 body: formData,
    //             });

    //             if (!response.ok) {
    //                 throw new Error('Failed to upload image');
    //             }

    //             const result = await response.json();

    //             setImg(prevImg => {
    //                 if (prevImg.dbData.length >= 3) {
    //                     alert("You can only upload a maximum of 3 images.");
    //                     return prevImg;
    //                 }
    //                 return {
    //                     ...prevImg,
    //                     isLoading: false,
    //                     dbData: [...prevImg.dbData, { filePath: result.url }],  // Store the public URL from ImageKit
    //                     aiData: [...prevImg.aiData, { text: `Pasted image`, inlineData: { data: result.url } }]  // Store in AI data
    //                 };
    //             });
    //         } catch (error) {
    //             console.error('Error uploading pasted image:', error);
    //             setImg(prevImg => ({
    //                 ...prevImg,
    //                 isLoading: false,
    //                 error: 'Failed to upload pasted image',
    //             }));
    //         }
    //     }
    // };

    // Handle paste event for images
    // const handlePaste = (e) => {
    //     const items = e.clipboardData.items;
    //     for (const item of items) {
    //         if (item.type.includes('image')) {
    //             const blob = item.getAsFile();
    //             const reader = new FileReader();
    //             reader.onloadend = () => {
    //                 setImg((prev) => ({
    //                     ...prev,
    //                     isLoading: true,
    //                     aiData: {
    //                         inlineData: {
    //                             data: reader.result.split(",")[1],
    //                             mimeType: blob.type,
    //                         },
    //                     },
    //                 }));
    //             };
    //             reader.readAsDataURL(blob);
    //         }
    //     }
    // };

    // const handlePaste = async (event) => {
    //     const clipboardItems = event.clipboardData.items;
    //     console.log("clipboard items are: ", clipboardItems);
    //     const imageItem = Array.from(clipboardItems).find(item => item.type.includes('image'));
    //     console.log("the imageItem is: ", imageItem);

    //     if (imageItem) {
    //         const file = imageItem.getAsFile(); // Extract file from the clipboard
    //         console.log(file);
    //         if (file) {
    //             setPastedFile(file); // Set the pasted file to trigger the upload
    //             setImg((prev) => ({ ...prev, isLoading: true, dbData: file })); // Show loading state
    //         }
    //     }
    // };

    //console.log("the question is: ", question);
    //console.log("the answer is: ", answer);
    console.log("data history in New Prompt is: ", data?.history);

    const test = () => {
        setPrompt(true);
    };

    console.log(flag);

    return (
        <div>
            {/* <div> */}
            {img.isLoading && <div className=''>Loading...</div>}

            {img.dbData?.length > 0 && img.dbData.map((image, index) => (
                <div key={index} className="msg userImage">
                    <IKImage
                        urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                        path={image.filePath}
                        width="390"
                        transformation={[{ width: 390 }]}
                    />
                </div>
            ))}

            {/* {img.dbData?.filePath && (
                <div className="msg userImage">
                    <IKImage
                        urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                        path={img.dbData?.filePath}
                        width="390"
                        transformation={[{ width: 390 }]}
                    />
                </div>
            )} */}

            <div className="message-container">
                {question && <div className="mssg user">{question}</div>}
            </div>
            {answer || flag && (
                <div className="msg">
                    <Markdown>{answer}</Markdown>
                </div>
            )}

            {/* {(data?.history || answer) && (
                <div>
                    <AIControls
                        answer={answer}
                        handleRegenerate={handleRegenerate}
                    />
                </div>
            )} */}

            {/* {(data?.history || answer) && (
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
            )} */}

            <div className="endChat" ref={endRef}></div>

            <form className='newForm' onSubmit={handleSubmit} ref={formRef} autoComplete='off'>
                {/* <Upload setImg={setImg} file={pastedFile} /> */}
                {/* <Upload setImg={(imgRes) => { setImg(prev => ({ ...prev, isLoading: true })); handleImageUploadSuccess(imgRes); }} /> */}
                <Upload setImg={setImg} />
                <input id="file" type='file' multiple={true} style={{ display: 'none' }} />
                <textarea className='textInput' name='text' placeholder='Message Nexus' onChange={test} onInput={handleInput} onKeyDown={handleKeyPress} />
                <button className={inputValue.trim().length > 0 ? 'active' : ''}><img src="/arrow.png" alt="Submit" /></button>
            </form>
        </div>
    )
};

export default NewPrompt;