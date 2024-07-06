import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function UserListings() {
  const [userListings, setUserListings] = useState([]);
  const [showListingsError, setShowListingsError] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    // Fetch user listings when component mounts
    handleShowListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only fetch once when component mounts

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`https://hibow.in/api/Provider/GetServiceHomeByProviderId?providerId=${currentUser.id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Token': currentUser.guid,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log('User listings data:', data); // Log data received from API
      if (!data || !Array.isArray(data) || data.length === 0) {
        setShowListingsError(true);
        setUserListings([]); // Clear listings if no valid data
        return;
      }

      setUserListings(data); // Set user listings from the API response
    } catch (error) {
      console.error("Error fetching user listings:", error);
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`https://hibow.in/api/DeleteListing/${listingId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Token': currentUser.guid,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      // Remove the deleted listing from state
      setUserListings(userListings.filter(listing => listing.id !== listingId));
    } catch (error) {
      console.error("Error deleting listing:", error);
      // Handle error state or notification
    }
  };

  return (
    <div>
      <button onClick={handleShowListings} className='text-green-700 w-full'>
        Show Listings
      </button>
      <p className='text-red-700 mt-5'>
        {showListingsError ? 'Error showing listings' : ''}
      </p>

      {userListings && userListings.length > 0 && (
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing.id}
              className='border rounded-lg p-3 flex justify-between items-center gap-4'
            >
              <Link to={`/listing/${listing.id}`}>
                <img
                  src={listing.photo1}
                  alt='listing cover'
                  className='h-16 w-16 object-contain'
                />
              </Link>
              <Link
                className='text-slate-700 font-semibold hover:underline truncate flex-1'
                to={`/listing/${listing.serviceName}/${currentUser.id}`}
              >
                <p>{listing.hostelName}</p>
              </Link>

              <div className='flex flex-col items-center'>
                <button
                  onClick={() => handleListingDelete(listing.id)}
                  className='text-red-700 uppercase'
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing.id}/${listing.serviceName}`}>
                  <button className='text-green-700 uppercase'>Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Display a message if there are no listings */}
      {!showListingsError && userListings.length === 0 && (
        <p className='text-center mt-5 text-gray-600'>
          No listings found.
        </p>
      )}
    </div>
  );
}

export default UserListings;
