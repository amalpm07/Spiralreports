import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styleComponets/paymentStatus.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom';
import logo from '../assets/leashbench.jpeg'; // Adjust the path as necessary

const PaymentStatus = () => {
  const location = useLocation();
  const { orderId, bookingId } = location.state || {};
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (!orderId) {
        setError('Order ID is missing.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`https://hibow.in/api/Order/GetPaymentDetails?razorpay_order_id=${orderId}&booking_Id=${bookingId}`);
        setPaymentDetails(response.data);
      } catch (error) {
        setError('Error fetching payment details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [orderId, bookingId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="loading">
        <FontAwesomeIcon icon={faSpinner} spin />
        Loading...
      </div>
    );
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="invoice">
      <header className="invoice-header">
        <img src={logo} alt="Company Logo" className="logo" />
        <h2 className={`status ${paymentDetails.transactionDetail.isPaymentSuccessfull ? 'success' : 'failure'}`}>
          Payment Status: {paymentDetails.transactionDetail.isPaymentSuccessfull ? 'Paid' : 'Unpaid'}
        </h2>
      </header>
      <main className="invoice-body">
        <section className="invoice-details">
          <h3>Invoice Details</h3>
          <p><strong>Customer Name:</strong> {paymentDetails.transactionDetail.customerName}</p>
          <p><strong>Transaction ID:</strong> {paymentDetails.transactionDetail.transactionId}</p>
          <p><strong>Order ID:</strong> {paymentDetails.transactionDetail.orderId}</p>
          <p><strong>Booking ID:</strong> {bookingId}</p>
          <p><strong>Service Name:</strong> {paymentDetails.serviceName}</p>
          <p><strong>Booking Date:</strong> {new Date(paymentDetails.bookingDate).toLocaleString()}</p>
          <p><strong>Service From:</strong> {new Date(paymentDetails.serviceFromDate).toLocaleString()}</p>
          <p><strong>Service To:</strong> {new Date(paymentDetails.serviceToDate).toLocaleString()}</p>
          <p><strong>Address:</strong> {paymentDetails.address}</p>
        </section>
        <section className="invoice-summary">
          <h3>Payment Summary</h3>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount (INR)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Total Amount</td>
                <td>{paymentDetails.transactionDetail.totalAmount}</td>
              </tr>
              <tr>
                <td>Payment ID</td>
                <td>{paymentDetails.transactionDetail.razorpay_payment_id}</td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
      <footer className="invoice-footer">
        <p>Thank you for choosing us!</p>
        <button className="print-button" onClick={handlePrint}>Print Invoice</button>
      </footer>
    </div>
  );
};

export default PaymentStatus;
