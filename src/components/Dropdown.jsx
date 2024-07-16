import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { useOutsideClick } from '../Hooks/useOutsideClick';
import defaultAvatar from '../assets/avatar.jpg'; // Replace with your default avatar path

const Dropdown = ({ currentUser }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useOutsideClick(() => setDropdownVisible(false));
  const location = useLocation();

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  useEffect(() => {
    setDropdownVisible(false);
  }, [location]);

  // Render default avatar if currentUser doesn't exist or avatar is not provided
  const avatarSrc = currentUser?.avatar ? currentUser.avatar : defaultAvatar;
  const altText = currentUser?.avatar ? 'profile' : 'default profile';

  return (
    <div className='relative' ref={dropdownRef}>
      <div className="flex items-center" onClick={toggleDropdown}>
        {currentUser ? (
          <img
            className='rounded-full h-7 w-7 object-cover cursor-pointer'
            src={avatarSrc}
            alt={altText}
            aria-haspopup='true'
            aria-expanded={dropdownVisible}
          />
        ) : (
          <Link to='/sign-in' className='text-slate-700 hover:underline'>
            Sign in
          </Link>
        )}
      </div>
      {dropdownVisible && (
        <div
          className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10 transition-opacity duration-200 ease-in-out'
          role='menu'
          aria-orientation='vertical'
          aria-labelledby='profile-menu'
        >
          <span className="block px-4 py-2 text-gray-800 text-center font-bold uppercase">
            {currentUser.userName}
          </span>
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
    avatar: PropTypes.string,
    userName: PropTypes.string.isRequired,
  }),
};

export default Dropdown;
