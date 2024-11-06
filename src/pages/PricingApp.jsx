import  { useEffect, useState } from "react"; 
import { useSelector } from "react-redux";
import axios from "axios"; 
import { Box, Button, Container, Grid, TextField, Typography } from "@mui/material";
import PricingCard from "./PricingCard"; 
import "../styleComponets/PricingApp.css"; 
import { styled } from '@mui/system';

const themeColors = {
    primary: '#6d4c7d',
    secondary: '#8e5a9f',
    background: '#f3f4f6',
    textPrimary: '#212121',
    textSecondary: '#757575',
    border: '#e0e0e0',
};

const StyledContainer = styled(Container)(({ theme }) => ({
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
    backgroundColor: themeColors.background,
}));

const PricingApp = () => {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [mobileError, setMobileError] = useState('');
    const [showInvoice, setShowInvoice] = useState(false);
    const [paymentError, setPaymentError] = useState('');
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [selectMonthly, setSelectMonthly] = useState(false); 
    const { currentUser } = useSelector((state) => state.user);

    const bookingDetails = {
        CustomerId: currentUser ? currentUser.id : '',
        customerName: currentUser ? currentUser.userName : '',
        charge: selectedPlan === 'Basic' ? (selectMonthly ? 20.99 : 188.9) : 
                selectedPlan === 'Deluxe' ? (selectMonthly ? 34.99 : 349.9) : 
                (selectMonthly ? 79.99 : 499.9),
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

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
    const validateMobile = (mobile) => /^[0-9]{10}$/.test(String(mobile));

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
                        Key: 'your_key_here',
                        OrderId: 'your_order_id_here',
                        Currency: 'INR',
                        TransactionId: 'your_transaction_id_here',
                        customername: bookingDetails.customerName,
                        email,
                        mobile,
                        totalAmount: bookingDetails.charge,
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Token': currentUser.guid,
                        },
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

                            if (verifyResponse.data.success) {
                                setShowInvoice(true);
                                await axios.post(
                                    'YOUR_SERVER_ENDPOINT_TO_UPDATE_DATABASE',
                                    {
                                        orderId: response.razorpay_order_id,
                                        paymentId: response.razorpay_payment_id,
                                        amount: bookingDetails.charge,
                                    },
                                    {
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Token': currentUser.guid,
                                        },
                                    }
                                );
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
                setPaymentError('Payment initiation failed');
            }
        } else {
            setPaymentError('Please enter a valid email and mobile number');
        }
    };

    const handlePlanClick = (plan) => {
        if (!currentUser) {
            setShowLoginPopup(true);
        } else {
            setSelectedPlan((prev) => (prev === plan ? null : plan));
            setEmail(''); // Reset email on plan change
            setMobile(''); // Reset mobile on plan change
            setMobileError(''); // Reset error on plan change
        }
    };

    const handleLoginPopupClose = () => setShowLoginPopup(false);
    const handleLoginPopupYes = () => {
        setShowLoginPopup(false);
        window.location.href = '/sign-in'; 
    };

    return (
        <StyledContainer>
            <header>
                <Typography variant="h4" align="center">Our Subscription Plan</Typography>
            </header>

            <div style={{ textAlign: "center", margin: "1em" }}>
                <p style={{ display: "inline", marginRight: "1em" }}>Annually</p>
                <label style={{ display: "inline", margin: "2em" }}>
                    <input
                        type="checkbox"
                        onChange={() => setSelectMonthly((prev) => !prev)}
                    />
                    <div className="switch-slider"></div>
                </label>
                <p style={{ display: "inline", marginLeft: "5em" }}>Monthly</p>
            </div>

            <Grid container spacing={2} justifyContent="center">
                {['Basic', 'Deluxe', 'Premium'].map((plan) => (
                    <Grid item xs={12} sm={4} key={plan}>
                        <PricingCard
                            title={plan}
                            price={selectMonthly ? (plan === 'Basic' ? "20.99" : plan === 'Deluxe' ? "34.99" : "79.99") : (plan === 'Basic' ? "188.9" : plan === 'Deluxe' ? "349.9" : "499.9")}
                            storage={plan === 'Basic' ? "60 GB Storage" : plan === 'Deluxe' ? "70 GB Storage" : "90 GB Storage"}
                            users={plan === 'Basic' ? "5" : plan === 'Deluxe' ? "10" : "20"}
                            sendUp={plan === 'Basic' ? "5" : plan === 'Deluxe' ? "10" : "20"}
                            selected={selectedPlan === plan}
                            onSelectPlan={() => handlePlanClick(plan)}
                        />
                    </Grid>
                ))}
            </Grid>

            {selectedPlan && currentUser && (
                <Box sx={{ marginTop: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="h6" align="center">Enter Your Details</Typography>
                    <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px', margin: 'auto' }}>
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
                            error={!!mobileError}
                            helperText={mobileError}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="large"
                            fullWidth
                            sx={{ marginTop: '16px' }}
                        >
                            Subscribe
                        </Button>
                    </form>
                    {paymentError && (
                        <Typography variant="body2" color="error" align="center" style={{ marginTop: '16px' }}>
                            {paymentError}
                        </Typography>
                    )}
                </Box>
            )}

            {showInvoice && (
                <Box sx={{ textAlign: 'center', marginTop: 4 }}>
                    <Typography variant="h5" color="primary">Payment Successful!</Typography>
                    <Typography variant="body1">Your subscription has been activated.</Typography>
                </Box>
            )}

            {showLoginPopup && (
                <Box sx={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    padding: 3,
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    boxShadow: 6,
                    zIndex: 1000,
                    borderRadius: '12px',
                }}>
                    <Typography variant="h6" gutterBottom>Please log in to access premium subscription features.</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Button variant="contained" color="primary" onClick={handleLoginPopupYes} sx={{ mr: 2 }}>Yes</Button>
                        <Button variant="outlined" color="secondary" onClick={handleLoginPopupClose}>No</Button>
                    </Box>
                </Box>
            )}
        </StyledContainer>
    );
};

export default PricingApp;
