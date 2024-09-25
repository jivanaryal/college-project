import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check for token in localStorage and update authentication status
        const token = localStorage.getItem('token1');
        setIsAuthenticated(!!token); // Set to true if token exists
    }, []);

    const handleLogout = () => {
        // Remove token from localStorage
        localStorage.removeItem('token1');
        localStorage.removeItem('studentID');
        // Update authentication status after logout
        setIsAuthenticated(false);
        // Redirect to the login page
        navigate('/login');
    };

    return (
        <nav className="bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 p-5 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-white text-2xl font-extrabold tracking-wider hover:text-yellow-300 transition duration-300">
                    College Finder
                </Link>
                <div className="space-x-6">
                    {isAuthenticated ? (
                        <button
                            onClick={handleLogout}
                            className="text-white font-semibold px-5 py-2 bg-yellow-400 rounded-full shadow-md hover:bg-yellow-500 transition duration-300"
                        >
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-white font-semibold px-5 py-2 bg-yellow-400 rounded-full shadow-md hover:bg-yellow-500 transition duration-300"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="text-white font-semibold px-5 py-2 bg-yellow-400 rounded-full shadow-md hover:bg-yellow-500 transition duration-300"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
