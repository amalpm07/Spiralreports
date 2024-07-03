import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useOutsideClick } from '../Hooks/useOutsideClick';

const Dropdown = ({ currentUser }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useOutsideClick(() => setDropdownVisible(false));
  
  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };
  
  return (
    <div className='relative' ref={dropdownRef}>
      {currentUser ? (
        <img
          onClick={toggleDropdown}
          className='rounded-full h-7 w-7 object-cover cursor-pointer'
          src={currentUser.avatar}
          alt='profile'
          aria-haspopup='true'
          aria-expanded={dropdownVisible}
        />
      ) : (
        <Link to='/sign-in' className='text-slate-700 hover:underline'>
          Sign in
        </Link>
      )}
      {dropdownVisible && (
        <div
          className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10 transition-opacity duration-200 ease-in-out'
          role='menu'
          aria-orientation='vertical'
          aria-labelledby='profile-menu'
        >
          <Link to='/profile' className='block px-4 py-2 text-gray-800 hover:bg-gray-200' role='menuitem'>
            Profile
          </Link>
          {/* <Link to='/settings' className='block px-4 py-2 text-gray-800 hover:bg-gray-200' role='menuitem'>
            Settings
          </Link> */}
          {/* <button
            onClick={() => {
              // Add your logout logic here
              console.log('Logout clicked');
              setDropdownVisible(false); // Close the dropdown
            }}
            className='block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200'
            role='menuitem'
          >
            Logout
          </button> */}
        </div>
      )}
    </div>
  );
};

// Define prop types
Dropdown.propTypes = {
  currentUser: PropTypes.shape({
    avatar: PropTypes.string.isRequired,
  }),
};

export default Dropdown;
