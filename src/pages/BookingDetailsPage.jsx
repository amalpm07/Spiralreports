import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function BookingDetailsPage() {
  const { id } = useParams();
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    // Fetch booking details using the id from useParams()
    const fetchBookingDetails = async () => {
      try {
        const res = await fetch(`https://hibow.in/api/Booking/GetBookingDetails/${id}`);
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();
        setBookingDetails(data);
      } catch (error) {
        console.error('An error occurred while fetching booking details:', error);
      }
    };

    fetchBookingDetails();
  }, [id]);

  if (!bookingDetails) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-semibold mb-8 text-center">Booking Details</h2>
      <p>Booking ID: {bookingDetails.id}</p>
      {/* Display other details */}
    </div>
  );
}

export default BookingDetailsPage;
