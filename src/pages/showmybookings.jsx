/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useSelector } from 'react-redux';

// eslint-disable-next-line no-unused-vars
 function BookingsPage() {
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">My Bookings</h2>
      <button
        className={`bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200 mb-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={handleShowBookings}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Show My Bookings'}
      </button>

      {error && <p className="text-red-600">{error}</p>}

      {userBookings.length > 0 ? (
        <div className="mt-4">
          <table className="w-full border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2">Booking ID</th>
                <th className="border border-gray-300 px-4 py-2">Customer Name</th>
                <th className="border border-gray-300 px-4 py-2">Service Name</th>
                <th className="border border-gray-300 px-4 py-2">Booking Date</th>
                <th className="border border-gray-300 px-4 py-2">Service Dates</th>
                <th className="border border-gray-300 px-4 py-2">Charge</th>
                {/* Add more headers as needed */}
              </tr>
            </thead>
            <tbody>
              {userBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-gray-200">
                  <td className="border border-gray-300 px-4 py-2">{booking.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{booking.customerName}</td>
                  <td className="border border-gray-300 px-4 py-2">{booking.serviceName}</td>
                  <td className="border border-gray-300 px-4 py-2">{new Date(booking.bookingDate).toLocaleDateString()}</td>
                  <td className="border border-gray-300 px-4 py-2">{`${new Date(booking.serviceFromDate).toLocaleDateString()} - ${new Date(booking.serviceToDate).toLocaleDateString()}`}</td>
                  <td className="border border-gray-300 px-4 py-2">{`${booking.charge.toFixed(2)}`}</td>
                  {/* Add more columns based on booking data */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-4 text-gray-600">{loading ? 'Loading...' : 'No bookings found.'}</p>
      )}

      {loading && <p className="mt-4">Loading...</p>}
    </div>
  );
}

export default BookingsPage;
