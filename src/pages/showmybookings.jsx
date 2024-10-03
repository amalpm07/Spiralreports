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
      const bookingsArray = Array.isArray(data.bookings) ? data.bookings : data;

      const categorizedBookings = categorizeBookings(bookingsArray);
      setBookings(categorizedBookings);
    } catch (error) {
      setError(error.message || 'Failed to load bookings');
      console.error('An error occurred while fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const categorizeBookings = (bookingsArray) => {
    const categorizedBookings = {
      completed: [],
      confirmed: [],
      pending: [],
      cancelled: [],
    };

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
    <div className="container mx-auto p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-center text-2xl font-semibold mb-4 text-gray-800">My Bookings</h2>
        <div className="flex flex-wrap justify-center gap-4 mb-4">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(category => (
            <button
              key={category}
              className={`py-2 px-4 rounded-full text-sm md:text-base font-medium ${visibleCategory === category ? 'bg-[#755AA6] text-white shadow-lg' : 'bg-white text-gray-800 shadow-sm border border-gray-300'}`}
              onClick={() => handleCategoryChange(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)} Bookings
            </button>
          ))}
        </div>

        {loading && <p className="text-center text-[#755AA6] font-medium">Loading...</p>}
        {error && <p className="text-center text-red-600 font-medium">{error}</p>}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayedBookings.length > 0 ? (
            displayedBookings.map((booking) => (
              <Link
                key={booking.id}
                to={`/booking/${booking.id}`}
                className="border border-gray-300 rounded-lg shadow-lg p-4 bg-white flex flex-col"
              >
                <p className="font-semibold text-lg mb-2">Booking ID: <span className="font-medium">{booking.id}</span></p>
                <p className="text-gray-700 mb-1">Customer Name: <span className="font-medium">{booking.customerName}</span></p>
                <p className="text-gray-700 mb-1">Service Name: <span className="font-medium">{booking.serviceName}</span></p>
                <p className="text-gray-700 mb-1">Booking Date: <span className="font-medium">{new Date(booking.bookingDate).toLocaleDateString()}</span></p>
                <p className="text-gray-700 mb-1">Service Dates: <span className="font-medium">{`${new Date(booking.serviceFromDate).toLocaleDateString()} - ${new Date(booking.serviceToDate).toLocaleDateString()}`}</span></p>
                <p className="text-gray-700">Charge: <span className="font-medium">${booking.charge.toFixed(2)}</span></p>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-500">No bookings available in this category.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingsPage;
