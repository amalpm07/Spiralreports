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
    let userData; // Declare userData here
    try {
      if (checkOutDate <= checkInDate) {
        setDateError('Check-out date must be after check-in date');
        return;
      }
  
      const currentDate = new Date();
  
      // Check charge and ensure it's a valid number
      const chargeValue = listing?.answer.find(item => item.answer.question_id === 40)?.answer.ans;
      const charge = typeof chargeValue === 'number' ? chargeValue : parseFloat(chargeValue);
  
      // If charge is not a valid number, handle the error
      if (isNaN(charge)) {
        throw new Error('Invalid charge value. Please check the listing details.');
      }
  
      let bookingData = {
        customerName: currentUser?.userName || "Guest",
        providerId: listing?.serviceHome?.userId,
        serviceName: listing?.serviceHome?.serviceName || "Default Service Name",
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
          customer_id: currentUser?.id || 0, // Use 0 for guest user
          ans: String(answers[questionId]),
        }))
      };
  
      // Check if user is not logged in
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
  
        userData = await addUserRes.json(); // Get user data after successful add
  console.log(userData.id);
  
        // Update bookingData with the guest user's details
        bookingData = {
          ...bookingData,
          customerid: userData.id, // Use the id from the response
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
          customer_id: currentUser?.id || userData.id, // Use the id from the response if guest
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
  
  
  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: answer
    }));
  };

  const handleCheckboxChange = (e, value) => {
    const questionId = e.target.name;

    // Only update the answer for the selected checkbox
    if (e.target.checked) {
      setAnswers(prevAnswers => ({
        ...prevAnswers,
        [questionId]: value
      }));
    } else {
      // If unchecked, clear the answer for that question
      setAnswers(prevAnswers => ({
        ...prevAnswers,
        [questionId]: ''
      }));
    }
  };

  return (
    <BookingFormWrapper>
      <GlobalStyle />
      {currentSection === 1 && (
        <>
          <FormGroup>
            <Span>Email:</Span>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </FormGroup>
          <FormGroup>
            <Span>Phone Number:</Span>
            <Input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number"
            />
          </FormGroup>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <Button onClick={handleProceedTodatepicker}>Proceed to Date Picker</Button>
        </>
      )}

      {currentSection === 2 && (
        <>
          <FormGroup>
            <Span><FiCalendar /> Check-In</Span>
            <DatePicker
              selected={checkInDate}
              onChange={(date) => {
                setCheckInDate(date);
                if (date >= checkOutDate) {
                  setDateError('Check-in date must be before check-out date');
                } else {
                  setDateError('');
                }
              }}
              minDate={new Date()}
              placeholder="Select check-in date"
            />
          </FormGroup>

          <FormGroup>
            <Span><FiCalendar /> Check-Out</Span>
            <DatePicker
              selected={checkOutDate}
              onChange={(date) => {
                setCheckOutDate(date);
                if (date <= checkInDate) {
                  setDateError('Check-out date must be after check-in date');
                } else {
                  setDateError('');
                }
              }}
              minDate={checkInDate}
              placeholder="Select check-out date"
            />
            {dateError && <p style={{ color: 'red', marginTop: '5px' }}>{dateError}</p>}
          </FormGroup>

          <FormGroup>
            <Button onClick={handleProceedToQuestions} disabled={loading}>Next</Button>
          </FormGroup>
        </>
      )}

      {currentSection === 3 && (
        <>
          {loading && <p>Loading questions...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {questions.map((question, index) => (
            <FormGroup key={question.id}>
              <Span>{question.questions}</Span>
              {index === 0 && acceptedPetTypes.length > 0 ? (
                acceptedPetTypes.map(pet => (
                  <Checkbox
                    key={pet}
                    label={pet.charAt(0).toUpperCase() + pet.slice(1)}
                    name={question.id}
                    checked={answers[question.id] === pet}
                    onChange={(e) => handleCheckboxChange(e, pet)}
                  />
                ))
              ) : index === 2 ? (
                <>
                  <Checkbox
                    label="Young"
                    name={question.id}
                    checked={answers[question.id] === 'Young'}
                    onChange={(e) => handleCheckboxChange(e, 'Young')}
                  />
                  <Checkbox
                    label="Adult"
                    name={question.id}
                    checked={answers[question.id] === 'Adult'}
                    onChange={(e) => handleCheckboxChange(e, 'Adult')}
                  />
                  <Checkbox
                    label="Senior"
                    name={question.id}
                    checked={answers[question.id] === 'Senior'}
                    onChange={(e) => handleCheckboxChange(e, 'Senior')}
                  />
                </>
              ) : index === 3 && acceptedPetSizes.length > 0 ? (
                acceptedPetSizes.map(size => (
                  <Checkbox
                    key={size}
                    label={size.charAt(0).toUpperCase() + size.slice(1)}
                    name={question.id}
                    checked={answers[question.id] === size}
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
  currentUser: PropTypes.object,
  listing: PropTypes.object,
};

export default BookingForm;
