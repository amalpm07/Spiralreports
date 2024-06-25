import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios'; // Import axios for HTTP requests

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
  const bookingDetails = location.state?.bookingResponse;

  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [emailError, setEmailError] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [showInvoice, setShowInvoice] = useState(false);

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
    // Validate email and mobile here before proceeding
    if (validateEmail(email) && validateMobile(mobile)) {
      try {
        // Step 1: Create an order on your server
        const orderResponse = await axios.post(
          `https://hibow.in/api/Order/Initiate Order?providerId=${bookingDetails.providerId}`,
          {
            customername: bookingDetails.customerName,
            email,
            mobile,
            totalAmount: bookingDetails.charge,
            currency: 'INR', // Replace with actual currency if applicable
            key: 'YOUR_RAZER_PAY_KEY', // Replace with actual key
            transactionId: 'YOUR_TRANSACTION_ID', // Replace with actual transaction ID
            orderId: 'YOUR_ORDER_ID', // Replace with actual order ID
          }
        );

        const { orderId, key } = orderResponse.data;

        // Step 2: Configure Razer Pay options
        const options = {
          key, // Use the extracted key from orderResponse
          amount: bookingDetails.charge * 100, // Amount in smallest currency unit (INR here)
          currency: 'INR', // Your currency
          order_id: orderId, // Order ID from your server
          name: 'Your Company Name',
          description: 'Product Description',
          image: 'https://example.com/logo.png', // Your company logo URL
          handler: async (response) => {
            // Step 3: Verify the payment on your server
            try {
              const verifyResponse = await axios.post(
                'YOUR_SERVER_ENDPOINT_TO_VERIFY_PAYMENT',
                {
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                  signature: response.razorpay_signature,
                }
              );

              if (verifyResponse.data.success) {
                // Handle successful payment
                console.log('Payment successful:', verifyResponse.data);
                // Show invoice after successful payment
                setShowInvoice(true);

                // Step 4: Update database with payment information
                const paymentInfo = {
                  orderId: response.razorpay_order_id,
                  paymentId: response.razorpay_payment_id,
                  amount: bookingDetails.charge,
                  // Include other relevant information as needed
                };

                const updateDatabaseResponse = await axios.post(
                  'YOUR_SERVER_ENDPOINT_TO_UPDATE_DATABASE',
                  paymentInfo
                );

                console.log('Database update response:', updateDatabaseResponse.data);
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

        // Step 5: Open the Razer Pay payment window
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
      // Display error messages or handle invalid input
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
      {bookingDetails && (
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
      {showInvoice && (
        <div>
          <h3>Invoice</h3>
          <p><strong>Customer Name:</strong> {bookingDetails.customerName}</p>
          <p><strong>Service Name:</strong> {bookingDetails.serviceName}</p>
          <p><strong>Booking Date:</strong> {formatDate(bookingDetails.bookingDate)}</p>
          <p><strong>Service From Date:</strong> {formatDate(bookingDetails.serviceFromDate)}</p>
          <p><strong>Service To Date:</strong> {formatDate(bookingDetails.serviceToDate)}</p>
          <p><strong>Charge:</strong> {bookingDetails.charge}</p>
          {/* Add more details as needed */}
        </div>
      )}
    </PaymentPageWrapper>
  );
};

export default PaymentPage;
