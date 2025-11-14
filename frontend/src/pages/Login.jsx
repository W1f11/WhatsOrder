import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/auth/authThunks';
import { useNavigate, Link } from 'react-router-dom'; 

export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, loading, error } = useSelector((state) => state.auth);

    const [form, setForm] = useState({email: '', password: ''});

    // Redirection si déja connecté

    useEffect(() => {
        if (user) navigate('/profile');

    }, [user, navigate]);

    // Mise à jour des champs
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value});
    };

    // Soumission du formulaire 

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser(form));
    };


    return (
        <div className="flex items-center justify-center bg-white px-4 py-8">
            

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm w-full max-w-md border border-gray-100">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-8 font-['Poppins']">Login</h2>

            {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
                    {typeof error === 'string' ? error : JSON.stringify(error)}
                </div>
            )}
                <div className='mb-6'>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-['Inter']" htmlFor="email">
                        Email
                    </label>
                    <input type="email" id="email" name="email" value={form.email} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 placeholder-gray-400 font-['Inter']" required />
                </div>
                <div className='mb-8'>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-['Inter']" htmlFor="password">
                        Password
                    </label>
                    <input type="password" id="password" name="password" value={form.password} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 placeholder-gray-400 font-['Inter']" required />
                </div>

                <button type="submit" disabled={loading} className="w-full bg-black text-white py-3.5 rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black font-['Inter']">
                    {loading ? 'Loading...' : 'login'}
                </button>
                <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 font-['Inter']">
            Pas de compte ?{' '}
            <Link 
              to="/register" 
              className="text-black font-medium hover:text-gray-700 transition-colors"
            >
              S'inscrire
            </Link>
          </p>
        </div>
                
            </form>

        </div>
    )

}