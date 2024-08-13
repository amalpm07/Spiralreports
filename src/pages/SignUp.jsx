import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaHome,
  FaMapMarkerAlt,
  FaCity,
  FaSignInAlt,
} from 'react-icons/fa';

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    password: '',
    usertype: '',
    email: '',
    phoneNumber: '',
    housename: '',
    landmark: '',
    district: '',
    pincode: '',
    photo: '',
  });

  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [phoneError, setPhoneError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    if (id === 'phoneNumber') {
      if (/^\d*$/.test(value) && value.length <= 10) {
        setFormData((prevData) => ({
          ...prevData,
          [id]: value,
        }));
      }
      if (value.length === 10) {
        setPhoneError(null);
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [id]: type === 'checkbox' ? checked : value,
      }));
    }
    if (id === 'email') {
      setEmailError(null); // Reset email error when user types
    }
    if (id === 'phoneNumber') {
      setPhoneError(null); // Reset phone error when user types
    }
  };

  const handleUserTypeChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      usertype: e.target.value,
    }));
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const pincodeRegex = /^\d{6}$/;

    if (!formData.firstName.trim()) return 'Please enter your first name.';
    if (!formData.lastName.trim()) return 'Please enter your last name.';
    if (!formData.usertype.trim()) return 'Please select a user type.';
    if (!formData.email.trim()) return 'Please enter your email.';
    if (!emailRegex.test(formData.email)) {
      setEmailError('Invalid email address.');
      return 'Please enter a valid email.';
    }
    if (!formData.password.trim()) return 'Please enter a password.';
    if (formData.password.length < 6) return 'Password must be at least 6 characters.';
    if (!formData.phoneNumber.trim()) return 'Please enter your phone number.';
    if (!phoneRegex.test(formData.phoneNumber)) {
      setPhoneError('Phone number must be exactly 10 digits.');
      return 'Please enter a valid 10-digit phone number.';
    }
    if (!formData.housename.trim()) return 'Please enter your house name.';
    if (!formData.landmark.trim()) return 'Please enter your landmark.';
    if (!formData.district.trim()) return 'Please enter your district.';
    if (!formData.pincode.trim()) return 'Please enter your pincode.';
    if (!pincodeRegex.test(formData.pincode)) return 'Please enter a valid 6-digit pincode.';

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
        phoneNumber: formData.phoneNumber.toString(),
        pincode: formData.pincode.toString(),
        photo: '',
      };
  
      const response = await fetch('https://hibow.in/api/User/Add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userModel),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          setError(errorJson.error || 'Failed to sign up.');
        } catch {
          setError(errorText);
        }
        setLoading(false);
        return;
      }
  
      alert('Sign up successful! Please sign in with your credentials.');
      setLoading(false);
      setError(null);
      navigate('/sign-in');
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
      setError(error.message || 'Failed to add user');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="p-4 sm:p-8 bg-white shadow-2xl rounded-lg max-w-2xl w-full">
        <h1 className="text-2xl sm:text-4xl text-center font-bold mb-6 sm:mb-8 text-gray-800">
          Sign Up
        </h1>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
        >
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <div className="relative">
              <FaUser className="inline-block h-5 w-5 text-gray-400 mr-3" />
              <input
                type="text"
                className="border p-2 sm:p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <div className="relative">
              <FaUser className="inline-block h-5 w-5 text-gray-400 mr-3" />
              <input
                type="text"
                className="border p-2 sm:p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
              />
            </div>
          </div>
          <div className="flex flex-col sm:col-span-2">
            <label className="text-sm font-medium text-gray-700 mb-1">
              User Type
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="usertype"
                  value="Provider"
                  checked={formData.usertype === 'Provider'}
                  onChange={handleUserTypeChange}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-gray-700">Provider</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="usertype"
                  value="Customer"
                  checked={formData.usertype === 'Customer'}
                  onChange={handleUserTypeChange}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-gray-700">Customer</span>
              </label>
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <FaEnvelope className="inline-block h-5 w-5 text-gray-400 mr-3" />
              <input
                type="email"
                className={`border p-2 sm:p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 ${
                  emailError ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                }`}
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
              />
            </div>
            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <FaLock className="inline-block h-5 w-5 text-gray-400 mr-3" />
              <input
                type="password"
                className="border p-2 sm:p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <FaPhone className="inline-block h-5 w-5 text-gray-400 mr-3" />
              <input
                type="text"
                className={`border p-2 sm:p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 ${
                  phoneError ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                }`}
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Phone Number"
              />
            </div>
            {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              House Name
            </label>
            <div className="relative">
              <FaHome className="inline-block h-5 w-5 text-gray-400 mr-3" />
              <input
                type="text"
                className="border p-2 sm:p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="housename"
                value={formData.housename}
                onChange={handleChange}
                placeholder="House Name"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Landmark
            </label>
            <div className="relative">
              <FaMapMarkerAlt className="inline-block h-5 w-5 text-gray-400 mr-3" />
              <input
                type="text"
                className="border p-2 sm:p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="landmark"
                value={formData.landmark}
                onChange={handleChange}
                placeholder="Landmark"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              District
            </label>
            <div className="relative">
              <FaCity className="inline-block h-5 w-5 text-gray-400 mr-3" />
              <input
                type="text"
                className="border p-2 sm:p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="District"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Pincode
            </label>
            <div className="relative">
              <FaMapMarkerAlt className="inline-block h-5 w-5 text-gray-400 mr-3" />
              <input
                type="text"
                className="border p-2 sm:p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Pincode"
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-lg uppercase hover:from-blue-700 hover:to-indigo-700 disabled:bg-blue-400 col-span-1 sm:col-span-2 flex items-center justify-center transition duration-300"
          >
            {loading ? 'Loading...' : <FaSignInAlt className="mr-2" />}
            Sign Up
          </button>
          {/* <OAuth className="col-span-1 sm:col-span-2" /> */}
        </form>
        <div className="flex justify-center mt-5">
          <p>Have an account?</p>
          <Link to={'/sign-in'} className="text-blue-600 ml-2">
            Sign in
          </Link>
        </div>
        {error && (
          <p className="text-red-500 mt-5 text-center">{error}</p>
        )}
      </div>
    </div>
  );
}
