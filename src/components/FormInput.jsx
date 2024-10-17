/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// FormInput.js
import React from 'react';

const FormInput = ({ id, placeholder, type = 'text', value, onChange, required, minLength, maxLength }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className='border border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none'
      id={id}
      required={required}
      minLength={minLength}
      maxLength={maxLength}
      onChange={onChange}
      value={value}
    />
  );
};

export default FormInput;
