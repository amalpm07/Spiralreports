import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function UserListings() {
  const [userListings, setUserListings] = useState([]);
  const [showListingsError, setShowListingsError] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`https://hibow.in/api/Provider/GetListingByUserIdAndServiceName?serviceName=provider%20boardingquestions&userId=${currentUser.id}`);

      // Check if the response status is OK (status code 200-299)
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      // Check if the response data indicates a failure
      if (!data || !data.serviceHome) {
        setShowListingsError(true);
        return;
      }

      setUserListings([data.serviceHome]); // Wrap it in an array since it seems to be a single object
    } catch (error) {
      console.error("Error fetching user listings:", error);
      setShowListingsError(true);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const handleListingDelete = async (listingId) => {
    // Implement delete functionality here
    // After successful deletion, update userListings state
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
                to={`/listing/${listing.id}`}
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
                <Link to={`/update-listing/${listing.userId}`}>
                  <button className='text-green-700 uppercase'>Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserListings;
