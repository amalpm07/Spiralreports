/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import  { useEffect, useState } from 'react';
import axios from 'axios';
import '../styleComponets/styledComponents.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';

const PaymentStatus = ({ orderId }) => {
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const response = await axios.get(`https://hibow.in/api/Order/GetPaymentDetails?razorpay_order_id=order_OW80l4X4AZYCuA`);
        setPaymentDetails(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching payment details');
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [orderId]);

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
       
        <h2 className={paymentDetails.isPaymentSuccessfull ? 'success' : 'failure'}>
          Payment Status: {paymentDetails.isPaymentSuccessfull ? 'Paid' : 'Unpaid'}
        </h2>
      </header>
      <main className="invoice-body">
        <section className="invoice-details">
          <p><strong>Customer Name:</strong> {paymentDetails.customerName}</p>
          <p><strong>Transaction ID:</strong> {paymentDetails.transactionId}</p>
          <p><strong>Order ID:</strong> {paymentDetails.orderId}</p>
          {/* <p><strong>Payment ID:</strong> {paymentDetails.razorpay_payment_id}</p>
          <p><strong>Signature:</strong> {paymentDetails.razorpay_signature}</p> */}
        </section>
        <section className="invoice-summary">
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Total Amount</td>
                <td>{paymentDetails.totalAmount} INR</td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
      <footer className="invoice-footer">
        <p>Thank you for your business!</p>
      </footer>
    </div>
  );
};

export default PaymentStatus;
