// src/PetBoarding.js

import React from 'react';
import '../styleComponets/PetBoarding.css'; // Import the CSS file for styling

const PetBoarding = () => {
  return (
    <div className="pet-boarding">
      <div className="banner">
        <h1>Welcome to Pet Boarding</h1>
        <p>Your pets are our priority!</p>
      </div>
      <div className="content">
        <h2>Why Choose Us?</h2>
        <ul>
          <li>Experienced caregivers</li>
          <li>Comfortable and safe environment</li>
          <li>Fun activities and plenty of playtime</li>
        </ul>
        {/* Add more content as needed */}
      </div>
    </div>
  );
};

export default PetBoarding;
