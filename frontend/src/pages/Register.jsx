import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import { registerUser } from '../features/auth/authThunks';

import '../App.css'
export default function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, loading, error } = useSelector((state) => state.auth);

    const [form, setForm] = useState({name: '', email: '', password: ''});


     useEffect(() => {
        if (user) navigate('/profile');
    }, [user, navigate]);


    // Mise à jour des champs 

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value});
    };

    // soumission du formulaire

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(registerUser({
            ...form,
            password_confirmation: form.password
        }));
    };


    return (
        <div className="flex items-center justify-center px-4 bg-white">
            

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg w-full max-w-md shadow-lg">
                <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 font-['Poppins'"> Register</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                    {typeof error === 'string' ? error : JSON.stringify(error)}
                </div>
            )}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-['Roboto']" htmlFor="name">Name</label>

                    <input type="text" id="name" name="name" value={form.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-colors" required />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-['Roboto']" htmlFor="email">Email</label>

                    <input type="email" id="email" name="email" value={form.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-colors" required />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-['Roboto']" htmlFor="password">Password</label>

                    <input type="password" id="password" name="password" value={form.password} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-colors" required />
                </div>

                <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 font-['Poppins']"
                >
                {loading ? 'Loading...' : 'Register'}
                </button>
            </form>
        </div>
    )
}