import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import { registerUser } from '../features/auth/authThunks';

import '../App.css';

export default function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, loading, error } = useSelector((state) => state.auth);

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: ''
    });

    useEffect(() => {
        if (user) navigate('/profile');
    }, [user, navigate]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(registerUser({
            ...form,
            password_confirmation: form.password
        }));
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center relative"
            style={{
                backgroundImage:
                    "url('https://i.pinimg.com/1200x/13/b5/3e/13b53ec3b54837d0c43e47dca82ab4f1.jpg')",
            }}
        >
           

            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-xl shadow-sm w-full max-w-md border border-gray-100 text-[#568F87]"
            >
                <h2 className="text-3xl font-bold text-center mb-8 font-['Poppins']">
                    Register
                </h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                        {typeof error === 'string' ? error : JSON.stringify(error)}
                    </div>
                )}

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-['Roboto']">
                        Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFAEB0] transition"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-['Roboto']">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFAEB0] transition"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-['Roboto']">
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFAEB0] transition"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#568F87] text-white py-3 rounded-lg font-medium hover:bg-[#3c6d67] transition-colors duration-200"
                >
                    {loading ? "Loading..." : "Register"}
                </button>
            </form>
        </div>
    );
}
