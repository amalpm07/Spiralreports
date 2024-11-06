import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../styleComponets/EditBookingPage.css';

const EditBookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState(location.state?.bookingDetails || {UserType: "defaultUserType", BookingModel: "defaultBookingModel"});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!location.state?.bookingDetails) {
      navigate('/booking-list');
    }
  }, [location, navigate]);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    const newBookingDetails = { ...bookingDetails, [name]: value };

    // Ensure date validity and format
    const fromDate = new Date(newBookingDetails.serviceFromDate);
    const toDate = new Date(newBookingDetails.serviceToDate);
    if (name === "serviceFromDate" || name === "serviceToDate") {
      if (newBookingDetails.serviceFromDate && newBookingDetails.serviceToDate) {
        if (toDate < fromDate) {
          newBookingDetails.serviceToDate = '';
          setError("Service To Date cannot be earlier than Service From Date.");
        } else {
          setError(null);
        }
      } else {
        setError(null);
      }
    }
    setBookingDetails(newBookingDetails);
  };

  const handleCancel = () => {
    navigate('/booking/11', { state: { bookingDetails } });
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    // Log the current booking details for debugging
    console.log("Current bookingDetails:", bookingDetails);

    // Prepare payload with proper checks for required fields
    const payload = {
        bookingRequestModel: {
            ...bookingDetails,
            serviceFromDate: bookingDetails.serviceFromDate ? bookingDetails.serviceFromDate.split('T')[0] : "",
            serviceToDate: bookingDetails.serviceToDate ? bookingDetails.serviceToDate.split('T')[0] : "",
            UserType: bookingDetails.UserType || "defaultUserType", // Ensure UserType is provided
            BookingModel: bookingDetails.BookingModel || "defaultBookingModel" // Ensure BookingModel is provided
        }
    };

    // Log the payload to check for required fields
    console.log("Request payload:", JSON.stringify(payload, null, 2));

    // Check if UserType and BookingModel are defined in the payload
    if (!payload.bookingRequestModel.UserType || !payload.bookingRequestModel.BookingModel) {
        console.error("Validation Error: Missing required fields.");
        setError("UserType and BookingModel are required.");
        setLoading(false);
        return;
    }

    try {
        const response = await fetch("https://hibow.in/api/Booking/EditBooking", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Accept: "*/*"
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Server error response:", errorData);
            setError(errorData.title || "Failed to save booking details. Please check the data and try again.");
            return;
        }

        // Assuming the response contains the updated booking details
        const updatedBookingDetails = await response.json(); 

        // Navigate to the booking detail page with updated data
        navigate('/booking/11', { state: { bookingDetails: updatedBookingDetails } });
    } catch (error) {
        console.error("Error saving booking:", error);
        setError(error.message || "Failed to save booking details.");
    } finally {
        setLoading(false);
    }
};

  return (
    <div className="edit-booking-container">
      <h2 className="edit-booking-heading">Edit Booking</h2>
      {bookingDetails ? (
        <div className="booking-card">
          <div className="booking-info">
            <label className="info-label">Customer Name:</label>
            <p className="info-value">{bookingDetails.customerName}</p>
          </div>
          <div className="booking-info">
            <label className="info-label">Service Name:</label>
            <p className="info-value">{bookingDetails.serviceName}</p>
          </div>
          <div className="booking-info">
            <label className="info-label">Booking Date:</label>
            <p className="info-value">{new Date(bookingDetails.bookingDate).toLocaleString()}</p>
          </div>
          <div className="booking-info">
            <label className="info-label">Service From Date:</label>
            <input
              type="date"
              name="serviceFromDate"
              value={bookingDetails.serviceFromDate?.split('T')[0] || ""}
              onChange={handleDateChange}
              className="info-input"
            />
          </div>
          <div className="booking-info">
            <label className="info-label">Service To Date:</label>
            <input
              type="date"
              name="serviceToDate"
              value={bookingDetails.serviceToDate?.split('T')[0] || ""}
              onChange={handleDateChange}
              className="info-input"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="button-container">
            <button className="button cancel-button" onClick={handleCancel} disabled={loading}>
              Cancel
            </button>
            <button 
              className="button save-button" 
              onClick={handleSave} 
              disabled={loading || error !== null}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      ) : (
        <p className="loading-text">Loading booking details...</p>
      )}
    </div>
  );
};

export default EditBookingPage;