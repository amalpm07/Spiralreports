/* eslint-disable react/no-unescaped-entities */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

const SignIn = () => {
  const [formData, setFormData] = useState({ userName: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { loading } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      dispatch(signInStart());

      const url = new URL('https://hibow.in/api/User/Login');
      url.searchParams.append('userName', formData.userName); // Changed from userName
      url.searchParams.append('password', formData.password);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401 && errorData.error === 'User already logged in') {
          throw new Error('User is already logged in');
        } else {
          throw new Error(errorData.message || 'Failed to sign in');
        }
      }

      const data = await response.json();
      dispatch(signInSuccess(data));
      setSuccess('Sign in successful!');

      const userType = data.usertype;
      const hasListing = data.hasListing;

      if (userType === 'Provider') {
        navigate(hasListing ? '/profile' : '/create-listing', { state: { user: data } });
      } else {
        navigate('/', { state: { user: data } });
      }
    } catch (error) {
      console.error('Error signing in:', error);
      dispatch(signInFailure(error.message || 'Failed to sign in'));
      setError(error.message || 'Failed to sign in');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-3 max-w-lg mx-auto"
    >
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
  type="text"
  placeholder="Email or Phone Number" // Changed from Username
  className="border p-3 rounded-lg"
  id="userName" // Changed from userName
  value={formData.userName} // Changed from userName
  onChange={handleChange}
/>

        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          id="password"
          value={formData.password}
          onChange={handleChange}
        />
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`bg-slate-700 text-white p-3 rounded-lg uppercase ${
            loading ? 'opacity-80 cursor-not-allowed' : 'hover:opacity-95'
          }`}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </motion.button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Don't have an account?</p>
        <Link to="/sign-up">
          <span className="text-blue-700">Sign up</span>
        </Link>
      </div>
      {error && (
        <p className="text-red-500 mt-5 text-center">
          {error === 'User is already logged in' ? (
            <span>User is already logged in. Please log out to sign in again.</span>
          ) : (
            <span>{error === 'Failed to sign in' ? 'Failed to sign in. Please check your credentials.' : error}</span>
          )}
        </p>
      )}
      {success && <p className="text-green-500 mt-5 text-center">{success}</p>}
    </motion.div>
  );
};

export default SignIn;
