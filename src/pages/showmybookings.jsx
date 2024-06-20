/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useSelector } from 'react-redux';

function BookingsPage() {
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedBookingId, setExpandedBookingId] = useState(null); // State to track expanded booking
  const { currentUser } = useSelector((state) => state.user);

  const handleShowBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://hibow.in/api/Booking/GetBookingDetailsByProvider?providerId=${currentUser.id}`);
      
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      
      const data = await res.json();
      
      if (!data || !Array.isArray(data)) {
        throw new Error('Invalid data format received');
      }
      
      setUserBookings(data);
    } catch (error) {
      setError(error.message || 'Failed to load bookings');
      console.error('An error occurred while fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpandBooking = (bookingId) => {
    if (expandedBookingId === bookingId) {
      setExpandedBookingId(null);
    } else {
      setExpandedBookingId(bookingId);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-semibold mb-8 text-center">My Bookings</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {userBookings.length > 0 ? (
          userBookings.map((booking) => (
            <div key={booking.id} className="border border-gray-200 rounded-lg p-6">
              <p className="font-semibold">Booking ID: {booking.id}</p>
              <p>Customer Name: {booking.customerName}</p>
              <p>Service Name: {booking.serviceName}</p>
              <p>Booking Date: {new Date(booking.bookingDate).toLocaleDateString()}</p>
              <p>Service Dates: {`${new Date(booking.serviceFromDate).toLocaleDateString()} - ${new Date(booking.serviceToDate).toLocaleDateString()}`}</p>
              <p>Charge: ${`${booking.charge.toFixed(2)}`}</p>

              {/* Additional details hidden by default */}
              {expandedBookingId === booking.id && (
                <div className="mt-4">
                  <p className="text-gray-700">Additional details can go here.</p>
                </div>
              )}

              {/* Toggle expand button */}
              <button
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm"
                onClick={() => toggleExpandBooking(booking.id)}
              >
                {expandedBookingId === booking.id ? 'Hide Details' : 'View More'}
              </button>
            </div>
          ))
        ) : (
          <p className="text-lg text-gray-600 mt-4 mx-auto"> {loading ? 'Loading...' : 'No bookings found.'} </p>
        )}
      </div>

      {loading && <p className="mt-8 text-center">Loading...</p>}
      {error && <p className="mt-8 text-center text-red-600">{error}</p>}
      
      {/* Show button to fetch bookings */}
      {!loading && userBookings.length === 0 && (
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg mt-8 mx-auto block"
          onClick={handleShowBookings}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Show My Bookings'}
        </button>
      )}
    </div>
  );
}

export default BookingsPage;
