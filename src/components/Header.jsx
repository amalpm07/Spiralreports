import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Dropdown from './Dropdown';
import siteIcon from '../assets/leashbench.jpeg';
import { FaSearch } from 'react-icons/fa'; // Import search icon from react-icons

export default function Header() {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.currentUser);

  const handleSearchClick = () => {
    navigate('/search'); // Navigate to search page
  };

  return (
    <header className='bg-white text-black shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto px-3 py-4 sm:px-6 md:px-8 lg:px-10'>
        <Link to='/' className='flex items-center'>
          <img src={siteIcon} alt='Site Icon' className='h-12 mr-2' />
          <h1 className='font-bold text-xl sm:text-2xl flex flex-wrap'>
            <span className='text-gray-800'>Leash</span>
            <span className='text-black'>bench</span>
          </h1>
        </Link>
        <nav className='flex items-center gap-4'>
          <Link to='/about' className='text-black hover:text-gray-600'>
            <span className='hidden sm:inline'>About</span>
          </Link>
          <button 
            onClick={handleSearchClick} 
            className='flex items-center text-black hover:text-gray-600'
          >
            <FaSearch className='mr-1' />
            <span className='hidden sm:inline'>Search</span>
          </button>
          {currentUser ? (
            <Dropdown currentUser={currentUser} />
          ) : (
            <>
              <Link to='/sign-in' className='text-black hover:text-gray-600'>
                Sign In
              </Link>
              <Link to='/sign-up' className='text-black hover:text-gray-600'>
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
