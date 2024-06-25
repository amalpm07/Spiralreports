import  { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, CardActions, Button, Grid, Box, TextField } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';
import { useSelector } from 'react-redux';

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
  backgroundColor: '#f5f5f5',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
}));

const StyledCard = styled(Card)(({ theme, selected }) => ({
  border: selected ? `2px solid ${theme.palette.primary.main}` : '1px solid #ddd',
  transition: 'transform 0.3s, border-color 0.3s',
  transform: selected ? 'scale(1.05)' : 'scale(1)',
  '&:hover': {
    transform: 'scale(1.05)',
    borderColor: theme.palette.primary.main,
  },
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
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

const PremiumSubscription = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [showInvoice, setShowInvoice] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const { currentUser } = useSelector((state) => state.user);
console.log(currentUser)
  const bookingDetails = {
    CustomerId: currentUser.id,
    customerName: currentUser.userName,
    charge: selectedPlan === 'Basic' ? 10 : selectedPlan === 'Standard' ? 20 : 30,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateEmail(email) && validateMobile(mobile)) {
      try {
        const orderResponse = await axios.post(
          `https://hibow.in/api/Order/Initiate Order?providerId=${currentUser.id}`,
          {
            customername: bookingDetails.customerName,
            email,
            mobile,
            totalAmount: bookingDetails.charge,
            currency: 'INR',
            key: 'YOUR_RAZER_PAY_KEY',
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
                'YOUR_SERVER_ENDPOINT_TO_VERIFY_PAYMENT',
                {
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                  signature: response.razorpay_signature,
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
    <StyledContainer maxWidth="md">
      <Typography variant="h4" gutterBottom align="center" color="primary">
        Select Your Premium Subscription
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
                <Typography variant="h6">{`$${plan === 'Basic' ? 1 : plan === 'Standard' ? 20 : 30}/month`}</Typography>
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
          <form onSubmit={handleSubmit}>
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
              onChange={(e) => setMobile(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
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
    </StyledContainer>
  );
};

export default PremiumSubscription;
