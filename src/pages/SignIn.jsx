/* eslint-disable react/no-unescaped-entities */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
import OAuth from '../components/OAuth';
import { motion } from 'framer-motion'; // Import framer-motion for animations

export default function SignIn() {
  const [formData, setFormData] = useState({ userName: '', password: '' });
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());

      const url = new URL('https://localhost:44359/User/Login');
      url.searchParams.append('userName', formData.userName);
      url.searchParams.append('password', formData.password);
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        dispatch(signInSuccess(data)); // Assuming data contains user information
        
        // Determine the type of user
        const userType = data.usertype; // Assuming 'usertype' is the property indicating user type
      
        // Redirect based on user type and pass user details
        if (userType === 'user') {
          navigate('/', { state: { user: data } }); // Redirect to the home page and pass user details
        } else if (userType === 'provider') {
          navigate('/create-listing', { state: { user: data } }); // Redirect to create listing page and pass user details
        } else {
          // Handle other user types or scenarios
          // You can also have a default route here
        }
      } else if (response.status === 400) {
        const data = await response.json();
        if (data.message === 'User does not exist') {
          throw new Error('User does not exist');
        } else {
          throw new Error(data.message || 'Failed to sign in');
        }
      } else {
        throw new Error('Failed to sign in');
      }
    } catch (error) {
      dispatch(signInFailure(error.message || 'Failed to sign in'));
    }
  };
  
  return (
    <motion.div // Add motion div for animations
      initial={{ opacity: 0, y: -20 }} // Initial animation
      animate={{ opacity: 1, y: 0 }} // Animation on load
      transition={{ duration: 0.5 }} // Animation duration
      className='p-3 max-w-lg mx-auto'
    >
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='text'
          placeholder='Username'
          className='border p-3 rounded-lg'
          id='userName'
          value={formData.userName}
          onChange={handleChange}
        />
        <input
          type='password'
          placeholder='Password'
          className='border p-3 rounded-lg'
          id='password'
          value={formData.password}
          onChange={handleChange}
        />
        <motion.button
  disabled={loading}
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className={`bg-slate-700 text-white p-3 rounded-lg uppercase ${
    loading ? 'opacity-80 cursor-not-allowed' : 'hover:opacity-95'
  }`}
>Sign In
  {/* {loading ? 'Sign In...' : 'Sign In'} */}
</motion.button>

        <OAuth />
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Don't have an account?</p>
        <Link to='/sign-up'>
          <span className='text-blue-700'>Sign up</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </motion.div>
  );
}
