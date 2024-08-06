/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { FaCcVisa, FaCcMastercard, FaPaypal, FaCcAmex } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../styleComponets/styledComponents.css';

const ServicesAndRates = () => {
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  // Function to handle booking button click
  const handleBookNowClick = () => {
    navigate('/booking', { state: { listing } });
  };

  return (
    <>
      {currentUser?.usertype !== 'Provider' && (
        <div className="services-container">
          <div className="services-header">
            <h3>Our Services & Rates</h3>
          </div>
          <div className="services-body">
            {/* Service Item: Booking */}
            <div className="service-item">
              <h4>Booking</h4>
              <p>Book a session with us.</p>
              <p className="service-price">Free</p>
              <button className="btn-book" onClick={handleBookNowClick}>
                Book Now
              </button>
            </div>
            {/* Service Item: Pet Boarding */}
            <div className="service-item">
              <h4>Pet Boarding</h4>
              <p>Comfortable boarding for your pets.</p>
              <button className="btn-reservation">Make Reservation</button>
            </div>
          </div>
          {/* Additional Service Information */}
          <div className="services-info">
            <p>
              Book with us to enjoy Premium Insurance, 24/7 support, booking guarantee, safe cashless payments, photo updates,
              and more!
            </p>
          </div>
          {/* Payment Methods */}
          <div className="payment-methods">
            <FaCcVisa size={24} className="payment-icon" />
            <FaCcMastercard size={24} className="payment-icon" />
            <FaPaypal size={24} className="payment-icon" />
            <FaCcAmex size={24} className="payment-icon" />
          </div>
        </div>
      )}
    </>
  );
};

export default ServicesAndRates;
