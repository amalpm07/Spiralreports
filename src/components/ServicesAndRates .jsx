import React, { useState, useEffect } from 'react';
import { FaCcVisa, FaCcMastercard, FaPaypal, FaCcAmex } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../styleComponets/styledComponents.css';

const ServicesAndRates = () => {
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);

  const handleBookNowClick = () => {
    navigate('/booking', { state: { listing } });
  };

  useEffect(() => {
    // Add any necessary logic related to listing or service state here
    if (listing && listing.serviceHome && listing.serviceHome.id) {
      // Perform actions or fetch data related to the listing
    }
  }, [listing]);

  return (
    <div className="services-container">
      <div className="services-header">
        <h3>Our Services & Rates</h3>
      </div>
      <div className="services-body">
        <div className="service-item">
          <h4>Talk & Greet</h4>
          <p>Get to know each other first.</p>
          <p className="service-price">Free</p>
          <button onClick={handleBookNowClick}>Contact</button>
        </div>
        <div className="service-item">
          <h4>Pet Boarding</h4>
          <p>Comfortable boarding for your pets.</p>
          <p className="service-price">From INR 500 /night</p>
          <button>Make Reservation</button>
        </div>
      </div>
      <div className="services-info">
        <p>
          Book with us to enjoy Premium Insurance, 24/7 support, booking guarantee, safe cashless payments, photo updates,
          and more!
        </p>
      </div>
      <div className="payment-methods">
        <FaCcVisa size={24} />
        <FaCcMastercard size={24} />
        <FaPaypal size={24} />
        <FaCcAmex size={24} />
      </div>
    </div>
  );
};

export default ServicesAndRates;
