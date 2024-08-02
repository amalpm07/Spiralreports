import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

function BookingDetailsPage() {
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
          'Token': currentUser.guid
        }
      });
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
      setBookingDetails(data);
      setIsBookingConfirmed(data.isConfirmed);
      setIsBookingCancelled(data.isCancelled);
    } catch (error) {
      console.error('An error occurred while fetching booking details:', error);
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
          'Token': currentUser.guid
        }
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
          'Token': currentUser.guid
        }
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
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">Booking Details</h2>
      <div className="bg-white shadow-lg rounded-lg p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <p className="text-lg text-gray-700"><strong>Customer Name:</strong> {bookingDetails.customerName}</p>
          <p className="text-lg text-gray-700"><strong>Service Name:</strong> {bookingDetails.serviceName}</p>
          <p className="text-lg text-gray-700"><strong>Booking Date:</strong> {new Date(bookingDetails.bookingDate).toLocaleString()}</p>
          <p className="text-lg text-gray-700"><strong>Service From Date:</strong> {new Date(bookingDetails.serviceFromDate).toLocaleString()}</p>
          <p className="text-lg text-gray-700"><strong>Service To Date:</strong> {new Date(bookingDetails.serviceToDate).toLocaleString()}</p>
          <p className="text-lg text-gray-700"><strong>Days Count:</strong> {bookingDetails.daysCount}</p>
          <p className="text-lg text-gray-700"><strong>Charge:</strong> ${bookingDetails.charge}</p>
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          {!isBookingConfirmed && !isBookingCancelled && (
            <>
              {currentUser.usertype === 'provider' ? (
                <>
                  <button
                    className="bg-red-600 text-white py-2 px-5 rounded-lg shadow hover:bg-red-700 transition duration-300"
                    onClick={handleCancelBooking}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-green-600 text-white py-2 px-5 rounded-lg shadow hover:bg-green-700 transition duration-300"
                    onClick={handleConfirmBooking}
                  >
                    Confirm
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="bg-red-600 text-white py-2 px-5 rounded-lg shadow hover:bg-red-700 transition duration-300"
                    onClick={handleCancelBooking}
                  >
                    Cancel
                  </button>
                  <Link
                    to={`/edit-booking/${id}`}
                    className="bg-blue-600 text-white py-2 px-5 rounded-lg shadow hover:bg-blue-700 transition duration-300"
                  >
                    Edit
                  </Link>
                </>
              )}
            </>
          )}
          {isBookingConfirmed && (
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-2xl" />
              <p className="text-green-500 text-xl font-semibold">Confirmed</p>
            </div>
          )}
          {isBookingCancelled && (
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faTimesCircle} className="text-red-500 text-2xl" />
              <p className="text-red-500 text-xl font-semibold">Cancelled</p>
            </div>
          )}
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <p className="text-lg text-gray-800">{popupMessage}</p>
            <button
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition duration-300"
              onClick={handleClosePopup}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingDetailsPage;
