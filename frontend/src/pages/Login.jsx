import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/auth/authThunks';
import { useNavigate, Link, useLocation } from 'react-router-dom'; 

export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, loading, error } = useSelector((state) => state.auth);

    const [form, setForm] = useState({email: '', password: ''});

    // Redirection si déja connecté

    const location = useLocation();
    console.log("USER FROM REDUX:", user);

    useEffect(() => {
        if (user) {
            // Helper to detect manager role. Matches shapes used elsewhere in the app.
           const isManager = (u) => {
    return u?.role === "manager" 
        || u?.roles?.includes("manager")
        || u?.email === "manager@gmail.com";   // ← ajoute ça si ton backend n’envoie pas role
};



            // Managers go to their profile (manager dashboard); others go to the reservation page
            if (isManager(user)) {
                navigate('/profile', { replace: true });
                return;
            }

            const returnTo = location.state?.from?.pathname || '/reservation/new';
            navigate(returnTo, { replace: true });
        }
        

    console.log("USER FROM REDUX:", user);


    }, [user]);
    


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
        <div className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center relative"
            style={{
                backgroundImage:
                    "url('https://i.pinimg.com/1200x/13/b5/3e/13b53ec3b54837d0c43e47dca82ab4f1.jpg')",
            }}>
                
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm w-full max-w-md border border-gray-100 text-[#568F87]">
        <h2 className="text-3xl font-bold text-center mb-8 font-['Poppins']">Login</h2>

        {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
                {typeof error === 'string' ? error : JSON.stringify(error)}
            </div>
        )}

        <div className='mb-6'>
            <label className="block text-sm font-medium mb-2 font-['Inter']" htmlFor="email">
                Email
            </label>
            <input type="email" id="email" name="email" value={form.email} onChange={handleChange} 
                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 placeholder-gray-400 font-['Inter']" 
                   required />
        </div>

        <div className='mb-8'>
            <label className="block text-sm font-medium mb-2 font-['Inter']" htmlFor="password">
                Password
            </label>
            <input type="password" id="password" name="password" value={form.password} onChange={handleChange} 
                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 placeholder-gray-400 font-['Inter']" 
                   required />
        </div>

        <button type="submit" disabled={loading} 
                className="w-full bg-[#568F87] text-white py-3.5 rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black font-['Inter']">
            {loading ? 'Loading...' : 'Login'}
        </button>

        <div className="mt-6 text-center">
            <p className="text-sm font-['Inter']">
                Pas de compte ?{' '}
                <Link to="/register" className="text-[#568F87] font-medium hover:text-[#446d64] transition-colors">
                    S'inscrire
                </Link>
            </p>
        </div>
    </form>
</div>

    )

}