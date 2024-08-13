/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function BookingsPage() {
  const [bookings, setBookings] = useState({
    completed: [],
    confirmed: [],
    pending: [],
    cancelled: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visibleCategory, setVisibleCategory] = useState('all');
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    handleShowBookings();
  }, []);

  const handleShowBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://hibow.in/api/Booking/GetBookingDetailsByUserTypeAndId?userType=${currentUser.usertype}&userId=${currentUser.id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Token': currentUser.guid,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();

      if (!data || (!Array.isArray(data) && !Array.isArray(data.booking))) {
        throw new Error('Invalid data format received');
      }

      let categorizedBookings = {
        completed: [],
        confirmed: [],
        pending: [],
        cancelled: [],
      };

      if (Array.isArray(data)) {
        categorizedBookings.completed = data.filter(b => b.isCompleted);
        categorizedBookings.confirmed = data.filter(b => b.isConfirmed && !b.isCompleted);
        categorizedBookings.pending = data.filter(b => !b.isConfirmed && !b.isCompleted && b.isActive);
        categorizedBookings.cancelled = data.filter(b => b.cancelledBy);
      } else if (Array.isArray(data.booking)) {
        categorizedBookings.completed = data.booking.filter(b => b.isCompleted);
        categorizedBookings.confirmed = data.booking.filter(b => b.isConfirmed && !b.isCompleted);
        categorizedBookings.pending = data.booking.filter(b => !b.isConfirmed && !b.isCompleted && b.isActive);
        categorizedBookings.cancelled = data.booking.filter(b => b.cancelledBy);
      }

      setBookings(categorizedBookings);
    } catch (error) {
      setError(error.message || 'Failed to load bookings');
      console.error('An error occurred while fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setVisibleCategory(category);
  };

  const displayedBookings = visibleCategory === 'all'
    ? Object.values(bookings).flat()
    : bookings[visibleCategory];

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center text-gray-800">My Bookings</h2>

      <div className="mb-6 flex flex-wrap justify-center gap-2 md:gap-4">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(category => (
          <button
            key={category}
            className={`py-3 px-6 rounded-full text-sm md:text-base font-medium transition-colors ${visibleCategory === category ? 'bg-[#755AA6] text-white shadow-md' : 'bg-gray-200 text-gray-800 shadow-sm'} hover:bg-[#6d4c7d] hover:text-white`}
            onClick={() => handleCategoryChange(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)} Bookings
          </button>
        ))}
      </div>

      {loading && <p className="text-center text-[#755AA6] font-medium">Loading...</p>}
      {error && <p className="text-center text-red-600 font-medium">{error}</p>}

      <div className="space-y-4 md:space-y-8">
        {displayedBookings.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {displayedBookings.map((booking) => (
              <Link
                key={booking.id}
                to={`/booking/${booking.id}`}
                className="border border-gray-300 rounded-lg shadow-lg p-4 bg-white hover:bg-gray-50 transition-colors"
              >
                <p className="font-semibold text-lg">Booking ID: {booking.id}</p>
                <p className="text-gray-700">Customer Name: {booking.customerName}</p>
                <p className="text-gray-700">Service Name: {booking.serviceName}</p>
                <p className="text-gray-700">Booking Date: {new Date(booking.bookingDate).toLocaleDateString()}</p>
                <p className="text-gray-700">Service Dates: {`${new Date(booking.serviceFromDate).toLocaleDateString()} - ${new Date(booking.serviceToDate).toLocaleDateString()}`}</p>
                <p className="text-gray-700">Charge: ${booking.charge.toFixed(2)}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-lg text-gray-600 mt-4 text-center">
            {loading ? 'Loading...' : `No ${visibleCategory} bookings found.`}
          </p>
        )}
      </div>
    </div>
  );
}

export default BookingsPage;
