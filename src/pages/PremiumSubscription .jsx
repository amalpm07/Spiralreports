/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, CardActions, Button, Grid, Box, TextField } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import image1 from '../assets/prebanner1.jpeg';
import image2 from '../assets/prebanner2.jpeg';
import image3 from '../assets/prebanner3.jpeg';

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
}));

// eslint-disable-next-line no-unused-vars
const StyledCard = styled(Card)(({ theme, selected }) => ({
  transition: 'transform 0.3s, border-color 0.3s',
  transform: selected ? 'scale(1.05)' : 'scale(1)',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const CardContentCentered = styled(CardContent)({
  textAlign: 'center',
});

const CardActionsCentered = styled(CardActions)({
  justifyContent: 'center',
});

const CenteredBox = styled(Box)({
  textAlign: 'center',
  marginTop: '16px',
});

const QuoteBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  marginBottom: theme.spacing(2),
  textAlign: 'center',
  border: '1px solid #ddd',
  transition: 'transform 0.3s, border-color 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'scale(1.05)',
    borderColor: theme.palette.primary.main,
    boxShadow: theme.shadows[3],
  },
}));

const quotes = [
  "Pets are not our whole life, but they make our lives whole.",
  "The better I get to know men, the more I find myself loving dogs.",
  "No one appreciates the very special genius of your conversation as much as the dog does.",
];

const images = [
  image1,
  image2,
  image3,
 
];

const PremiumSubscription = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [showInvoice, setShowInvoice] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const { currentUser } = useSelector((state) => state.user);

  const bookingDetails = {
    CustomerId: currentUser.id,
    customerName: currentUser.userName,
    charge: selectedPlan === 'Basic' ? 1 : selectedPlan === 'Standard' ? 20 : 30,
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validateMobile = (mobile) => {
    const re = /^[0-9]{10}$/;
    return re.test(String(mobile));
  };

  const handleMobileChange = (e) => {
    const value = e.target.value;
    if (/^[0-9]*$/.test(value)) {
      setMobile(value);
      setMobileError('');
    } else {
      setMobileError('Only numbers are allowed.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateEmail(email) && validateMobile(mobile)) {
      try {
        const orderResponse = await axios.post(
          `https://hibow.in/api/Order/Initiate Order?userId=${currentUser.id}`,
          {
            Key: 'your_key_here', // Replace with your actual key
            OrderId: 'your_order_id_here', // Replace with your actual order ID
            Currency: 'INR',
            TransactionId: 'your_transaction_id_here', // Replace with your actual transaction ID
            customername: bookingDetails.customerName,
            email,
            mobile,
            totalAmount: bookingDetails.charge,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Token': currentUser.guid, // Replace with your actual token
            },
          }
        );

        const { orderId, key } = orderResponse.data;

        const options = {
          key,
          amount: orderResponse.totalAmount,
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
                    'Token': currentUser.guid, // Replace with your actual token
                  },
                }
              );

              if (verifyResponse.data.success) {
                console.log('Payment successful:', verifyResponse.data);
                setShowInvoice(true);

                const paymentInfo = {
                  orderId: response.razorpay_order_id,
                  paymentId: response.razorpay_payment_id,
                  amount: bookingDetails.charge,
                };

                const updateDatabaseResponse = await axios.post(
                  'YOUR_SERVER_ENDPOINT_TO_UPDATE_DATABASE',
                  paymentInfo,
                  {
                    headers: {
                      'Content-Type': 'application/json',
                      'Token': currentUser.guid, // Replace with your actual token
                    },
                  }
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
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (error) {
        console.error('Error initiating payment:', error);
      }
    } else {
      setPaymentError('Please enter a valid email and mobile number');
    }
  };

  return (
    <StyledContainer maxWidth="xl">
<Carousel showThumbs={false} autoPlay infiniteLoop showArrows={true} showStatus={false} showIndicators={true}>
  {images.map((src, index) => (
    <div key={index} style={{ maxWidth: '1000px', margin: 'auto' }}>
      <img src={src} alt={`slide-${index}`} style={{ maxWidth: '100%', height: 'auto' }} />
    </div>
  ))}
</Carousel>
      <Typography variant="h4" gutterBottom align="center" color="primary">
        Select Your Premium Subscription
      </Typography>
      <Typography variant="h6" gutterBottom align="center">
        Choose the plan that best suits your pet's needs
      </Typography>
      <Grid container spacing={4}>
        {['Basic', 'Standard', 'Premium'].map((plan) => (
          <Grid item xs={12} sm={6} md={4} key={plan}>
            <StyledCard
              selected={selectedPlan === plan}
              onClick={() => setSelectedPlan(plan)}
            >
              <CardContentCentered>
                <Typography variant="h5" color="secondary">{plan} Plan</Typography>
                <Typography variant="h6">{`${plan === 'Basic' ? 1 : plan === 'Standard' ? 20 : 30}/month`}</Typography>
              </CardContentCentered>
              <CardActionsCentered>
                <Button
                  variant={selectedPlan === plan ? 'contained' : 'outlined'}
                  color="primary"
                  onClick={() => setSelectedPlan(plan)}
                >
                  Select
                </Button>
              </CardActionsCentered>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
      {selectedPlan && (
        <CenteredBox>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Mobile"
              variant="outlined"
              fullWidth
              margin="normal"
              value={mobile}
              onChange={handleMobileChange}
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 10 }}
              error={!!mobileError}
              helperText={mobileError}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              style={{ marginTop: '16px' }}
            >
              Subscribe
            </Button>
          </form>
          {paymentError && (
            <Typography variant="body2" color="error" align="center" style={{ marginTop: '16px' }}>
              {paymentError}
            </Typography>
          )}
        </CenteredBox>
      )}
      {showInvoice && (
        <CenteredBox>
          <Typography variant="h5" color="primary">
            Payment Successful!
          </Typography>
          <Typography variant="body1">
            Your subscription has been activated.
          </Typography>
        </CenteredBox>
      )}
      <CenteredBox>
        <Typography variant="h6" color="primary" gutterBottom>
          Why Go Premium?
        </Typography>
        <Typography variant="body1" paragraph>
          With our premium subscription, your pet will enjoy top-notch care and exclusive benefits including:
        </Typography>
        <ul>
          <li>Priority booking</li>
          <li>Personalized care plans</li>
          <li>Discounts on additional services</li>
        </ul>
      </CenteredBox>
      <CenteredBox>
        {quotes.map((quote, index) => (
          <QuoteBox key={index}>
            <Typography variant="body1" style={{ fontStyle: 'italic' }}>
              "{quote}"
            </Typography>
          </QuoteBox>
        ))}
      </CenteredBox>
    </StyledContainer>
  );
};

export default PremiumSubscription;
