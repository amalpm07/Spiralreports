/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// QuestionInput.js
import React from 'react';

const QuestionInput = ({ question, value, onChange }) => {
  return (
    <li className='mb-2'>
      <div className='flex flex-col gap-2 mt-2'>
        <input
          type='text'
          id={question.id}
          value={value}
          onChange={onChange}
          className='p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none'
        />
      </div>
    </li>
  );
};

export default QuestionInput;
