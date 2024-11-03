/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiCalendar } from 'react-icons/fi';
import styled, { createGlobalStyle } from 'styled-components';
import CustomDatePicker from '../components/CustomDatePicker';

// Cache busting function
const addCacheBuster = (url) => {
  return `${url}?v=${import.meta.env.VITE_APP_VERSION}`;
};

// Styled components
const Checkbox = ({ checked, onChange, label, name }) => (
  <label>
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      name={name}
    />
    {label}
  </label>
);

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Roboto', sans-serif;
    background-color: #f8f9fa;
    margin: 0;
    padding: 0;
  }
`;

const BookingFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-shadow: 0px 10px 40px rgba(50, 50, 50, 0.1);
  background-color: #fff;
  border-radius: 5px;
  width: 100%;
  max-width: 800px;
  margin: 20px auto;

  @media (max-width: 768px) {
    padding: 15px;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const Span = styled.span`
  color: #666666;
  font-size: 18px;
  font-weight: 300;
  margin-bottom: 5px;
`;

const Input = styled.input`
  border: 1px solid #e1e1e1;
  padding: 10px 15px;
  border-radius: 5px;
  height: 50px;
  background: transparent;
  box-shadow: none;
  font-size: 16px;
  width: 100%;

  &:focus {
    outline: none;
    border-color: #755AA6;
    box-shadow: 0 0 5px rgba(0, 214, 144, 0.5);
  }

  &::placeholder {
    color: #ccc;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #755AA6; /* Default background color */
  color: #fff; /* Default text color */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-transform: uppercase;
  transition: all 0.3s;
  margin: 10px 0;
  width: 100%;
  max-width: 200px;

  &:hover {
    background-color: #6a4e9b; /* Slightly different color on hover */
  }

  &:disabled {
    background-color: #cccccc; /* Background color when disabled */
    color: #666666; /* Text color when disabled */
    cursor: not-allowed;
  }
`;

// DatePicker component
const DatePicker = ({ selected, onChange, minDate, placeholder }) => (
  <CustomDatePicker
    selected={selected}
    onChange={onChange}
    dateFormat="MM/dd/yyyy"
    className="form-control"
    placeholderText={placeholder}
    minDate={minDate}
  />
);

const BookingForm = () => {
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [currentSection, setCurrentSection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateError, setDateError] = useState('');
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date(new Date().setDate(new Date().getDate() + 1)));
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const location = useLocation();
  const { listing } = location.state || {};
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.currentUser);
  const listingDetails = listing || {};

  const acceptedPetTypes = listingDetails.acceptedPetTypes || [];
  const acceptedPetSizes = listingDetails.acceptedPetSizes || [];

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://hibow.in/api/Booking/GetTheListofQuestions?serviceName=boarding', {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleProceedTodatepicker = () => {
    if (!email || !phoneNumber) {
      setError('Please enter both email and phone number');
      return;
    }

    setCurrentSection(2);
  };

  const handleProceedToQuestions = () => {
    setCurrentSection(3);
  };

  const handleNotification = (message, type) => {
    if (type === 'success') {
      alert(`Success: ${message}`);
    } else if (type === 'error') {
      alert(`Error: ${message}`);
    }
  };

  const handleProceedClick = async () => {
    let userData;
    try {
      if (checkOutDate <= checkInDate) {
        setDateError('Check-out date must be after check-in date');
        return;
      }

      const currentDate = new Date();

      const chargeValue = listing?.answer.find(item => item.answer.question_id === 40)?.answer.ans;
      const charge = typeof chargeValue === 'number' ? chargeValue : parseFloat(chargeValue);

      if (isNaN(charge)) {
        throw new Error('Invalid charge value. Please check the listing details.');
      }

      let bookingData = {
        customerName: currentUser?.userName || "Guest",
        providerId: listing?.serviceHome?.userId,
        serviceName: listing?.serviceHome?.serviceName || "Default Service Name",
        ServiceHomeName: listing?.serviceHome?.hostelName,
        bookingDate: currentDate.toISOString(),
        serviceFromDate: checkInDate.toISOString(),
        serviceToDate: checkOutDate.toISOString(),
        charge: charge,
        isCancelled: false,
        isConfirmed: false,
        isCompleted: false,
        isActive: true,
        cancelledBy: "",
        answers: Object.keys(answers).map((questionId) => ({
          id: 0,
          question_id: parseInt(questionId),
          customer_id: currentUser?.id || 0,
          ans: String(answers[questionId]),
        }))
      };

      if (!currentUser) {
        const userAdd = {
          email,
          phoneNumber,
          usertype: "guest"
        };

        const addUserRes = await fetch('https://hibow.in/api/User/Add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userAdd)
        });

        if (!addUserRes.ok) {
          throw new Error('Failed to add user');
        }

        userData = await addUserRes.json();
        
        bookingData = {
          ...bookingData,
          customerid: userData.id,
        };
      }

      const bookingRes = await fetch('https://hibow.in/api/Booking/BookAService', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingModel: bookingData,
          userType: currentUser ? "Customer" : "guest"
        })
      });

      if (!bookingRes.ok) {
        throw new Error('Failed to book service');
      }

      const bookingResult = await bookingRes.json();

      const answersData = {
        newAnswers: Object.keys(answers).map((questionId) => ({
          id: 0,
          question_id: parseInt(questionId),
          customer_id: currentUser?.id || userData.id,
          ans: String(answers[questionId]),
        }))
      };

      const answersRes = await fetch('https://hibow.in/api/User/AddAnswers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(answersData)
      });

      if (!answersRes.ok) {
        throw new Error('Failed to add answers');
      }

      handleNotification('Booking successful!', 'success');
      navigate('/payment', { state: { bookingResponse: bookingResult } });
      
    } catch (error) {
      handleNotification(error.message, 'error');
    }
  };

  const handleAnswerChange = (id, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [id]: value,
    }));
  };

  const handleCheckboxChange = (e, petType) => {
    const checked = e.target.checked;
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [petType]: checked ? petType : '',
    }));
  };

  return (
    <BookingFormWrapper>
      <GlobalStyle />
      {currentSection === 1 && (
        <>
          <FormGroup>
            <Span>Email</Span>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </FormGroup>
          <FormGroup>
            <Span>Phone Number</Span>
            <Input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number"
            />
          </FormGroup>
          <Button onClick={handleProceedTodatepicker}>Next</Button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </>
      )}

      {currentSection === 2 && (
        <>
          <FormGroup>
            <Span>Check-in Date</Span>
            <DatePicker
              selected={checkInDate}
              onChange={setCheckInDate}
              minDate={new Date()}
              placeholder="Select check-in date"
            />
          </FormGroup>
          <FormGroup>
            <Span>Check-out Date</Span>
            <DatePicker
              selected={checkOutDate}
              onChange={setCheckOutDate}
              minDate={new Date(checkInDate.getTime() + 86400000)} // At least one day after check-in
              placeholder="Select check-out date"
            />
          </FormGroup>
          <Button onClick={handleProceedToQuestions}>Next</Button>
          {dateError && <p style={{ color: 'red' }}>{dateError}</p>}
        </>
      )}

      {currentSection === 3 && (
        <>
          {loading && <p>Loading questions...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {questions.map((question, index) => (
            <FormGroup key={question.id}>
              <Span>{question.questions}</Span>
              {question.questions === 'Breed of your pet' ? (
                <select
                  name={question.id}
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                >
                  <option value="" disabled>Select breed</option>
                  {['Labrador', 'Poodle', 'Beagle', 'Bulldog', 'Other'].map((breed) => (
                    <option key={breed} value={breed}>{breed}</option>
                  ))}
                </select>
              ) : index === 0 && acceptedPetTypes.length > 0 ? (
                acceptedPetTypes.map(pet => (
                  <Checkbox
                    key={pet}
                    label={pet.charAt(0).toUpperCase() + pet.slice(1)}
                    name={question.id}
                    checked={answers[question.id]?.includes(pet)} // Check if the pet type is included
                    onChange={(e) => handleCheckboxChange(e, pet)}
                  />
                ))
                
              ) : index === 2 ? (
                // Existing checkbox logic for age groups
                // Example:
                ['Puppy', 'Adult', 'Senior'].map(ageGroup => (
                  <Checkbox
                    key={ageGroup}
                    label={ageGroup}
                    name={question.id}
                    checked={answers[question.id] === ageGroup}
                    onChange={(e) => handleAnswerChange(question.id, ageGroup)}
                  />
                ))
              ) : index === 3 && acceptedPetSizes.length > 0 ? (
                acceptedPetSizes.map(size => (
                  <Checkbox
                    key={size}
                    label={size.charAt(0).toUpperCase() + size.slice(1)}
                    name={question.id}
                    checked={answers[question.id]?.includes(size)} // Check if the size is included
                    onChange={(e) => handleCheckboxChange(e, size)}
                  />
                ))
              ) : (
                <Input
                  type="text"
                  name={question.id}
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  placeholder={`Enter ${question.questions}`}
                />
              )}
            </FormGroup>
          ))}
          <Button onClick={handleProceedClick} disabled={loading}>
            {loading ? 'Processing...' : 'Confirm Booking'}
          </Button>
        </>
      )}
    </BookingFormWrapper>
  );
};

BookingForm.propTypes = {
  // Add any necessary PropTypes here
};

export default BookingForm;
