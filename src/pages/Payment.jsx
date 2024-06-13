
import axios from 'axios';

const RazerPayButton = () => {
    const handlePayment = async () => {
        // Fetch payment details from your backend
        const paymentDetails = await axios.post('/api/payment-details', {
            amount: 1000, // Amount in the smallest currency unit
        });

        const options = {
            key: paymentDetails.data.key, // Enter the Key ID generated from the Dashboard
            amount: paymentDetails.data.amount,
            currency: paymentDetails.data.currency,
            name: paymentDetails.data.name,
            description: paymentDetails.data.description,
            image: paymentDetails.data.image,
            order_id: paymentDetails.data.order_id,
            handler: function (response) {
                // Handle successful payment here
                alert(response.razorpay_payment_id);
                alert(response.razorpay_order_id);
                alert(response.razorpay_signature);
            },
            prefill: {
                name: "Gaurav Kumar",
                email: "gaurav.kumar@example.com",
                contact: "9999999999"
            },
            notes: {
                address: "Razorpay Corporate Office"
            },
            theme: {
                color: "#F37254"
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    return (
        <button onClick={handlePayment}>
            Pay with Razer Pay
        </button>
    );
};

export default RazerPayButton;
