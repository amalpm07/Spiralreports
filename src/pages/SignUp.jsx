import { useState } from 'react';
import { Link } from 'react-router-dom';
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    password: '',
    userName: '',
    usertype: '',  // Added usertype to match the backend schema
    email: '',
    phoneNumber: '',
    housename: '',
    landmark: '',
    district: '',
    pincode: '',
    photo: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const validateForm = () => {
    for (let key in formData) {
      if (!formData[key]) {
        return `Please fill out the ${key} field.`;
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
  
    setLoading(true);
    try {
      const userModel = {
        ...formData,
        phoneNumber: parseInt(formData.phoneNumber, 10),
        pincode: parseInt(formData.pincode, 10),
      };
  
      console.log('User Model:', userModel); // Log the user model
  
      const response = await fetch('https://localhost:44359/User/Add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userModel }), // Pass userModel directly
      });
  // Log the formData object before sending it to the backend
console.log('Form Data:', formData);

      const data = await response.json();
  
      if (!response.ok) {
        if (data.errors && data.errors.userModel && data.errors.userModel.includes("Username already exists")) {
          throw new Error("Username already exists. Please choose another one.");
        }
        throw new Error(data.message || 'Failed to add user');
      }
  
      setLoading(false);
      setError(null);
      // Optionally, redirect the user to another page after successful submission
      // window.location.href = '/success'; // Change '/success' to the desired route
    } catch (error) {
      console.error('Error:', error); // Log error details
      setLoading(false);
      setError(error.message || 'Failed to add user');
    }
  };
  
  
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='text'
          placeholder='First Name'
          className='border p-3 rounded-lg'
          id='firstName'
          value={formData.firstName}
          onChange={handleChange}
        />
        <input
          type='text'
          placeholder='Last Name'
          className='border p-3 rounded-lg'
          id='lastName'
          value={formData.lastName}
          onChange={handleChange}
        />
        <input
          type='text'
          placeholder='Username'
          className='border p-3 rounded-lg'
          id='userName'
          value={formData.userName}
          onChange={handleChange}
        />
        <input
          type='text'
          placeholder='User Type'
          className='border p-3 rounded-lg'
          id='usertype'
          value={formData.usertype}
          onChange={handleChange}
        />
        <input
          type='email'
          placeholder='Email'
          className='border p-3 rounded-lg'
          id='email'
          value={formData.email}
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
        <input
          type='text'
          placeholder='Phone Number'
          className='border p-3 rounded-lg'
          id='phoneNumber'
          value={formData.phoneNumber}
          onChange={handleChange}
        />
        <input
          type='text'
          placeholder='House Name'
          className='border p-3 rounded-lg'
          id='housename'
          value={formData.housename}
          onChange={handleChange}
        />
        <input
          type='text'
          placeholder='Landmark'
          className='border p-3 rounded-lg'
          id='landmark'
          value={formData.landmark}
          onChange={handleChange}
        />
        <input
          type='text'
          placeholder='District'
          className='border p-3 rounded-lg'
          id='district'
          value={formData.district}
          onChange={handleChange}
        />
        <input
          type='text'
          placeholder='Pincode'
          className='border p-3 rounded-lg'
          id='pincode'
          value={formData.pincode}
          onChange={handleChange}
        />
        <input
          type='text'
          placeholder='Photo URL'
          className='border p-3 rounded-lg'
          id='photo'
          value={formData.photo}
          onChange={handleChange}
        />
        
        <button
          disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
        <OAuth />
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to={'/sign-in'}>
          <span className='text-blue-700'>Sign in</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  );
}
