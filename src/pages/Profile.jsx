/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
import { useSelector, useDispatch } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
  clearCurrentUser,
} from '../redux/user/userSlice';

export default function Profile() {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [signOutMessage, setSignOutMessage] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  const handleFileUpload = async (file) => {
    if (!file || !currentUser) return;

    const formData = new FormData();
    formData.append('files', file);

    try {
      const response = await fetch(`https://hibow.in/api/User/UploadProfilePhotoFile?userName=${currentUser.userName}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Token': currentUser.guid,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to upload profile photo: ${errorData.errors?.files[0] || 'Unknown error'}`);
      }

      const result = await response.json();
      console.log('Profile photo uploaded successfully:', result);
    } catch (error) {
      console.error('Error uploading to API:', error);
      setFileUploadError(true);
      setError(error.message);
    }
  };

  useEffect(() => {
    if (file) {
      handleFileUpload(file).finally(() => setFile(null));
    }
  }, [file]);

  const handleDeleteUser = async () => {
    if (!currentUser || !currentUser.id) {
      console.error("No user ID available for deletion.");
      return;
    }

    const confirmDelete = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (!confirmDelete) return;

    try {
      dispatch(deleteUserStart());
      const res = await fetch(`api/auth/User?userName=${currentUser.username}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (!res.ok) {
        dispatch(deleteUserFailure(data));
        setError(data.message);
      } else {
        dispatch(deleteUserSuccess(data));
        navigate('/'); // Navigate after deletion
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
      setError(error.message);
    }
  };

  const handleSignOut = async () => {
    if (!currentUser) return; // Exit if no current user

    try {
      dispatch(signOutUserStart()); // Indicate sign-out has started

      const res = await fetch(`https://hibow.in/api/User/LoginDelete?userid=${currentUser.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const data = await res.json(); // Parse response data
        dispatch(signOutUserSuccess(data));
        dispatch(clearCurrentUser());
        setSignOutMessage('User logged out successfully.'); // Updated success message
        setTimeout(() => navigate('/'), 1000); // Redirect after 1 second
      } else {
        const errorData = res.headers.get('Content-Length') > 0 
          ? await res.json() 
          : { message: 'An error occurred without a detailed message.' };

        console.error('Sign-out error response:', errorData);
        throw new Error(errorData.message || 'Failed to logout');
      }
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
      console.error('Sign-out error:', error);
      setError(error.message); // Display error message
    }
  };

  return (
    <main className="flex flex-col md:flex-row gap-8 p-8 mx-auto max-w-4xl">
      <div className="md:w-1/3 flex flex-col items-center border-r-2 border-gray-200 pr-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          src={currentUser?.avatar || 'https://assets.petbacker.com/user-images/full/avatar.jpg'}
          alt="profile_photo"
          className="w-32 h-32 rounded-full object-cover cursor-pointer"
          onClick={() => fileRef.current.click()}
        />
        {fileUploadError && (
          <p className="text-red-600 text-sm text-center mt-2">
            Error uploading image. Please try again.
          </p>
        )}
        <div className="flex flex-col gap-4 mt-4 w-full">
          <Link
            to="/showmybookings"
            className={`bg-[#755AA6] text-white py-2 px-4 rounded-lg hover:bg-[#6d4c7d] transition duration-200 text-center ${!currentUser && 'opacity-50 pointer-events-none'}`}
          >
            Bookings
          </Link>
          {currentUser && currentUser.usertype === 'Provider' && (
            <>
              <Link
                to="/create-listing"
                className="bg-[#755AA6] text-white py-2 px-4 rounded-lg hover:bg-[#6d4c7d] transition duration-200 text-center"
              >
                Create Listing
              </Link>
              <Link
                to="/showmylisting"
                className="bg-[#755AA6] text-white py-2 px-4 rounded-lg hover:bg-[#6d4c7d] transition duration-200 text-center"
              >
                Show My Listings
              </Link>
            </>
          )}
          <button
            type="button"
            className="bg-[#755AA6] text-white py-2 px-4 rounded-lg hover:bg-[#6d4c7d] transition duration-200"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
          <button
            type="button"
            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200"
            onClick={handleDeleteUser}
          >
            Delete User
          </button>
        </div>
      </div>
      <div className="md:w-2/3">
        <h4 className="text-2xl font-semibold mb-2">
          Hey, I'm <strong>{currentUser?.userName ?? 'User'}</strong>
        </h4>
        <h5 className="text-lg mb-4">{currentUser?.email}</h5>
        {error && <p className="text-red-600 mt-4">{error}</p>} {/* Display error message */}
        {signOutMessage && <p className="text-green-600 mt-4">{signOutMessage}</p>} {/* Display sign-out success message */}
      </div>
    </main>
  );
}
