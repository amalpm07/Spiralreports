import React from 'react';
import ServiceProviderList from './pet-Boarding';

const boardinglist = () => {
  const providers = [
    {
      id: 1,
      name: 'Happy Tails Boarding',
      description: 'A home away from home for your pets.',
      location: '123 Paw Street, Petville',
      contact: '555-1234'
    },
    {
      id: 2,
      name: 'Paws & Claws Inn',
      description: 'Comfortable and safe boarding for all pets.',
      location: '456 Fur Avenue, Petcity',
      contact: '555-5678'
    },
    {
      id: 3,
      name: 'The Pet Retreat',
      description: 'Luxury boarding with extra care.',
      location: '789 Whisker Road, Petland',
      contact: '555-9012'
    }
  ];

  return (
    <div className="App">
      <ServiceProviderList providers={providers} />
    </div>
  );
};

export default boardinglist;
