import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { useSelector } from 'react-redux';

const PaymentPageWrapper = styled.div`
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
`;

const PaymentForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 5px;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
`;

const formatDate = (dateString) => {
  const dateObject = new Date(dateString);
  return dateObject.toLocaleDateString();
};

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingDetails = location.state?.bookingResponse;

  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [emailError, setEmailError] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [paymentDetails, setPaymentDetails] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
console.log(bookingDetails);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validateMobile = (mobile) => {
    const re = /^[0-9]{10}$/;
    return re.test(String(mobile));
  };

  const handleEmailChange = (e) => {
    const { value } = e.target;
    setEmail(value);
    if (value.trim() === '' || validateEmail(value)) {
      setEmailError('');
    } else {
      setEmailError('Please enter a valid email address');
    }
  };

  const handleMobileChange = (e) => {
    const { value } = e.target;
    setMobile(value);
    if (value.trim() === '' || validateMobile(value)) {
      setMobileError('');
    } else {
      setMobileError('Please enter a valid 10-digit mobile number');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateEmail(email) && validateMobile(mobile)) {
      try {
        const orderResponse = await axios.post(
          `https://hibow.in/api/Order/Initiate Order?providerId=${bookingDetails.providerId}`,
          {
            userId: bookingDetails.providerId,
            customerName: bookingDetails.customerName,
            email,
            mobile,
            totalAmount: bookingDetails.charge,
            currency: 'INR',
            key: 'YOUR_RAZORPAY_KEY',
            transactionId: 'YOUR_TRANSACTION_ID',
            orderId: 'YOUR_ORDER_ID',
          }
        );

        const { orderId, key } = orderResponse.data;

        const options = {
          key,
          amount: bookingDetails.charge * 100,
          currency: 'INR',
          order_id: orderId,
          name: 'Your Company Name',
          description: 'Product Description',
          image: 'https://example.com/logo.png',
          handler: async (response) => {
            try {
              const verifyResponse = await axios.post(
                'https://hibow.in/api/Order/PaymentVerification',
                {
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                },
                {
                  headers: {
                    'Content-Type': 'application/json',
                    'Token': currentUser.guid,
                  },
                }
              );

              if (verifyResponse.data.isPaymentSuccessfull) {
                setPaymentDetails({
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                  signature: response.razorpay_signature,
                  customerName: bookingDetails.customerName,
                  serviceName: bookingDetails.serviceName,
                  bookingDate: bookingDetails.bookingDate,
                  serviceFromDate: bookingDetails.serviceFromDate,
                  serviceToDate: bookingDetails.serviceToDate,
                  charge: bookingDetails.charge,
                  email,
                  mobile,
                });

                // Pass both orderId and bookingId to the PaymentStatus page
                navigate('/paymentstatus', {
                  state: {
                    orderId: orderId,
                    bookingId: bookingDetails.id, // Assuming bookingId is part of bookingDetails
                  },
                });
              } else {
                throw new Error('Payment verification failed');
              }
            } catch (error) {
              console.error('Error verifying payment:', error);
              setPaymentError('Payment verification failed');
            }
          },
          prefill: {
            name: bookingDetails.customerName,
            email,
            contact: mobile,
          },
          theme: {
            color: '#3399cc',
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } catch (error) {
        console.error('Error initiating order:', error);
        if (error.response && error.response.data && error.response.data.errors) {
          const errorMessages = Object.values(error.response.data.errors)
            .flat()
            .join(' ');
          setPaymentError(`Error initiating order: ${errorMessages}`);
        } else {
          setPaymentError('Error initiating order. Please try again.');
        }
      }
    } else {
      if (!validateEmail(email)) {
        setEmailError('Please enter a valid email address');
      }
      if (!validateMobile(mobile)) {
        setMobileError('Please enter a valid 10-digit mobile number');
      }
    }
  };

  return (
    <PaymentPageWrapper>
      <h2>Payment Page</h2>
      {bookingDetails && !paymentDetails && (
        <PaymentForm onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Customer Name</Label>
            <Input type="text" value={bookingDetails.customerName} readOnly />
          </FormGroup>
          <FormGroup>
            <Label>Service Name</Label>
            <Input type="text" value={bookingDetails.serviceName} readOnly />
          </FormGroup>
          <FormGroup>
            <Label>Booking Date</Label>
            <Input type="text" value={formatDate(bookingDetails.bookingDate)} readOnly />
          </FormGroup>
          <FormGroup>
            <Label>Service From Date</Label>
            <Input type="text" value={formatDate(bookingDetails.serviceFromDate)} readOnly />
          </FormGroup>
          <FormGroup>
            <Label>Service To Date</Label>
            <Input type="text" value={formatDate(bookingDetails.serviceToDate)} readOnly />
          </FormGroup>
          <FormGroup>
            <Label>Charge</Label>
            <Input type="text" value={bookingDetails.charge} readOnly />
          </FormGroup>
          <FormGroup>
            <Label>Email</Label>
            <Input
              type="text"
              placeholder="Enter email"
              value={email}
              onChange={handleEmailChange}
            />
            {emailError && <p style={{ color: 'red', marginTop: '5px' }}>{emailError}</p>}
          </FormGroup>
          <FormGroup>
            <Label>Mobile</Label>
            <Input
              type="text"
              placeholder="Enter mobile number"
              value={mobile}
              onChange={handleMobileChange}
            />
            {mobileError && <p style={{ color: 'red', marginTop: '5px' }}>{mobileError}</p>}
          </FormGroup>
          <FormGroup>
            {paymentError && <p style={{ color: 'red', marginTop: '5px' }}>{paymentError}</p>}
            <Input type="submit" value="Proceed to Payment" />
          </FormGroup>
        </PaymentForm>
      )}
      {paymentDetails && (
        <div>
          <h3>Invoice</h3>
          <p><strong>Customer Name:</strong> {paymentDetails.customerName}</p>
          <p><strong>Service Name:</strong> {paymentDetails.serviceName}</p>
          <p><strong>Booking Date:</strong> {formatDate(paymentDetails.bookingDate)}</p>
          <p><strong>Service From Date:</strong> {formatDate(paymentDetails.serviceFromDate)}</p>
          <p><strong>Service To Date:</strong> {formatDate(paymentDetails.serviceToDate)}</p>
          <p><strong>Charge:</strong> {paymentDetails.charge}</p>
          <p><strong>Email:</strong> {paymentDetails.email}</p>
          <p><strong>Mobile:</strong> {paymentDetails.mobile}</p>
          <p><strong>Payment ID:</strong> {paymentDetails.paymentId}</p>
          <p><strong>Order ID:</strong> {paymentDetails.orderId}</p>
          <p><strong>Transaction ID:</strong> {paymentDetails.transactionId}</p>
        </div>
      )}
    </PaymentPageWrapper>
  );
};

export default PaymentPage;
