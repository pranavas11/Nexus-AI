import React from 'react';
import { useNavigate } from "react-router-dom";
import { SignIn, useUser } from "@clerk/clerk-react";
import './Login.css';

const Login = () => {
    const { isSignedIn } = useUser();
    const navigate = useNavigate();

    if (isSignedIn) {
        navigate('/dashboard'); // Redirect if user is already signed in
        return null; // Return null to avoid rendering the SignIn component
    }

    return (
        <div className='loginPage'>
            {/* <SignIn path="/login" signUpUrl="/sign-up" forceRedirectUrl="/dashboard" /> */}
            <SignIn path="/login" signUpUrl="/sign-up" redirectUrlComplete="/dashboard" />
        </div>
    );
}

export default Login;