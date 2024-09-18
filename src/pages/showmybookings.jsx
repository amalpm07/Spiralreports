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
    if (currentUser && currentUser.id && currentUser.guid) {
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

      const categorizedBookings = categorizeBookings(data);
      setBookings(categorizedBookings);
    } catch (error) {
      setError(error.message || 'Failed to load bookings');
      console.error('An error occurred while fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const categorizeBookings = (data) => {
    const categorizedBookings = {
      completed: [],
      confirmed: [],
      pending: [],
      cancelled: [],
    };

    const bookingsArray = Array.isArray(data) ? data : data.booking || [];
    categorizedBookings.completed = bookingsArray.filter(b => b.isCompleted);
    categorizedBookings.confirmed = bookingsArray.filter(b => b.isConfirmed && !b.isCompleted);
    categorizedBookings.pending = bookingsArray.filter(b => !b.isConfirmed && !b.isCompleted && b.isActive);
    categorizedBookings.cancelled = bookingsArray.filter(b => b.cancelledBy);

    return categorizedBookings;
  };

  const handleCategoryChange = (category) => {
    setVisibleCategory(category);
  };

  const displayedBookings = visibleCategory === 'all'
    ? Object.values(bookings).flat()
    : bookings[visibleCategory];

  return (
    <div className="container mx-auto p-4 md:p-6">
      <style>
        {`
          .card-hover:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
        `}
      </style>

      <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center text-gray-800">My Bookings</h2>

      <div className="mb-6 flex flex-wrap justify-center gap-4">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(category => (
          <button
            key={category}
            className={`py-3 px-6 rounded-full text-sm md:text-base font-medium transition-colors ${visibleCategory === category ? 'bg-[#755AA6] text-white shadow-lg' : 'bg-gray-200 text-gray-800 shadow-sm'} hover:bg-[#6d4c7d] hover:text-white`}
            onClick={() => handleCategoryChange(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)} Bookings
          </button>
        ))}
      </div>

      {loading && <p className="text-center text-[#755AA6] font-medium">Loading...</p>}
      {error && <p className="text-center text-red-600 font-medium">{error}</p>}

      <div className="mt-6">
        {displayedBookings.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {displayedBookings.map((booking) => (
              <Link
                key={booking.id}
                to={`/booking/${booking.id}`}
                className="border border-gray-300 rounded-lg shadow-lg p-4 bg-white hover:bg-gray-50 transition-colors flex flex-col card-hover"
              >
                <p className="font-semibold text-lg mb-2">Booking ID: {booking.id}</p>
                <p className="text-gray-700 mb-1">Customer Name: {booking.customerName}</p>
                <p className="text-gray-700 mb-1">Service Name: {booking.serviceName}</p>
                <p className="text-gray-700 mb-1">Booking Date: {new Date(booking.bookingDate).toLocaleDateString()}</p>
                <p className="text-gray-700 mb-1">Service Dates: {`${new Date(booking.serviceFromDate).toLocaleDateString()} - ${new Date(booking.serviceToDate).toLocaleDateString()}`}</p>
                <p className="text-gray-700">Charge: ${booking.charge.toFixed(2)}</p>
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default BookingsPage;
