/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import '../styleComponets/BookingsPage.css'; // Import the CSS file

const BookingsPage = () => {
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
      fetchBookings();
    }
  }, [currentUser]);

  const fetchBookings = async () => {
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

      setBookings(categorizeBookings(bookingsArray));
    } catch (error) {
      setError(error.message || 'Failed to load bookings');
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const categorizeBookings = (bookingsArray) => {
    return {
      completed: bookingsArray.filter(b => b.isCompleted),
      confirmed: bookingsArray.filter(b => b.isConfirmed && !b.isCompleted),
      pending: bookingsArray.filter(b => !b.isConfirmed && !b.isCompleted && b.isActive),
      cancelled: bookingsArray.filter(b => b.cancelledBy),
    };
  };

  const handleCategoryChange = (category) => {
    setVisibleCategory(category);
  };

  const displayedBookings = visibleCategory === 'all'
    ? Object.values(bookings).flat()
    : bookings[visibleCategory];

  return (
    <div className="bookings-container">
      <div className="bookings-header">
        <h2>My Bookings</h2>
        <div className="category-buttons">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(category => (
            <button
              key={category}
              className={`category-button ${visibleCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryChange(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)} Bookings
            </button>
          ))}
        </div>

        {loading && <p className="loading-text">Loading...</p>}
        {error && <p className="error-text">{error}</p>}
      </div>

      <div className="bookings-grid">
        {displayedBookings.length > 0 ? (
          displayedBookings.map((booking) => (
            <Link key={booking.id} to={`/booking/${booking.id}`} className="booking-card">
              <h3 className="booking-id">Booking ID: <span className="booking-id-value">{booking.id}</span></h3>
              <p className="booking-detail">Customer Name: <span className="booking-detail-value">{booking.customerName}</span></p>
              <p className="booking-detail">Service Name: <span className="booking-detail-value">{booking.serviceName}</span></p>
              <p className="booking-detail">Booking Date: <span className="booking-detail-value">{new Date(booking.bookingDate).toLocaleDateString()}</span></p>
              <p className="booking-detail">Service Dates: <span className="booking-detail-value">{`${new Date(booking.serviceFromDate).toLocaleDateString()} - ${new Date(booking.serviceToDate).toLocaleDateString()}`}</span></p>
              <p className="booking-detail">Charge: <span className="booking-charge">{booking.charge.toFixed(2)}</span></p>
            </Link>
          ))
        ) : (
          <p className="no-bookings">No bookings available in this category.</p>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
