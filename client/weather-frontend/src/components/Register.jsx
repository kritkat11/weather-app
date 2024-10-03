import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css'; 

function Register({ setLoggedIn }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault(); // Prevent page reload on form submit
        console.log("Register button clicked");
    
        try {
            const response = await axios.post('http://localhost:1234/', {
                name,
                email,
                password,
                phoneNumber
            });
    
            if (response.data.message === 'Registration successful') {
                console.log('User registered successfully');
                alert('Registration successful!');
                setLoggedIn(true); // Mark the user as logged in
                navigate('/login'); // Redirect to login page after registration
            }
        } catch (err) {
            setError(err.response ? err.response.data.message : 'Registration failed');
        }
    };
    

    // const handleRegister = async (e) => {

    //     if (response.data.message === 'Registration successful') {
    //         setLoggedIn(true);
    //         navigate('/weather'); // Navigate to weather page after successful registration
    //     }

    //     e.preventDefault();
    //     try {
    //         const response = await axios.post('http://localhost:5000/register', {
    //             name,
    //             email,
    //             password,
    //             phone
    //         });
    //         if (response.data.success) {
    //             navigate('/weather');  // Redirect to weather page upon successful registration
    //         } else {
    //             alert('Registration failed');
    //         }
    //     } catch (error) {
    //         console.error('Error during registration:', error);
    //         alert('Error registering');
    //     }
    // };

    return (
        <div className="register-container">
            <h1>Register</h1>
            <form onSubmit={handleRegister}>
                <input 
                    type="text" 
                    placeholder="Name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required
                />
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required
                />
                <input 
                    type="tel" 
                    placeholder="Phone" 
                    value={phoneNumber} 
                    onChange={(e) => setPhoneNumber(e.target.value)} 
                    required
                />
                <button type="submit" className="register-btn">Register</button>
            </form>
            {error && <p className="error">{error}</p>} {/* Display error */}
        </div>
    );
}

export default Register;
