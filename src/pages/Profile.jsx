/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
import { useSelector, useDispatch } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {  useNavigate } from 'react-router-dom';

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from '../redux/user/userSlice';
import { Link } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();

  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user) || {};
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [userBookings, setUserBookings] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [showBookingsError, setShowBookingsError] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  useEffect(() => {
    if (currentUser) {
      console.log('Current User:', currentUser);
    }
  }, [currentUser]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      () => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleDeleteUser = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
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
      });

      if (res.ok) {
        const data = await res.json();
        dispatch(signOutUserSuccess(data));
        navigate('/')
        
      }
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to logout');
     
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
      console.error('Sign-out error:', error);
    }
  };

  const handleShowListings = async () => {
    if (!currentUser) return;
  
    try {
      setShowListingsError(false);
      const res = await fetch(`https://hibow.in/api/Provider/GetServiceHomeByUserId?serviceName=Provider%20BoardingQuestions&userId=${currentUser.id}`);
      console.log('API Response:', res); // Log the API response
      const data = await res.json();
      console.log('Data:', data); // Log the parsed data
  
      if (!res.ok || !data.success) {
        setShowListingsError(true);
        // console.error('Failed to fetch listings:', data.message);
        return;
      }
  
      console.log('Listings:', data); // Log the listings data
      setUserListings(data.listings); // Assuming data.listings is an array of listings
    } catch (error) {
      setShowListingsError(true);
      console.error('An error occurred while fetching listings:', error.message);
    }
  };
  
  


  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!data.success) {
        console.log(data.message);
        return;
      }
      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
    } catch (error) {
      console.log(error.message);
    }
  };

  if (!currentUser) {
    return null; // Or render a loading state, or redirect to login, etc.
  }

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
          src={formData?.avatar || currentUser?.avatar || 'https://assets.petbacker.com/user-images/full/avatar.jpg'}
          alt="profile_photo"
          className="w-32 h-32 rounded-full object-cover cursor-pointer"
          onClick={() => fileRef.current.click()}
        />
        <p className="text-sm text-center mt-2">
          {fileUploadError ? (
            <span className="text-red-600">Error uploading image (image must be less than 2 MB)</span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-yellow-600">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-600">Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>
        <div className="flex flex-col gap-4 mt-4 w-full">
        <Link
            to="/showmybookings"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200 text-center"
          >
            Bookings
          </Link>
          <Link
            to="/create-listing"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200 text-center"
          >
            Create Listing
          </Link>
          <button
            type="button"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
            onClick={handleShowListings}
            disabled={loading}
          >
            Show My Listings
          </button>
          {showListingsError && (
            <p className="text-red-600 mt-4">Failed to load listings. Please try again later.</p>
          )}

          {userListings.length > 0 && (
            <div className="mt-4 w-full">
              <h4 className="mb-2 text-xl font-semibold">My Listings</h4>
              {userListings.map((data) => (
                <div key={data.id} className="border p-4 rounded-lg mb-2">
                  <h5 className="text-lg font-semibold">{data.hostelName}</h5>
                  <p className="text-sm mb-2">{data.address}</p>
                  <p className="text-sm mb-2">{data.description}</p>
                  {data.photo1 && (
                    <img
                      src={data.photo1}
                      alt="listing_photo"
                      className="w-full h-32 object-cover mb-2"
                    />
                  )}
                  <button
                    type="button"
                    className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600 transition duration-200"
                    onClick={() => handleListingDelete(data.id)}
                    disabled={loading}
                  >
                    Delete Listing
                  </button>
                </div>
              ))}
            </div>
          )}

          
          <button
            type="button"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
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
        {error && (
          <p className="text-red-600 mt-4">{error}</p>
        )}
        {updateSuccess && (
          <p className="text-green-600 mt-4">Profile updated successfully!</p>
        )}
      </div>
    </main>
  );
}
