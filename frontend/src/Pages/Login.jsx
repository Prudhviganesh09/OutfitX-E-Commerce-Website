import React, { useState } from 'react';
import './CSS/Login.css';

const Login = () => {
    const [state, setState] = useState("Login");
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: ""
    });

    const changeHandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (state === "Sign Up") {
            if (!formData.username || !formData.email || !formData.password) {
                alert("Please fill in all fields");
                return;
            }
            await signup(); // Call signup function
        } else {
            if (!formData.email || !formData.password) {
                alert("Please fill in all fields");
                return;
            }
            await login(); // Call login function
        }
    };

    const login = async () => {
        try {
            const response = await fetch('http://localhost:4000/login', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });
    
            const responseData = await response.json();
    
            if (responseData.success) {
                localStorage.setItem('auth-token', responseData.token);
                window.location.replace("/");  // Redirect to the homepage or another route after successful login
            } else {
                alert(responseData.error || "Login failed. Please check your email and password.");
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("An error occurred during login. Please try again.");
        }
    };
    

    const signup = async () => {
        try {
            const response = await fetch('http://localhost:4000/signup', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const responseData = await response.json();
    
            if (responseData.success) {
                localStorage.setItem('auth-token', responseData.token);
                window.location.replace("/");
            } else {
                alert(responseData.errors || "Signup failed. Please try again.");
            }
        } catch (error) {
            console.error("Error during signup:", error);
            alert("An error occurred during signup. Please try again.");
        }
    };
    

    return (
        <div className='loginsignup'>
            <div className="loginsignup-container">
                <h1>{state}</h1>
                <div className="loginsignup-fields">
                    {state === "Sign Up" && (
                        <input
                            name="username"
                            value={formData.username}
                            onChange={changeHandler}
                            type="text"
                            placeholder='Your Name'
                        />
                    )}
                    <input
                        name="email"
                        value={formData.email}
                        onChange={changeHandler}
                        type="email"
                        placeholder='Email Address'
                    />
                    <input
                        name="password"
                        value={formData.password}
                        onChange={changeHandler}
                        type="password"
                        placeholder='Password'
                    />
                </div>
                <button onClick={handleSubmit}>Continue</button>
                {state === 'Sign Up' ? (
                    <p className="loginsignup-login">
                        Already have an account? <span onClick={() => setState("Login")}>Login here</span>
                    </p>
                ) : (
                    <p className="loginsignup-login">
                        Create an account? <span onClick={() => setState("Sign Up")}>Click here</span>
                    </p>
                )}
                {state === 'Sign Up' && (
                    <div className="loginsignup-agree">
                        <input type="checkbox" />
                        <p>By continuing, I agree to the terms of use & privacy policy</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
