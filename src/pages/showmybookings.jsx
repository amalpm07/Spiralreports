/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'; // Import Link for navigation

function BookingsPage() {
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser) {
      handleShowBookings();
    }
  }, [currentUser]);

  const handleShowBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://hibow.in/api/Booking/GetBookingDetailsByUserTypeAndId?userType=${currentUser.usertype}&userId=${currentUser.id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Token': currentUser.guid, // Assuming currentUser.guid contains the token
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();

      if (!data || !Array.isArray(data.booking)) {
        throw new Error('Invalid data format received');
      }

      setUserBookings(data.booking);
    } catch (error) {
      setError(error.message || 'Failed to load bookings');
      console.error('An error occurred while fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-semibold mb-8 text-center">My Bookings</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {userBookings.length > 0 ? (
          userBookings.map((booking) => (
            <Link
              key={booking.id}
              to={`/booking/${booking.id}`} // Navigate to booking details page with booking ID
              className="relative border border-gray-200 rounded-lg p-6 block hover:bg-gray-50"
            >
              <p className="font-semibold">Booking ID: {booking.id}</p>
              <p>Customer Name: {booking.customerName}</p>
              <p>Service Name: {booking.serviceName}</p>
              <p>Booking Date: {new Date(booking.bookingDate).toLocaleDateString()}</p>
              <p>Service Dates: {`${new Date(booking.serviceFromDate).toLocaleDateString()} - ${new Date(booking.serviceToDate).toLocaleDateString()}`}</p>
              <p>Charge: {`${booking.charge.toFixed(2)}`}</p>
              {booking.isConfirmed && (
                <p className="text-green-600 font-semibold absolute bottom-4 right-4">
                  Confirmed
                </p>
              )}
              {booking.isCancelled && (
                <p className="text-red-600 font-semibold absolute bottom-4 right-4">
                  Cancelled
                </p>
              )}
            </Link>
          ))
        ) : (
          <p className="text-lg text-gray-600 mt-4 mx-auto">
            {loading ? 'Loading...' : 'No bookings found.'}
          </p>
        )}
      </div>

      {loading && <p className="mt-8 text-center">Loading...</p>}
      {error && <p className="mt-8 text-center text-red-600">{error}</p>}

      {/* Show button to fetch bookings */}
      {!loading && userBookings.length === 0 && !error && (
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg mt-8 mx-auto block"
          onClick={handleShowBookings}
          disabled={loading}
        >
          Show My Bookings
        </button>
      )}
    </div>
  );
}

export default BookingsPage;
