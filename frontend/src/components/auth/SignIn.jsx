// frontend/src/components/auth/SignIn.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '/Users/rizon/Desktop/Buddhir_Bati_2/frontend/src/assets/output-onlinepngtools (1).png'; // Adjust path if needed

export const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signin(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to sign in');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <form className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg space-y-8" onSubmit={handleSubmit}>
        <div className="flex justify-center mb-6">
          <img src={Logo} alt="Logo" className="h-16 w-16" /> {/* Logo */}
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
        {error && <div className="text-red-700">{error}</div>}
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Email address" 
          required 
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
        />
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Password" 
          required 
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
        />
        <button 
          type="submit" 
          className="w-full bg-indigo-600 text-white p-3 rounded-md font-medium hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Sign in
        </button>
        
        {/* Not registered yet? Sign Up link */}
        <div className="text-center text-sm text-gray-600 mt-4">
          Not registered yet?{' '}
          <Link to="/signup" className="text-indigo-600 hover:text-indigo-500 font-medium">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
};
