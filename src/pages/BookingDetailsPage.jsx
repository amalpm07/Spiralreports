import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

function BookingDetailsPage() {
  const { id } = useParams();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);

  useEffect(() => {
    // Fetch booking details using the id from useParams()
    const fetchBookingDetails = async () => {
      try {
        const res = await fetch(`https://hibow.in/api/Booking/GetBookingDetailsByBookingId?bookingId=${id}`);
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();
        setBookingDetails(data);
        // Update the isBookingConfirmed state based on the fetched data
        setIsBookingConfirmed(data.isConfirmed);
      } catch (error) {
        console.error('An error occurred while fetching booking details:', error);
      }
    };

    fetchBookingDetails();
  }, [id]);

  const handleCancelBooking = async () => {
    try {
      const res = await fetch(`https://hibow.in/api/Booking/CancelBooking?bookingId=${id}&canceledBy=${currentUser.usertype}`, {
        method: 'PUT',
      });
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      setPopupMessage("Booking successfully canceled.");
      setShowPopup(true);
    } catch (error) {
      setPopupMessage(`An error occurred: ${error.message}`);
      setShowPopup(true);
    }
  };

  const handleConfirmBooking = async () => {
    try {
      const res = await fetch(`https://hibow.in/api/Booking/ConfirmBooking?bookingId=${id}`, {
        method: 'PUT',
      });
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      setPopupMessage("Booking successfully confirmed.");
      setShowPopup(true);
      setIsBookingConfirmed(true);
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
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-semibold mb-8 text-center">Booking Details</h2>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <p><strong>Customer Name:</strong> {bookingDetails.customerName}</p>
          <p><strong>Service Name:</strong> {bookingDetails.serviceName}</p>
          <p><strong>Booking Date:</strong> {new Date(bookingDetails.bookingDate).toLocaleString()}</p>
          <p><strong>Service From Date:</strong> {new Date(bookingDetails.serviceFromDate).toLocaleString()}</p>
          <p><strong>Service To Date:</strong> {new Date(bookingDetails.serviceToDate).toLocaleString()}</p>
          <p><strong>Days Count:</strong> {bookingDetails.daysCount}</p>
          <p><strong>Charge:</strong> {bookingDetails.charge}</p>
        </div>
        <div className="flex justify-end space-x-4 mt-4">
          {!isBookingConfirmed ? (
            <>
              <button
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-300"
                onClick={handleCancelBooking}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-300"
                onClick={handleConfirmBooking}
              >
                Confirm
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-2xl" />
              <p className="text-green-500 text-xl font-semibold">Confirmed</p>
            </div>
          )}
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md">
            <p>{popupMessage}</p>
            <button
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
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
