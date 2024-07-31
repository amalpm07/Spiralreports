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
  const [visibleCategory, setVisibleCategory] = useState('all'); // State to manage the visible category
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

  // Determine which bookings to show based on `visibleCategory`
  const displayedBookings = visibleCategory === 'all'
    ? Object.values(bookings).flat()
    : bookings[visibleCategory];

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-semibold mb-8 text-center">My Bookings</h2>

      <div className="mb-6 flex justify-center flex-wrap space-x-4">
        <button
          className={`py-2 px-4 rounded-lg transition-colors ${visibleCategory === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-600 hover:text-white`}
          onClick={() => handleCategoryChange('all')}
        >
          All Bookings
        </button>
        <button
          className={`py-2 px-4 rounded-lg transition-colors ${visibleCategory === 'pending' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-600 hover:text-white`}
          onClick={() => handleCategoryChange('pending')}
        >
          Pending Bookings
        </button>
        <button
          className={`py-2 px-4 rounded-lg transition-colors ${visibleCategory === 'confirmed' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-600 hover:text-white`}
          onClick={() => handleCategoryChange('confirmed')}
        >
          Confirmed Bookings
        </button>
        <button
          className={`py-2 px-4 rounded-lg transition-colors ${visibleCategory === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-600 hover:text-white`}
          onClick={() => handleCategoryChange('completed')}
        >
          Completed Bookings
        </button>
        <button
          className={`py-2 px-4 rounded-lg transition-colors ${visibleCategory === 'cancelled' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-600 hover:text-white`}
          onClick={() => handleCategoryChange('cancelled')}
        >
          Cancelled Bookings
        </button>
      </div>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      <div className="space-y-8">
        {displayedBookings.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {displayedBookings.map((booking) => (
              <Link
                key={booking.id}
                to={`/booking/${booking.id}`}
                className="border border-gray-200 rounded-lg p-6 block hover:bg-gray-50 transition-colors"
              >
                <p className="font-semibold">Booking ID: {booking.id}</p>
                <p>Customer Name: {booking.customerName}</p>
                <p>Service Name: {booking.serviceName}</p>
                <p>Booking Date: {new Date(booking.bookingDate).toLocaleDateString()}</p>
                <p>Service Dates: {`${new Date(booking.serviceFromDate).toLocaleDateString()} - ${new Date(booking.serviceToDate).toLocaleDateString()}`}</p>
                <p>Charge: ${booking.charge.toFixed(2)}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-lg text-gray-600 mt-4 text-center">
            {loading ? 'Loading...' : `No ${visibleCategory} bookings found.`}
          </p>
        )}

        {!loading && displayedBookings.length === 0 && visibleCategory === 'all' && (
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg mt-8 mx-auto block"
            onClick={handleShowBookings}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Show My Bookings'}
          </button>
        )}
      </div>
    </div>
  );
}

export default BookingsPage;
