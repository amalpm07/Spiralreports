/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import '../styleComponets/BookingDetailsPage.css'; // Import the CSS file

const BookingDetailsPage = () => {
  const { id } = useParams();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const [isBookingCancelled, setIsBookingCancelled] = useState(false);

  const fetchBookingDetails = async () => {
    try {
      const res = await fetch(`https://hibow.in/api/Booking/GetBookingDetailsByBookingId?bookingId=${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Token': currentUser.guid,
        },
      });
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
      setBookingDetails(data);
      setIsBookingConfirmed(data.isConfirmed);
      setIsBookingCancelled(data.isCancelled);
    } catch (error) {
      console.error('Error fetching booking details:', error);
    }
  };

  useEffect(() => {
    fetchBookingDetails();
  }, [id, currentUser.guid]);

  const handleCancelBooking = async () => {
    try {
      const res = await fetch(`https://hibow.in/api/Booking/CancelBooking?bookingId=${id}&canceledBy=${currentUser.usertype}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Token': currentUser.guid,
        },
      });
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      await fetchBookingDetails();
      setPopupMessage("Booking successfully cancelled.");
      setShowPopup(true);
      setIsBookingCancelled(true);
      setIsBookingConfirmed(false);
    } catch (error) {
      setPopupMessage(`An error occurred: ${error.message}`);
      setShowPopup(true);
    }
  };

  const handleConfirmBooking = async () => {
    try {
      const res = await fetch(`https://hibow.in/api/Booking/ConfirmBooking?bookingId=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Token': currentUser.guid,
        },
      });
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      await fetchBookingDetails();
      setPopupMessage("Booking successfully confirmed.");
      setShowPopup(true);
      setIsBookingConfirmed(true);
      setIsBookingCancelled(false);
    } catch (error) {
      setPopupMessage(`An error occurred: ${error.message}`);
      setShowPopup(true);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setPopupMessage("");
  };

  if (!bookingDetails) {
    return <p className="loading-text">Loading...</p>;
  }

  const serviceName = bookingDetails.serviceName.replace(/\s+/g, '-').toLowerCase(); // Convert to URL-friendly format
  const serviceId = bookingDetails.providerId; // Assuming serviceId is available in bookingDetails

  return (
    <div className="booking-details-container">
      <h2 className="heading">Booking Details</h2>
      <div className="details-card">
        <div className="details-grid">
          <p className="detail"><strong>Customer Name:</strong> {bookingDetails.customerName}</p>
          <p className="detail"><strong>Service Name:</strong> {bookingDetails.serviceName}</p>
          <p className="detail"><strong>Booking Date:</strong> {new Date(bookingDetails.bookingDate).toLocaleString()}</p>
          <p className="detail"><strong>Service From Date:</strong> {new Date(bookingDetails.serviceFromDate).toLocaleString()}</p>
          <p className="detail"><strong>Service To Date:</strong> {new Date(bookingDetails.serviceToDate).toLocaleString()}</p>
          <p className="detail"><strong>Days Count:</strong> {bookingDetails.daysCount}</p>
          <p className="detail"><strong>Charge:</strong> {bookingDetails.charge}</p>
        </div>
        <div className="button-container">
          {!isBookingConfirmed && !isBookingCancelled && (
            <>
              <button className="button cancel-button" onClick={handleCancelBooking}>
                Cancel
              </button>
              {currentUser.usertype === 'provider' ? (
                <button className="button confirm-button" onClick={handleConfirmBooking}>
                  Confirm
                </button>
              ) : (
                <Link to={`/edit-booking/${id}`} className="button edit-button">
                  Edit
                </Link>
              )}
            </>
          )}
          {isBookingConfirmed && (
            <div className="status confirmed">
              <FontAwesomeIcon icon={faCheckCircle} />
              <span>Confirmed</span>
            </div>
          )}
          {isBookingCancelled && (
            <div className="status cancelled">
              <FontAwesomeIcon icon={faTimesCircle} />
              <span>Cancelled</span>
            </div>
          )}
        </div>
        <div className="service-provider-link">
          <Link to={`/listing/${serviceName}/${serviceId}`} className="button provider-button">
            View Service Providers Profile 
          </Link>
        </div>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <p className="popup-message">{popupMessage}</p>
            <button className="button close-popup" onClick={handleClosePopup}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingDetailsPage;
