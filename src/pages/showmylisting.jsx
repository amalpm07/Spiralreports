import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function UserListings() {
  const [userListings, setUserListings] = useState([]);
  const [showListingsError, setShowListingsError] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    handleShowListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      if (!Array.isArray(data)) {
        setShowListingsError(true);
        return;
      }

      if (data.length === 0) {
        setShowListingsError(false);
      } else {
        setUserListings(data);
      }
    } catch (error) {
      console.error("Error fetching user listings:", error);
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`https://hibow.in/api/Provider/DeleteServiceHomeDetails?serviceHomeId=${listingId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Token': currentUser.guid,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      setUserListings(userListings.filter(listing => listing.id !== listingId));
    } catch (error) {
      console.error("Error deleting listing:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Your Listings</h1>
      <p className='text-red-700 mt-5 text-center'>
        {showListingsError ? 'Error showing listings' : ''}
      </p>

      {userListings.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6'>
          {userListings.map((listing) => (
            <div key={listing.id} className='border rounded-lg shadow-lg overflow-hidden bg-white transition-transform transform hover:scale-105'>
              <Link to={`/listing/${listing.id}`}>
                <img
                  src={listing.photo1}
                  alt='listing cover'
                  className='h-48 w-full object-cover'
                />
              </Link>
              <div className='p-4'>
                <Link
                  className='text-slate-700 font-semibold hover:underline truncate'
                  to={`/listing/${listing.serviceName}/${currentUser.id}`}
                >
                  <p>{listing.hostelName}</p>
                </Link>
                <div className='flex justify-between mt-4'>
                  <button
                    onClick={() => handleListingDelete(listing.id)}
                    className='text-red-700 hover:underline'
                  >
                    Delete
                  </button>
                  <Link to={`/update-listing/${listing.id}/${listing.serviceName}`}>
                    <button className='text-blue-600 hover:underline'>Edit</button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !showListingsError && (
          <p className='text-center mt-5 text-gray-600'>
            No listings found.
          </p>
        )
      )}
    </div>
  );
}

export default UserListings;
