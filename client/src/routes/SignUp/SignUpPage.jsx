import React from 'react';
import { useNavigate } from "react-router-dom";
import { SignUp, useUser } from "@clerk/clerk-react";
import './SignUpPage.css';

const SignUpPage = () => {
    const { isSignedIn } = useUser();
    const navigate = useNavigate();

    if (isSignedIn) {
        navigate('/dashboard'); // Redirect if user is already signed in
        return null; // Return null to avoid rendering the SignUp component
    }

    return (
        <div className='signUpPage'>
            <SignUp path="/sign-up" signInUrl="/login" />
        </div>
    )
}

export default SignUpPage;