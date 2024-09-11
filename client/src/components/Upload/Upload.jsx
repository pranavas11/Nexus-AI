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

const Upload = ({ setImg }) => {
    const ikUploadRef = useRef(null);

    // useEffect(() => {
    //     if (base64Image) {
    //         //const response = await
    //         // Handle the base64 image upload here
    //         const blob = base64ToBlob(base64Image, "image/png");  // Convert base64 to blob
    //         //uploadImage(blob);
    //         onUploadStart(blob);
    //     }
    // }, [base64Image]);

    // const onUploadStart = (fileBlob) => {
    //     const fileReader = new FileReader();
    //     console.log("the fileBlob from upload is: ", fileBlob);

    //     fileReader.onloadend = () => {
    //         setImg((prev) => ({
    //             ...prev,
    //             isLoading: true,
    //             aiData: {
    //                 inlineData: {
    //                     data: fileReader.result.split(",")[1],
    //                     mimeType: fileBlob.type,
    //                 },
    //             },
    //         }));
    //     };

    //     fileReader.readAsDataURL(fileBlob);
    // };

    const onError = (err) => {
        console.log("Error: ", err);
        setImg((prev) => ({ ...prev, isLoading: false, error: err.message }));
    };

    const onSuccess = (res) => {
        console.log("Success: ", res);
        //setImg((prev) => ({ ...prev, isLoading: false, error: "", dbData: res }));
        setImg((prev) => ({
            ...prev,
            isLoading: false,
            error: "",
            dbData: [...prev.dbData, res],  // Append the uploaded image to dbData array
        }));
    };

    const onUploadProgress = (progress) => {
        console.log("Progress: ", progress);
    };

    // const onUploadStart = (evt) => {
    //     console.log("the event in upload is: ", evt);
    //     const file = evt.target.files[0];
    //     const reader = new FileReader();

    //     reader.onloadend = () => {
    //         console.log("File is being processed for upload: ", file);
    //         setImg((prev) => ({
    //             ...prev,
    //             isLoading: true,
    //             aiData: {
    //                 inlineData: {
    //                     data: reader.result.split(",")[1],
    //                     mimeType: file.type,
    //                 },
    //             },
    //         }));
    //     };

    //     reader.readAsDataURL(file);
    // };

    const onUploadStart = (evt) => {
        console.log("the event in upload is: ", evt);
        
        const files = evt.target.files; // Get all selected files
    
        // Iterate through the file list
        Array.from(files).forEach((file) => {
            const reader = new FileReader();
    
            reader.onloadend = () => {
                console.log("File is being processed for upload: ", file);
                
                // Append each image data to the state
                setImg((prev) => ({
                    ...prev,
                    isLoading: true,
                    aiData: [
                        ...prev.aiData, // Ensure previously uploaded data remains
                        {
                            inlineData: {
                                data: reader.result.split(",")[1],
                                mimeType: file.type,
                            },
                        },
                    ],
                }));
            };
    
            // Read each file as Data URL
            reader.readAsDataURL(file);
        });
    };    

    return (
        <IKContext urlEndpoint={urlEndpoint} publicKey={publicKey} authenticator={authenticator}>
            {/* {base64Image && (
                <IKImage path={base64Image} />
            )} */}
            <IKUpload
                fileName="image.png"
                onError={onError}
                onSuccess={onSuccess}
                useUniqueFileName={true}
                onUploadProgress={onUploadProgress}
                onUploadStart={onUploadStart}
                multiple={true}                     // allow multiple file uploads
                style={{ display: "none" }}
                ref={ikUploadRef}
            />
            <label onClick={() => ikUploadRef.current.click()}>
                <img src="/attachment.png" alt="Attach Files" />
            </label>
        </IKContext>
    );
};

export default Upload;
