/* eslint-disable react/jsx-no-undef */
import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'; // Importing useSelector
import Dropdown from './Dropdown';

export default function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  // Using useSelector to access currentUser from the Redux store
  const currentUser = useSelector((state) => state.user.currentUser);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, []);

  return (
    <header className='bg-black text-white shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to='/'>
          <h1 className='font-bold text-2xl flex flex-wrap'>
            <span className='text-gray-300'>Leash</span>
            <span className='text-gray-100'>bench</span>
          </h1>
        </Link>
        <form
          onSubmit={handleSubmit}
          className='bg-gray-800 p-3 rounded-lg flex items-center'
        >
          <input
            type='text'
            placeholder='Search...'
            className='bg-transparent focus:outline-none w-24 sm:w-64 text-gray-100'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">
            <FaSearch className='text-gray-300' />
          </button>
        </form>
        <ul className='flex gap-4'>
          {/* <Link to='/' className='text-gray-100 hover:text-gray-300'>
            <li className='hidden sm:inline'>Home</li>
          </Link> */}
          <Link to='/about' className='text-gray-100 hover:text-gray-300'>
            <li className='hidden sm:inline'>About</li>
          </Link>
          {currentUser ? (
            <Dropdown currentUser={currentUser} />
          ) : (
            <Link to='/sign-in' className='text-gray-100 hover:text-gray-300'>Sign in</Link>
          )}
          <div className='flex items-center'>
            {/* Additional content can go here */}
          </div>
        </ul>
      </div>
    </header>
  );
}
