import React, { useEffect, useRef } from 'react';
import { IKContext, IKImage, IKUpload } from "imagekitio-react";

const urlEndpoint = import.meta.env.VITE_IMAGE_KIT_ENDPOINT;
const publicKey = import.meta.env.VITE_IMAGE_KIT_PUBLIC_KEY;

const authenticator = async () => {
    try {
        const response = await fetch("http://localhost:3000/api/upload");

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Request failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const { signature, expire, token } = data;
        return { signature, expire, token };
    } catch (error) {
        throw new Error(`Authentication request failed: ${error.message}`);
    }
};

//const Upload = forwardRef(({ setImg }, ref) => {
//const Upload = ({ setImg, file }) => {
const Upload = ({ setImg }) => {
    const ikUploadRef = useRef(null);

    /*useEffect(() => {
        if (file) {
            // File is passed as a prop, trigger the upload when file changes
            console.log('Uploading file via IKUpload:', file);
        }
    }, [file]);*/

    /*// Allow access to the upload function from the parent component via ref
    useImperativeHandle(ref, () => ({
        uploadFile: (file) => {
            if (ikUploadRef.current) {
                const blob = new Blob([file], { type: file.type });
                ikUploadRef.current.upload(blob); // Upload file from clipboard
            }
        }
    }));*/

    const onError = (err) => {
        console.log("Error: ", err);
    };

    const onSuccess = (res) => {
        console.log("Success: ", res);
        //setImg((prev) => ({ ...prev, isLoading: false, dbData: res }));
        //setImg(res);
        setImg((prev) => ({
            ...prev,
            isLoading: false,
            dbData: [...prev.dbData, res], // Store the uploaded image data
            aiData: [...prev.aiData, { text: `Image uploaded: ${res.filePath}`, filePath: res.filePath }],
        }));
    };

    const onUploadProgress = (progress) => {
        console.log("Progress: ", progress);
    };

    // const onUploadStart = (evt) => {
    //     console.log("Start: ", evt);
    // };

    const onUploadStart = (evt) => {
        const files = evt.target.files; // Get all files
        const processedImages = [];

        // Iterate over each file to process multiple images
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();

            reader.onloadend = () => {
                // const imageData = {
                //     data: reader.result.split(",")[1],
                //     mimeType: file.type,
                // };

                const imageData = {
                    text: `Image uploaded: ${file.name}`, // Human-readable description
                    filePath: reader.result.split(",")[1], // Base64 encoded image data (if needed for AI)
                    mimeType: file.type,
                };

                processedImages.push(imageData);

                // After processing all images, update the AI data and image state
                if (processedImages.length === files.length) {
                    setImg((prev) => ({
                        ...prev,
                        isLoading: true,
                        aiData: processedImages, // Store all processed images
                    }));
                }
            };

            reader.readAsDataURL(file); // Read each file
        }
    };

    //console.log("the uploaded file details are: ", file);
    //console.log("the file name is: ", file.name);

    return (
        <IKContext urlEndpoint={urlEndpoint} publicKey={publicKey} authenticator={authenticator}>
            {/* {file && (
                <IKUpload
                    fileName={file.name}
                    file={file} // Pass the file directly to IKUpload
                    useUniqueFileName={true}
                    onError={onError}
                    onSuccess={onSuccess}
                    onUploadProgress={onUploadProgress}
                    onUploadStart={onUploadStart}
                    ref={ikUploadRef || file}
                    style={{ display: "none" }}
                />
            )}

            <label onClick={() => ikUploadRef.current.click() || document.getElementById('fileInput').click()}>
                <img src="/attachment.png" alt="attachment icon" />
            </label>
            <input id="fileInput" type="file" style={{ display: "none" }} /> */}

            <IKUpload
                fileName="image.png"
                useUniqueFileName={true}
                onError={onError}
                onSuccess={onSuccess}
                onUploadProgress={onUploadProgress}
                onUploadStart={onUploadStart}
                ref={ikUploadRef}
                style={{ display: "none" }}
            />
            {
                <label onClick={() => ikUploadRef.current.click()}>
                    <img src="/attachment.png" alt="Attach Files" />
                </label>
            }
        </IKContext>
    );
}/*)*/;

export default Upload;