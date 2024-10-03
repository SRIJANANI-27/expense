import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import Modal from 'react-modal';
import { APIUrl, handleError, handleSuccess } from '../utils';

Modal.setAppElement('#root'); // Set the root element for accessibility

function Login() {
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
    const [isModalOpen, setIsModalOpen] = useState(false); // State to handle modal visibility
    const [forgotPasswordInfo, setForgotPasswordInfo] = useState({
        newPassword: '',
        confirmNewPassword: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleForgotPasswordChange = (e) => {
        const { name, value } = e.target;
        setForgotPasswordInfo(prev => ({ ...prev, [name]: value }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;
    
        // Basic validation
        if (!email || !password) {
            return handleError('Email and password are required');
        }
    
        try {
            const response = await axios.post(`${APIUrl}/auth/login`, loginInfo);
            const { success, message, jwtToken, name, error } = response.data;
    
            if (success) {
                // Handle success: show success message and store token/user
                handleSuccess(message);
                localStorage.setItem('token', jwtToken);
                localStorage.setItem('loggedInUser', name);
    
                // Redirect to home after 1 second
                setTimeout(() => navigate('/home'), 1000);
            } else if (error) {
                // Handle specific error
                handleError(error.details[0]?.message || 'An error occurred');
                console.log("Error details:", error.details[0]?.message);
            } else {
                // General error handling if no specific error is found
                handleError(message || 'An unexpected error occurred');
            }
        } catch (err) {
            // Check status code and show appropriate message
            if (err.response) {
                if (err.response.status === 404) {
                    // User not found
                    handleError('No user found with this email');
                } else if (err.response.status === 403) {
                    // Incorrect password
                    handleError('Password incorrect');
                } else {
                    // General error for other statuses
                    handleError(err.response.data.message || 'Login failed');
                }
            } else {
                // Network or unexpected error
                handleError('An error occurred. Please try again.');
            }
            console.error("Login error:", err);
        }
    };
    

    const handleForgotPassword = async () => {
        const { email } = loginInfo; // Get the email from loginInfo
        const { newPassword, confirmNewPassword } = forgotPasswordInfo;
    
        if (!email || !newPassword || !confirmNewPassword) {
            return handleError('All fields are required');
        }
    
        if (newPassword !== confirmNewPassword) {
            return handleError('New passwords do not match');
        }
    
        try {
            // Include email in the request payload
            const response = await axios.post(`${APIUrl}/auth/reset`, {
                email,
                newPassword
            });
    
            const { success, message, error } = response.data;
    
            if (success) {
                handleSuccess(message); // This should trigger the toast
                setIsModalOpen(false);
            } else if (error) {
                handleError(error);
            }
        } catch (err) {
            handleError(err.message || 'An error occurred while changing the password');
        }
    };
    
    

    return (
        <div className="p-5 bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col justify-center items-center min-h-screen">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h3 className="text-3xl font-bold text-center text-gray-800 mb-6">Login to Your Account</h3>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-gray-600 text-sm font-medium mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={loginInfo.email}
                            onChange={handleChange}
                            placeholder="Enter your email..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                    </div>

                    <div className="relative">
                        <label className="block text-gray-600 text-sm font-medium mb-2">Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={loginInfo.password}
                            onChange={handleChange}
                            placeholder="Enter your password..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                        {/* Toggle button for showing/hiding password */}
                        <span
                            onClick={togglePasswordVisibility}
                            className="absolute right-4 top-10 cursor-pointer text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? '🙈' : '👁️'}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span
                            onClick={() => setIsModalOpen(true)}
                            className="text-sm text-blue-500 hover:text-blue-700 cursor-pointer"
                        >
                            Forgot Password?
                        </span>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 font-semibold text-lg"
                    >
                        Login
                    </button>

                    <div className="text-center mt-6">
                        <span className="text-gray-600">Don't have an account? </span>
                        <Link to="/signup" className="text-blue-500 hover:text-blue-700 font-medium">
                            Create one here
                        </Link>
                    </div>
                </form>
            </div>

           

            {/* Forgot Password Modal */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                className="modal-container bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-10"
                overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
                <h2 className="text-2xl font-semibold text-center mb-4">Reset Your Password</h2>
                <div className="space-y-4">
                    
                    <div>
                        <label className="block text-gray-600 text-sm font-medium mb-2">New Password</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={forgotPasswordInfo.newPassword}
                            onChange={handleForgotPasswordChange}
                            placeholder="Enter your new password..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-600 text-sm font-medium mb-2">Confirm New Password</label>
                        <input
                            type="password"
                            name="confirmNewPassword"
                            value={forgotPasswordInfo.confirmNewPassword}
                            onChange={handleForgotPasswordChange}
                            placeholder="Confirm your new password..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                    </div>

                    <button
                        onClick={handleForgotPassword}
                        className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 font-semibold text-lg"
                    >
                        Update Password
                    </button>
                </div>
            </Modal>

            <ToastContainer />
        </div>
    );
}

export default Login;
