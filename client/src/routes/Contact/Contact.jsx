import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import './Contact.css';

const Contact = () => {
    const form = useRef();
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    const validateForm = (e) => {
        const formErrors = {};
        const name = form.current.user_name.value.trim();
        const email = form.current.user_email.value.trim();
        const message = form.current.message.value.trim();

        if (!name) {
            formErrors.name = 'Name is required';
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            formErrors.email = 'Email is required';
        } else if (!emailPattern.test(email)) {
            formErrors.email = 'Please enter a valid email address';
        }

        if (!message) {
            formErrors.message = 'Message is required';
        }

        setErrors(formErrors);

        // If no errors, return true
        return Object.keys(formErrors).length === 0;
    };

    const sendEmail = (e) => {
        e.preventDefault();

        if (validateForm()) {
            emailjs.sendForm(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_EMAILJS_TEMPLATE_ID, form.current, {
                publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
            }).then(
                () => {
                    alert('Message sent successfully!');
                    setSuccess(true);
                    setTimeout(() => { setSuccess(false) }, 3000);
                    setTimeout(() => { form.current.reset() }, 3000);
                },
                (error) => {
                    console.log('FAILED...', error.text);
                },
            );
        }
    };

    return (
        <div className="form-wrapper">
            <form id="contact-form" ref={form} onSubmit={sendEmail}>
                <label htmlFor="user_name">Name</label>
                <input id="user_name" type="text" name="user_name" required />
                {errors.name && <p className="error">{errors.name}</p>}

                <label htmlFor="user_email">Email</label>
                <input id="user_email" type="email" name="user_email" required />
                {errors.email && <p className="error">{errors.email}</p>}

                <label htmlFor="message">Message</label>
                <textarea name="message" id="message" required />
                {errors.message && <p className="error">{errors.message}</p>}

                <input id="submit-button" type="submit" value="Send" />
                {success && <h5 className="success-message">Thank you! I appreciate your input!</h5>}
            </form>
        </div>
    );
};

export default Contact;