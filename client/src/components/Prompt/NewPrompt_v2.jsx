import React, { useState, useEffect, useRef } from 'react';
import { IKImage } from "imagekitio-react";
import Markdown from 'react-markdown';
import Upload from '../Upload/Upload_v1';
import model from '../../lib/gemini';
import './NewPrompt.css';

const NewPrompt = () => {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [img, setImg] = useState({
        isLoading: false,
        error: "",
        dbData: [],
        aiData: [],
    });

    const endRef = useRef(null);

    const chat = model.startChat({
        history: [
            {
                role: "user",
                parts: [{ text: "Hello!" }],
            },
            {
                role: "model",
                parts: [{ text: "Great to meet you. What would you like to know?" }],
            },

        ],
        generationConfig: {
            //maxOutputTokens: 100;
        }

        // history: [
        //     data?.history.map(({ role, parts }) => ({
        //         role,
        //         parts: [{ text: parts[0].text }],
        //     })),
        // ],
        // generationConfig: {
        //     // maxOutputTokens: 100,
        // },
    });

    useEffect(() => {
        endRef.current.scrollIntoView({ behavior: "smooth" });
    }, [question, answer, img.dbData]);

    // auto-resize function for textarea
    const autoResize = (event) => {
        const textarea = event.target;
        textarea.style.height = '50px';                         // reset to default height when resizing
        textarea.style.height = `${textarea.scrollHeight}px`;   // adjust based on scroll height
    };

    const genAI = async (text, isInitial) => {
        if (!isInitial) setQuestion(text);

        try {
            // const result = await chat.sendMessageStream(
            //     img.aiData.length ? [img.aiData, text] : [text]
            // );

            const inputParts = img.aiData.length
                ? [{ text }, ...img.aiData.map(image => ({ text: `Image available at: ${image.text}` }))]
                : [{ text }];
            const result = await chat.sendMessageStream(inputParts);

            let accumulatedText = "";

            // Stream the AI response and progressively update the answer
            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                console.log(chunkText);
                accumulatedText += chunkText;
                setAnswer(accumulatedText); // Update the answer progressively
            }
        } catch (err) {
            console.log("Error in streaming AI response: ", err);
        }
    };

    // Handle the image upload success and store the image in the array
    const handleImageUploadSuccess = (res) => {
        setImg(prevImg => {
            if (prevImg.dbData.length >= 3) {
                alert("You can only upload a maximum of 3 images."); // Alert the user
                return prevImg; // Retain the first 3 images and prevent adding more
            } else {
                return {
                    ...prevImg,
                    isLoading: false, // Stop loading after image is uploaded
                    dbData: [...prevImg.dbData, res], // Add the new image to dbData array
                    //aiData: [...prevImg.aiData, { data: res.filePath, mimeType: res.mimeType }] // Add the image to aiData for AI input
                    aiData: [...prevImg.aiData, { text: `Image uploaded: ${res.filePath}`, mimeType: res.mimeType }]
                    //aiData: [...prevImg.aiData, { text: `Image uploaded: ${res.filePath}`, filePath: res.filePath }] // Add text metadata for AI
                };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const text = e.target.text.value;
        if (!text) return;
        genAI(text, false);
    }

    return (
        // <div onPaste={handlePaste}>
        <div>
            {img.isLoading && <div className=''>Loading...</div>}

            {img.dbData.map((image, index) => (
                <div key={index} className="message userImage">
                    <IKImage
                        urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                        path={image.filePath}
                        width="390"
                        transformation={[{ width: 390 }]}
                    />
                </div>
            ))}

            {/* {img.dbData?.filePath && (
                <div className="message userImage">
                    <IKImage
                        urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                        path={img.dbData?.filePath}
                        width="390"
                        transformation={[{ width: 390 }]}
                    />
                </div>
            )} */}

            {question && <div className="message user">{question}</div>}
            {answer && (
                <div className="message">
                    <Markdown>{answer}</Markdown>
                </div>
            )}

            <div className="endChat" ref={endRef}></div>

            <form className='newForm' onSubmit={handleSubmit} autoComplete='off'>
                {/* <Upload setImg={setImg} file={pastedFile} /> */}
                <Upload setImg={(imgRes) => { setImg(prev => ({ ...prev, isLoading: true })); handleImageUploadSuccess(imgRes); }} />
                {/* <Upload setImg={setImg} /> */}
                <input id="file" type='file' multiple={false} style={{ display: 'none' }} />
                <textarea className='textInput' name='text' placeholder='Message Nexus' onInput={autoResize} />
                <button><img src="/arrow.png" alt="Submit" /></button>
            </form>
        </div>
    )
}

export default NewPrompt;