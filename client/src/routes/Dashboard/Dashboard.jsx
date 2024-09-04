import React from 'react';
import { useNavigate } from "react-router-dom";
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const text = e.target.text.value;
        if (!text) return;

        //mutation.mutate(text);
    };

    return (
        <div>
            <h1>Hello from Dashboard.jsx!</h1>
        </div>
    );
}

export default Dashboard;
