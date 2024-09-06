import React, { useState, useEffect, useRef } from 'react';
import { IKImage } from "imagekitio-react";
import Markdown from 'react-markdown';
import Upload from '../Upload/Upload';
import model from '../../lib/gemini';
import './NewPrompt.css';

const NewPrompt = () => {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    //const [pastedFile, setPastedFile] = useState(null);
    const [images, setImages] = useState([]); // Array to store uploaded images at any given time
    const [loading, setLoading] = useState(false);
    const [img, setImg] = useState({
        isLoading: false,
        error: "",
        dbData: {},
        aiData: {},
    });

    const endRef = useRef(null);
    //const uploadRef = useRef(null);

    useEffect(() => {
        endRef.current.scrollIntoView({ behavior: "smooth" });
    }, [question, answer, img.dbData, images, loading]);

    // Ensure the ref is available after the component mounts
    // useEffect(() => {
    //     if (uploadRef.current) {
    //         console.log('Upload ref is now available:', uploadRef.current);
    //     }
    // }, [uploadRef.current]);

    // auto-resize function for textarea
    const autoResize = (event) => {
        const textarea = event.target;
        textarea.style.height = '50px'; // Reset to default height when resizing
        textarea.style.height = `${textarea.scrollHeight}px`; // Adjust based on scroll height
    };

    // const handlePaste = (event) => {
    //     const clipboardItems = event.clipboardData.items;
    //     const imageItem = Array.from(clipboardItems).find(item => item.type.includes('image'));
    
    //     if (imageItem) {
    //         const file = imageItem.getAsFile();
    //         if (file) {
    //             // Handle image upload similarly to how it's done with file input
    //             const ikUploadRef = ikUploadRef.current;
    //             ikUploadRef.upload(file);
    //         }
    //     }
    // };

    // Handle pasting an image from the clipboard
    // const handlePaste = async (event) => {
    //     const clipboardItems = event.clipboardData.items;
    //     console.log("clipboard items are: ", clipboardItems);
    //     const imageItem = Array.from(clipboardItems).find(item => item.type.includes('image'));
    //     console.log(imageItem);

    //     if (imageItem) {
    //         const file = imageItem.getAsFile(); // Extract file from the clipboard
    //         console.log(file);
    //         console.log("uploadRef current is: ", uploadRef.current);
    //         if (file && uploadRef.current) {
    //             setImg((prev) => ({ ...prev, isLoading: true })); // Show loading state
    //             uploadRef.current.uploadFile(file);  // Programmatically trigger the upload
    //         } else {
    //             console.warn('uploadRef is not available, cannot upload the file.');
    //         }
    //     }
    // };

    // ----------- ALMOST WORKING VERSION OF CLIPBOARD COPY/PASTE -----------
    // Handle pasting an image from the clipboard
    // const handlePaste = async (event) => {
    //     const clipboardItems = event.clipboardData.items;
    //     console.log("clipboard items are: ", clipboardItems);
    //     const imageItem = Array.from(clipboardItems).find(item => item.type.includes('image'));
    //     console.log(imageItem);

    //     if (imageItem) {
    //         const file = imageItem.getAsFile(); // Extract file from the clipboard
    //         console.log(file);
    //         if (file) {
    //             setPastedFile(file); // Set the pasted file to trigger the upload
    //             setImg((prev) => ({ ...prev, isLoading: true })); // Show loading state
    //         }
    //     }
    // };

    const genAI = async (text, isInitial) => {
        if (!isInitial) setQuestion(text);

        try {
            const result = await model.generateContent(text);
            const response = await result.response;
            setAnswer(response.text());
        } catch (err) {
            console.log(err);
        }

        // const prompt = "Write a story about space.";
        // const result = await model.generateContent(prompt);
        // const response = await result.response;
        // const text = response.text();
        // console.log(text);
    };

    // Handle the image upload success and store the image in the array
    const handleImageUploadSuccess = (res) => {
        setLoading(false);
        setImages(prevImages => {
            if (prevImages.length >= 3) {
                alert("You can only upload a maximum of 3 images."); // Alert the user
                return prevImages; // Retain the first 3 images and prevent adding more
            } else {
                return [...prevImages, res]; // Add the new image to the array
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

            {images.map((image, index) => (
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
                <Upload setImg={(img) => { setLoading(true); handleImageUploadSuccess(img); }} />
                {/* <Upload setImg={setImg} /> */}
                <input id="file" type='file' multiple={false} style={{ display: 'none' }} />
                <textarea className='textInput' name='text' placeholder='Message Nexus' onInput={autoResize} />
                <button><img src="/arrow.png" alt="Submit" /></button>
            </form>
        </div>
    )
}

export default NewPrompt;