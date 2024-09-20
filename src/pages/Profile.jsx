/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
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
  const { currentUser, loading, error } = useSelector((state) => state.user) || {};
  const [file, setFile] = useState(undefined);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [signOutMessage, setSignOutMessage] = useState('');
  const dispatch = useDispatch();

  const handleFileUpload = async (file) => {
    if (!file || !currentUser) return;

    const formData = new FormData();
    formData.append('files', file); // Ensure the key matches what the API expects

    try {
      const response = await fetch(`https://hibow.in/api/User/UploadProfilePhotoFile?userName=${currentUser.userName}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Token': currentUser.guid, // Pass the guid in the headers
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
    }
  };

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleDeleteUser = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    if (!confirmDelete || !currentUser) return;

    try {
      dispatch(deleteUserStart());
      const res = await fetch(`api/auth/User?userName=${currentUser?.username ?? ''}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    if (!currentUser) return;

    try {
      dispatch(signOutUserStart());
      const res = await fetch(`https://hibow.in/api/User/LoginDelete?userid=${currentUser.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Token': currentUser.guid,
        },
      });

      if (res.ok) {
        const contentType = res.headers.get('content-type');
        let data;

        if (contentType && contentType.includes('application/json')) {
          data = await res.json();
        } else {
          data = await res.text();
        }

        dispatch(signOutUserSuccess(data));
        dispatch(clearCurrentUser());
        setSignOutMessage('You have been signed out successfully.');
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to logout');
      }
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
      console.error('Sign-out error:', error);
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
        <p className="text-sm text-center mt-2">
          {fileUploadError && (
            <span className="text-red-600">Error uploading image. Please try again.</span>
          )}
        </p>
        <div className="flex flex-col gap-4 mt-4 w-full">
          <Link
            to="/showmybookings"
            className={`bg-[#755AA6] text-white py-2 px-4 rounded-lg hover:bg-[#6d4c7d] transition duration-200 text-center ${
              !currentUser && 'opacity-50 pointer-events-none'
            }`}
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
        {error && <p className="text-red-600 mt-4">{error}</p>}
      </div>
    </main>
  );
}
